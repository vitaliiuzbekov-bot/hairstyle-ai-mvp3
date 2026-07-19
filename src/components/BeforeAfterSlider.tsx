import React, { useState, useEffect, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  isLightMode?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, isLightMode }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesReady, setImagesReady] = useState({ before: false, after: false });
  const containerRef = useRef<HTMLDivElement>(null);

  // Пропускаем входящие URL через наш CORS-прокси на бэкенде
  const getProxyUrl = (url: string | null | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url;
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  };
  const proxyBeforeUrl = getProxyUrl(beforeImage);
  const proxyAfterUrl = getProxyUrl(afterImage);

  useEffect(() => {
    if (!proxyBeforeUrl || !proxyAfterUrl) return;
    
    setImagesReady({ before: false, after: false });
    
    const imgBefore = new Image();
    const imgAfter = new Image();

    imgBefore.crossOrigin = "anonymous";
    imgAfter.crossOrigin = "anonymous";

    imgBefore.onload = () => setImagesReady(prev => ({ ...prev, before: true }));
    imgBefore.src = proxyBeforeUrl;

    imgAfter.onload = () => setImagesReady(prev => ({ ...prev, after: true }));
    imgAfter.src = proxyAfterUrl;
  }, [proxyBeforeUrl, proxyAfterUrl]);

  const isReady = imagesReady.before && imagesReady.after;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-[3/4] max-w-[400px] mx-auto overflow-hidden select-none rounded-2xl shadow-xl ${isLightMode ? 'bg-white border border-gray-200' : 'bg-zinc-900 border border-white/10'}`}
    >
      {/* Спиннер предзагрузки */}
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-2"></div>
          <p className="text-sm text-zinc-400">Синхронизация пикселей результата...</p>
        </div>
      )}

      {/* Слой «ПОСЛЕ» (Нижний слой) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <img src={proxyAfterUrl} alt="After" className="w-full h-full object-cover pointer-events-none" />
        <span className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded shadow-md z-20">
          ИИ-РЕЗУЛЬТАТ
        </span>
      </div>

      {/* Слой «ДО» (Верхний слой с обрезкой контейнера без сжатия картинки) */}
      <div 
        className="absolute top-0 bottom-0 left-0 overflow-hidden z-20 pointer-events-none"
        style={{ width: `${Math.max(0.1, sliderPosition)}%` }}
      >
        <div 
          className="absolute top-0 bottom-0 left-0 pointer-events-none"
          style={{ width: `${10000 / Math.max(0.1, sliderPosition)}%`, height: '100%' }}
        >
          <img 
            src={proxyBeforeUrl} 
            alt="Before" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <span className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-md z-20">
            ОБЫЧНОЕ ФОТО
          </span>
        </div>
      </div>

      {/* Ползунок */}
      <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30" style={{ left: `${sliderPosition}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-black font-bold text-xs">↔</span>
        </div>
      </div>

      {/* Трекер мыши */}
      <div 
        className="absolute inset-0 z-40 cursor-ew-resize touch-pan-y"
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onTouchMove={(e) => isDragging && e.touches.length > 0 && handleMove(e.touches[0].clientX)}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchEnd={() => setIsDragging(false)}
      />
    </div>
  );
};
