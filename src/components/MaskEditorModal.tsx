import React, { useRef, useState, useEffect } from "react";
import { X, Eraser, Check, Undo } from "lucide-react";

interface MaskEditorModalProps {
  beforeImage: string;
  afterImage: string;
  onClose: () => void;
  onSave: (mergedDataUrl: string) => void;
}

export const MaskEditorModal: React.FC<MaskEditorModalProps> = ({ beforeImage, afterImage, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const beforeImgRef = useRef<HTMLImageElement | null>(null);
  const afterImgRef = useRef<HTMLImageElement | null>(null);

  // We keep a secondary canvas with the generated image where we erase alpha
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const loadImages = () => {
    return Promise.all([
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = beforeImage;
      }),
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = afterImage;
      })
    ]);
  };

  useEffect(() => {
    loadImages().then(([before, after]) => {
      beforeImgRef.current = before;
      afterImgRef.current = after;
      setImagesLoaded(true);
      initCanvas();
    });
  }, [beforeImage, afterImage]);

  const initCanvas = () => {
    if (!canvasRef.current || !beforeImgRef.current || !afterImgRef.current) return;
    const canvas = canvasRef.current;
    
    // Setup resolutions (use original sizes, assume both have same size)
    const cw = beforeImgRef.current.width;
    const ch = beforeImgRef.current.height;
    
    // Scale down for mobile edit display, but keep logical size high
    // We will use CSS to fit it.
    canvas.width = cw;
    canvas.height = ch;
    
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = cw;
    tempCanvas.height = ch;
    tempCanvasRef.current = tempCanvas;
    
    const tctx = tempCanvas.getContext("2d");
    if (tctx) {
        tctx.drawImage(afterImgRef.current!, 0, 0, cw, ch);
    }
    
    drawComposite();
  };

  const drawComposite = () => {
    if (!canvasRef.current || !beforeImgRef.current || !tempCanvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;
    
    // Draw before image (bottom layer)
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(beforeImgRef.current, 0, 0, cw, ch);
    
    // Draw temp canvas (generated layer with alpha holes) over it
    ctx.drawImage(tempCanvasRef.current, 0, 0, cw, ch);
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !tempCanvasRef.current || !canvasRef.current) return;
    
    e.preventDefault(); // prevent scrolling
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    const tctx = tempCanvasRef.current.getContext("2d");
    if (!tctx) return;
    
    // Erase on temp canvas
    tctx.globalCompositeOperation = "destination-out";
    tctx.beginPath();
    
    // Add soft brush effect
    const gradient = tctx.createRadialGradient(x, y, 0, x, y, brushSize * Math.max(scaleX, scaleY));
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.8)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    
    tctx.fillStyle = gradient;
    tctx.arc(x, y, brushSize * Math.max(scaleX, scaleY), 0, Math.PI * 2);
    tctx.fill();
    tctx.globalCompositeOperation = "source-over"; // reset
    
    drawComposite();
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => onSave(reader.result as string);
        reader.readAsDataURL(blob);
      } else {
        const dataUrl = canvasRef.current!.toDataURL("image/jpeg", 0.95);
        onSave(dataUrl);
      }
    }, "image/jpeg", 0.95);
  };
  
  const handleReset = () => {
     if(tempCanvasRef.current && afterImgRef.current) {
         const tctx = tempCanvasRef.current.getContext("2d");
         if(!tctx) return;
         tctx.clearRect(0, 0, tempCanvasRef.current.width, tempCanvasRef.current.height);
         tctx.drawImage(afterImgRef.current, 0, 0);
         drawComposite();
     }
  }

  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <X size={20} />
        </button>
        <span className="font-medium text-lg">Редактор (Ластик)</span>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 transition">
          <Check size={18} /> Сохранить
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-4">
        <span className="mb-4 text-white/50 text-sm text-center">Проведите по зонам (фон, одежда), чтобы вернуть оригинальное фото.</span>
        
        <div className="relative border border-white/20 rounded-xl overflow-hidden bg-gray-900 pointer-events-auto shadow-2xl flex-shrink basis-auto min-h-0 touch-none">
           <canvas 
              ref={canvasRef}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="w-full h-full object-contain cursor-crosshair max-h-[60vh]"
           />
        </div>
        
        <div className="flex w-full max-w-md items-center gap-4 mt-6 px-4 bg-white/5 rounded-2xl py-4 border border-white/10">
          <Eraser size={24} className="text-white/60" />
          <input 
            type="range"
            min="10"
            max="100"
            value={brushSize}
            onChange={e => setBrushSize(parseInt(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <button onClick={handleReset} className="p-2 bg-white/10 rounded-full hover:bg-orange-500/20 hover:text-orange-400 focus:outline-[none] transition-colors" title="Сбросить">
              <Undo size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
