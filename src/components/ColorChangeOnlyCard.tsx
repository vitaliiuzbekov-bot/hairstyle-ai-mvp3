import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Palette, Image as ImageIcon } from "lucide-react";
import { RotatingFactsLoader } from "./RotatingFactsLoader";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { downloadImage } from "../utils/downloadImage";
import { getMulticlassSegmenter } from "../services/mediapipeTasks";

interface ColorChangeOnlyCardProps {
  isLightMode: boolean;
  imageUrl: string | null;
  imageBase64: string | null;
  mimeType: string | null;
  onGenerationSuccess?: () => void;
}

export const ColorChangeOnlyCard: React.FC<ColorChangeOnlyCardProps> = ({
  isLightMode,
  imageUrl,
  imageBase64,
  mimeType,
  onGenerationSuccess
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBg, setSelectedBg] = useState<string | null>("Оригинал");
  const [isLoading, setIsLoading] = useState(false);
  const [localVtonResultUrl, setLocalVtonResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const maskCacheRef = useRef<any>(null);

  const colors = [
    "Блонд",
    "Русый",
    "Светло-каштановый",
    "Каштановый",
    "Черный",
    "Рыжий",
    "Седой",
    "Розовый",
    "Синий"
  ];
  
  const backgrounds = [
    "Оригинал",
    "Студийный",
    "Салон"
  ];

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  const getMask = async (originalSrc: string): Promise<any> => {
    if (maskCacheRef.current) return maskCacheRef.current;

    let safeOrigSrc = originalSrc;
    if (originalSrc.startsWith("http")) {
       const res = await fetch(originalSrc);
       const blob = await res.blob();
       safeOrigSrc = URL.createObjectURL(blob);
    }
    
    const origImg = await loadImage(safeOrigSrc);

    // Limit size for mobile stability
    let maxDim = 1024;
    let ratio = 1;
    if (origImg.width > maxDim || origImg.height > maxDim) {
      ratio = Math.min(maxDim / origImg.width, maxDim / origImg.height);
    }
    const canvasW = Math.floor(origImg.width * ratio);
    const canvasH = Math.floor(origImg.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(origImg, 0, 0, canvasW, canvasH);
    const origData = ctx.getImageData(0, 0, canvasW, canvasH);

    const segmenter = await getMulticlassSegmenter();
    return new Promise((resolve, reject) => {
        try {
            segmenter.segment(canvas, (result) => {
                const maskObj = result.categoryMask;
                if (!maskObj) throw new Error("No mask returned");
                
                const maskArray = maskObj.getAsUint8Array();
                
                let hairConfArray: Float32Array | null = null;
                let bgConfArray: Float32Array | null = null;
                
                if (result.confidenceMasks && result.confidenceMasks.length > 1) {
                  hairConfArray = new Float32Array(result.confidenceMasks[1].getAsFloat32Array());
                  bgConfArray = new Float32Array(result.confidenceMasks[0].getAsFloat32Array());
                }

                maskCacheRef.current = {
                    array: new Uint8Array(maskArray), 
                    hairConfArray,
                    bgConfArray,
                    width: maskObj.width,
                    height: maskObj.height,
                    origData,
                    origImg: canvas 
                };
                resolve(maskCacheRef.current);
            });
        } catch (error) {
            reject(error);
        }
    });
  };

  const applyArEffectsLocal = async (originalSrc: string, colorName: string | null, bgMode: string | null) => {
    try {
      const maskCache = await getMask(originalSrc);
      const { array: maskArray, width: maskWidth, height: maskHeight, origImg } = maskCache;

      const canvas = document.createElement("canvas");
      canvas.width = origImg.width;
      canvas.height = origImg.height;
      const ctx = canvas.getContext("2d")!;
      
      // 1. Возвращаем оригинальный фон или закрашиваем
      if (bgMode === "Студийный") {
         const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
         grad.addColorStop(0, "#cbd5e1");
         grad.addColorStop(1, "#f8fafc");
         ctx.fillStyle = grad;
         ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgMode === "Салон") {
         const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
         grad.addColorStop(0, "#ffe4e6");
         grad.addColorStop(1, "#fda4af");
         ctx.fillStyle = grad;
         ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
         ctx.drawImage(origImg, 0, 0);
      }

      // 2. Вырезаем передний план если фон изменен
      if (bgMode && bgMode !== "Оригинал") {
          const personCanvas = document.createElement("canvas");
          personCanvas.width = canvas.width;
          personCanvas.height = canvas.height;
          const pctx = personCanvas.getContext("2d", { willReadFrequently: true })!;
          pctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
          
          const pData = pctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const mX = Math.floor((x / canvas.width) * maskWidth);
              const mY = Math.floor((y / canvas.height) * maskHeight);
              const maskIdx = mY * maskWidth + mX;
              
              let alpha = 255;
              if (maskCache.bgConfArray) {
                  // bgConfArray has 1.0 for bg, 0.0 for fg. We want fg opacity.
                  alpha = Math.round((1.0 - maskCache.bgConfArray[maskIdx]) * 255);
              } else {
                  const isFg = maskArray[maskIdx] !== 0; // 0 - это фон
                  alpha = isFg ? 255 : 0;
              }
              
              const px = (y * canvas.width + x) * 4;
              pData.data[px+3] = alpha;
            }
          }
          pctx.putImageData(pData, 0, 0);

          ctx.globalCompositeOperation = "source-over"; 
          ctx.drawImage(personCanvas, 0, 0);
      }

      // 3. Окрашивание волос
      if (colorName) {
          const hairLayerCanvas = document.createElement("canvas");
          hairLayerCanvas.width = canvas.width;
          hairLayerCanvas.height = canvas.height;
          const ahctx = hairLayerCanvas.getContext("2d", { willReadFrequently: true })!;
          ahctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
          
          const hDataActual = ahctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const mX = Math.floor((x / canvas.width) * maskWidth);
              const mY = Math.floor((y / canvas.height) * maskHeight);
              const maskIdx = mY * maskWidth + mX;
              
              let alpha = 0;
              if (maskCache.hairConfArray) {
                  alpha = Math.round(maskCache.hairConfArray[maskIdx] * 255);
              } else {
                  alpha = maskArray[maskIdx] === 1 ? 255 : 0;
              }
              const px = (y * canvas.width + x) * 4;
              hDataActual.data[px+3] = alpha;
            }
          }
          ahctx.putImageData(hDataActual, 0, 0);

          const tintCanvas = document.createElement("canvas");
          tintCanvas.width = canvas.width;
          tintCanvas.height = canvas.height;
          const ttx = tintCanvas.getContext("2d")!;
          
          const colorsCfg: Record<string, { hex: string, mode: GlobalCompositeOperation, opacity: number, needsLighten?: boolean }> = {
            "Блонд": { hex: "#DEB878", mode: "soft-light", opacity: 1.0, needsLighten: true },
            "Рыжий": { hex: "#C64600", mode: "overlay", opacity: 0.85 },
            "Шоколадный": { hex: "#2C1405", mode: "multiply", opacity: 0.6 },
            "Русый": { hex: "#6D5337", mode: "overlay", opacity: 0.75 },
            "Пепельный": { hex: "#9BA3A9", mode: "color", opacity: 0.9, needsLighten: true },
            "Черный": { hex: "#080808", mode: "multiply", opacity: 0.9 },
            "Красный": { hex: "#AF1111", mode: "overlay", opacity: 0.85 },
            "Розовый": { hex: "#DB2777", mode: "soft-light", opacity: 0.9, needsLighten: true },
            "Синий": { hex: "#1D4ED8", mode: "overlay", opacity: 0.85, needsLighten: true },
            "Каштан": { hex: "#3B2211", mode: "multiply", opacity: 0.65 },
            "Светло-каштановый": { hex: "#6B442B", mode: "overlay", opacity: 0.65 },
            "Седой": { hex: "#B8B8B8", mode: "color", opacity: 1.0, needsLighten: true },
            "Мелирование": { hex: "#E9CD6F", mode: "overlay", opacity: 0.7, needsLighten: true }
          };

          const cfg = colorsCfg[colorName] || { hex: "#F5D061", mode: "color", opacity: 0.8 };

          ttx.fillStyle = cfg.hex;
          ttx.fillRect(0, 0, canvas.width, canvas.height);
          ttx.globalCompositeOperation = "destination-in";
          ttx.drawImage(hairLayerCanvas, 0, 0);

          const styledHairCanvas = document.createElement("canvas");
          styledHairCanvas.width = canvas.width;
          styledHairCanvas.height = canvas.height;
          const shtx = styledHairCanvas.getContext("2d")!;
          
          shtx.drawImage(hairLayerCanvas, 0, 0);

          if (cfg.needsLighten) {
             shtx.globalAlpha = 0.45;
             shtx.globalCompositeOperation = "screen";
             shtx.drawImage(hairLayerCanvas, 0, 0);
             shtx.drawImage(hairLayerCanvas, 0, 0); 
          }

          shtx.globalAlpha = cfg.opacity;
          shtx.globalCompositeOperation = cfg.mode;
          shtx.drawImage(tintCanvas, 0, 0);
          
          if (cfg.mode !== "color") {
            shtx.globalAlpha = 0.4;
            shtx.globalCompositeOperation = "color";
            shtx.drawImage(tintCanvas, 0, 0);
          }

          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1.0;
          ctx.drawImage(styledHairCanvas, 0, 0);
      }

      return canvas.toDataURL("image/jpeg", 0.95);
    } catch (e) {
      console.error("Dye/BG error: ", e);
      throw e;
    }
  };

  const handleGenerateEffects = async () => {
    // If neither color nor bg changed, do nothing
    if (!selectedColor && selectedBg === "Оригинал") return;
    
    setIsLoading(true);
    setErrorMsg(null);
    setLocalVtonResultUrl(null);

    try {
      const originalDataUrlSafe = `data:${mimeType || "image/jpeg"};base64,${imageBase64!}`;
      // Allow slight UI render update
      await new Promise(res => setTimeout(res, 50));
      const finalCompositeUrl = await applyArEffectsLocal(originalDataUrlSafe, selectedColor, selectedBg);
      setLocalVtonResultUrl(finalCompositeUrl);
      
      if (onGenerationSuccess) {
        onGenerationSuccess();
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Произошла ошибка при наложении эффектов");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${isLightMode ? 'bg-pink-100 text-pink-600' : 'bg-pink-500/20 text-pink-400'}`}>
          <Palette size={24} />
        </div>
        <h4 className={`font-serif text-xl sm:text-2xl tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
          AR-Студия (Цвет и Фон)
        </h4>
      </div>
      
      <p className={`text-sm mb-6 ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
        Примерьте новый цвет волос и замените задний фон в реальном времени. Это быстро, бесплатно и работает прямо на вашем устройстве!
      </p>

      {!localVtonResultUrl && !isLoading && (
        <>
          <div className="mb-4">
            <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Цвет волос
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selectedColor === color
                      ? "bg-pink-500 text-white border-pink-400 shadow-md"
                      : (isLightMode ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10")
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide flex justify-between items-center ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Замена фона
            </label>
            <div className="flex flex-wrap gap-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedBg(bg)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selectedBg === bg
                      ? "bg-indigo-500 text-white border-indigo-400 shadow-md"
                      : (isLightMode ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10")
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!selectedColor && selectedBg === "Оригинал"}
            onClick={handleGenerateEffects}
            className={`w-full font-bold py-4 px-6 flex items-center justify-center gap-2 transition-all rounded-2xl ${(!selectedColor && selectedBg === "Оригинал") ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : (isLightMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md')}`}
          >
            <Sparkles size={18} />
            Применить изменения
          </button>
          
          {errorMsg && (
             <p className="mt-4 text-xs text-red-500">{errorMsg}</p>
          )}
        </>
      )}

      {isLoading && (
         <div className="py-8">
           <RotatingFactsLoader isLightMode={isLightMode} title="Применяем AR-фильтры... (первый раз может занять пару секунд)" />
         </div>
      )}

      {localVtonResultUrl && (
         <div className="flex flex-col gap-4">
           <BeforeAfterSlider 
             beforeImage={imageUrl || `data:${mimeType || "image/jpeg"};base64,${imageBase64}`}
             afterImage={localVtonResultUrl}
           />
           <p className={`text-xs text-center mb-2 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>Скачайте это фото и загрузите его как "Вашу Базу", если хотите добавить еще и новую стрижку!</p>
           <div className="flex gap-3">
             <button
               onClick={() => downloadImage(localVtonResultUrl, "ar_effects.jpg")}
               className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30'}`}
             >
               Скачать результат
             </button>
           </div>
           
           <button
             onClick={() => {
               setLocalVtonResultUrl(null);
               // keep selectedColor and bg to allow user to tweak
             }}
             className={`mt-2 py-2 text-sm text-center font-medium ${isLightMode ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
           >
             Изменить настройки фильтра
           </button>
         </div>
      )}
    </div>
  );
};

