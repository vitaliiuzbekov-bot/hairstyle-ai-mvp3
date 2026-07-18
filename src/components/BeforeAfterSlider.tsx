import React, { useState, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  isLightMode?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, isLightMode }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesReady, setImagesReady] = useState({ before: false, after: false });
  const [hasError, setHasError] = useState(false);

  // Эффект предзагрузки изображений в памяти для исключения Race Condition и черных экранов
  useEffect(() => {
    setImagesReady({ before: false, after: false });
    setHasError(false);

    const imgBefore = new Image();
    const imgAfter = new Image();

    // Защита от CORS ограничений для Canvas/Слайдеров
    imgBefore.crossOrigin = "anonymous";
    imgAfter.crossOrigin = "anonymous";

    imgBefore.onload = () => setImagesReady(prev => ({ ...prev, before: true }));
    imgBefore.onerror = () => setHasError(true);
    imgBefore.src = beforeImage;

    imgAfter.onload = () => setImagesReady(prev => ({ ...prev, after: true }));
    imgAfter.onerror = () => setHasError(true);
    imgAfter.src = afterImage;

  }, [beforeImage, afterImage]);

  const isReady = imagesReady.before && imagesReady.after;

  if (hasError) {
    return (
      <div className="w-full h-[400px] bg-zinc-900 flex items-center justify-center text-red-400 p-4 text-center rounded-lg">
        ⚠️ Не удалось загрузить результат. Пожалуйста, обновите страницу или попробуйте позже.
      </div>
    );
  }

  console.log("After URL:", afterImage);

  return (
    <div className={`relative w-full shadow-2xl aspect-[3/4] mx-auto rounded-2xl overflow-hidden select-none max-w-[400px] ${isLightMode ? 'border border-gray-200 bg-white' : 'border border-white/10 bg-black'}`}>
      {/* Спиннер загрузки, пока оба изображения физически не прогрузились в память */}
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-2"></div>
          <p className="text-sm text-zinc-400">Нейросеть завершает обработку пикселей...</p>
        </div>
      )}

      {/* Контейнер «ПОСЛЕ» (Нижний слой) */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={afterImage} 
          alt="After" 
          className="w-full h-full object-cover"
          draggable={false}
        />
        <span className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
          ИИ-РЕЗУЛЬТАТ
        </span>
      </div>

      {/* Контейнер «ДО» (Верхний слой с обрезкой по позиции слайдера) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          // Важно: ширина картинки должна оставаться фиксированной (100% от родителя слайдера), 
          // чтобы при изменении ширины контейнера картинка не сжималась, а обрезалась
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: '100%', height: '100%' }}
          draggable={false}
        />
        <span className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
          ОБЫЧНОЕ ФОТО
        </span>
      </div>

      {/* Watermark Hider (Retouch Stripe) */}
      <div className="absolute bottom-0 right-0 w-32 h-8 bg-black/40 backdrop-blur-md rounded-tl-xl pointer-events-none z-10"></div>

      {/* Разделительная линия и ползунок */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-40 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-white font-bold text-xs">↔</span>
        </div>
      </div>

      {/* Прозрачный слой для перехвата событий мыши/тача */}
      <div 
        className="absolute inset-0 z-40 cursor-ew-resize"
        onMouseMove={(e) => {
          if (!isDragging) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
          setSliderPosition(position);
        }}
        onTouchMove={(e) => {
          if (!isDragging) return;
          if (e.touches.length === 0) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.touches[0].clientX - rect.left;
          const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
          setSliderPosition(position);
        }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchEnd={() => setIsDragging(false)}
      />
    </div>
  );
};
