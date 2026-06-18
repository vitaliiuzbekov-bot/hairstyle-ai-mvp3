import React, { useEffect, useRef, useState } from 'react';
import { X, Sliders, Save, CheckCircle2, UserCircle2 } from 'lucide-react';
import { getFaceDetector, getImageSegmenter } from '../services/mediapipeTasks';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBase64: string;
  onSave: (finalBase64: string) => void;
  mimeType: string;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen, onClose, originalBase64, onSave, mimeType
}) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [removeBg, setRemoveBg] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('Загрузка моделей...');
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setBrightness(100);
      setContrast(100);
      setRemoveBg(false);
      setFaceDetected(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      imageRef.current = img;
      await runFaceDetection(img);
      drawCanvas();
    };
    img.src = originalBase64.startsWith('data:') ? originalBase64 : `data:${mimeType || 'image/jpeg'};base64,${originalBase64}`;
  }, [isOpen, originalBase64]);

  useEffect(() => {
    if (isOpen && imageRef.current) {
      drawCanvas();
    }
  }, [isOpen, brightness, contrast]);

  const runFaceDetection = async (img: HTMLImageElement) => {
    try {
      setStatus('Ищем лицо на фото...');
      const detector = await getFaceDetector();
      const detections = detector.detect(img);
      
      if (detections.detections.length === 0) {
        setFaceDetected(false);
        setStatus('Лицо не найдено! Нужно фото, где чётко видно ваше лицо.');
      } else {
        setFaceDetected(true);
        setStatus('Лицо найдено. Вы можете скорректировать свет.');
      }
    } catch (err) {
      console.warn("Face detection error:", err);
      // Fallback
      setFaceDetected(true);
      setStatus('Готово к редактированию.');
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal size for processing logic
    const SIZE = 800;
    const scale = Math.min(SIZE / img.width, SIZE / img.height);
    const canvasW = img.width * scale;
    const canvasH = img.height * scale;

    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
  };

  const handleApply = async () => {
    setIsProcessing(true);
    try {
       setStatus(removeBg ? 'Удаляем фон...' : 'Подготовка фото...');
       const canvas = canvasRef.current;
       const img = imageRef.current;
       if (!canvas || !img) return;

       const SIZE = upscale ? 1024 : 800;
       const scale = Math.max(1, Math.min(SIZE / img.width, SIZE / img.height));
       const processCanvas = document.createElement('canvas');
       processCanvas.width = img.width * scale;
       processCanvas.height = img.height * scale;
       const pCtx = processCanvas.getContext('2d')!;
       
       pCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
       pCtx.drawImage(img, 0, 0, processCanvas.width, processCanvas.height);
       pCtx.filter = 'none';

       if (removeBg) {
          try {
            const segmenter = await getImageSegmenter();
            const imgData = pCtx.getImageData(0, 0, processCanvas.width, processCanvas.height);
            
            // ImageSegmenter.segment is synchronous in 'IMAGE' mode.
            const result = segmenter.segment(imgData);
            const maskObj = result.categoryMask;
            
            if (maskObj) {
              const maskArray = maskObj.getAsUint8Array();
              const maskWidth = maskObj.width;
              const maskHeight = maskObj.height;
              
              const bgCanvas = document.createElement('canvas');
              bgCanvas.width = processCanvas.width;
              bgCanvas.height = processCanvas.height;
              const bgCtx = bgCanvas.getContext('2d')!;
              
              // Draw neural gray background
              bgCtx.fillStyle = '#808080';
              bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
              
              const fgData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
              
              // For selfie_segmenter, we determine the person category dynamically.
              // We sample the center of the image, as the person is always in the center of a selfie.
              const cx = Math.floor(maskWidth / 2);
              const cy = Math.floor(maskHeight / 2);
              const centerSamples = [
                maskArray[cy * maskWidth + cx],
                maskArray[Math.max(0, cy - 10) * maskWidth + cx],
                maskArray[Math.min(maskHeight - 1, cy + 10) * maskWidth + cx],
                maskArray[cy * maskWidth + Math.max(0, cx - 10)],
                maskArray[cy * maskWidth + Math.min(maskWidth - 1, cx + 10)]
              ];
              // Find the most frequent value in the center samples
              const personValue = centerSamples.sort((a,b) =>
                centerSamples.filter(v => v===a).length - centerSamples.filter(v => v===b).length
              ).pop() as number;

              // Map mask to processCanvas coordinates
              for (let y = 0; y < bgCanvas.height; y++) {
                for (let x = 0; x < bgCanvas.width; x++) {
                  // Find nearest neighbor pixel in the mask
                  const maskX = Math.floor((x / bgCanvas.width) * maskWidth);
                  const maskY = Math.floor((y / bgCanvas.height) * maskHeight);
                  const maskIdx = maskY * maskWidth + maskX;
                  
                  const maskVal = maskArray[maskIdx];
                  
                  // Copy original image ONLY if the mask matches the person's category
                  if (maskVal === personValue) {
                    const i = (y * bgCanvas.width + x) * 4;
                    fgData.data[i] = imgData.data[i];
                    fgData.data[i + 1] = imgData.data[i + 1];
                    fgData.data[i + 2] = imgData.data[i + 2];
                    fgData.data[i + 3] = 255;
                  }
                }
              }
              bgCtx.putImageData(fgData, 0, 0);
              
              const finalDataUrl = bgCanvas.toDataURL("image/jpeg", 0.9);
              onSave(finalDataUrl.split(',')[1]);
            } else {
              // Fallback
              const dUrl = processCanvas.toDataURL("image/jpeg", 0.9);
              onSave(dUrl.split(',')[1]);
            }
          } catch(err) {
            console.warn("Background removal failed:", err);
            const dUrl = processCanvas.toDataURL("image/jpeg", 0.9);
            onSave(dUrl.split(',')[1]);
          }
       } else {
         const dataUrl = processCanvas.toDataURL("image/jpeg", 0.9);
         onSave(dataUrl.split(',')[1]);
       }
    } catch(err) {
      console.warn("Processing failed", err);
      // Fallback: save what's on canvas
      const dataUrl = canvasRef.current!.toDataURL("image/jpeg", 0.9);
      onSave(dataUrl.split(',')[1]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 flex items-center justify-between border-b dark:border-white/10">
           <h3 className="text-lg font-bold">Подготовка фото</h3>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
           {faceDetected === false && (
             <div className="p-4 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-sm font-medium">
               Мы не смогли чётко распознать лицо. Вы можете продолжить, но если на фото действительно нет лица, ИИ может выдать ошибку.
             </div>
           )}
           {faceDetected === true && (
             <div className="p-3 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium text-center">
               Лицо распознано. Если вы в солнцезащитных очках или фото желтит — поправьте свет и снимите скрывающие лицо аксессуары, иначе результат ИИ может вас разочаровать.
             </div>
           )}
           
           <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center min-h-[300px]">
             <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-[400px] object-contain"
             />
             {isProcessing && (
               <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                 <span className="text-sm font-medium">{status}</span>
               </div>
             )}
           </div>

           <div className="flex flex-col gap-4">
             <div className="flex flex-col gap-1">
               <div className="flex justify-between text-sm">
                 <span className="font-medium text-gray-700 dark:text-gray-300">Яркость</span>
                 <span className="text-gray-500">{brightness}%</span>
               </div>
               <input 
                 type="range" 
                 min="50" max="150" 
                 value={brightness} 
                 onChange={(e) => setBrightness(Number(e.target.value))} 
                 className="w-full accent-indigo-600"
               />
             </div>
             
             <div className="flex flex-col gap-1">
               <div className="flex justify-between text-sm">
                 <span className="font-medium text-gray-700 dark:text-gray-300">Контрастность</span>
                 <span className="text-gray-500">{contrast}%</span>
               </div>
               <input 
                 type="range" 
                 min="50" max="150" 
                 value={contrast} 
                 onChange={(e) => setContrast(Number(e.target.value))} 
                 className="w-full accent-indigo-600"
               />
             </div>

             <label className="flex items-center gap-3 p-3 border dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
               <input 
                 type="checkbox" 
                 checked={removeBg} 
                 onChange={(e) => setRemoveBg(e.target.checked)} 
                 className="w-5 h-5 accent-indigo-600 rounded"
               />
               <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Очистить фон (Серый градиент)</span>
             </label>

             <label className="flex items-center gap-3 p-3 border dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
               <input 
                 type="checkbox" 
                 checked={upscale} 
                 onChange={(e) => setUpscale(e.target.checked)} 
                 className="w-5 h-5 accent-indigo-600 rounded"
               />
               <div className="flex flex-col">
                 <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Улучшить качество (Upscale)</span>
                 <span className="text-xs text-gray-500 dark:text-gray-400">Рекомендуется для пиксельных и мутных фото</span>
               </div>
             </label>
           </div>
        </div>

        <div className="p-6 border-t dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-black/20 rounded-b-2xl">
          <button 
             onClick={onClose}
             className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
          >
             Отмена
          </button>
          <button 
             onClick={handleApply}
             disabled={isProcessing}
             className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <Save size={18} />
             Продолжить
          </button>
        </div>
      </div>
    </div>
  );
};
