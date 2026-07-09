import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  isLightMode?: boolean;
}

const BeforeAfterSliderComponent: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, isLightMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const beforeImageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSliderPosition = (percentage: number) => {
    // Prevent division by zero and going out of bounds
    const safePercentage = Math.max(0.1, Math.min(percentage, 100));
    
    if (beforeContainerRef.current) {
      beforeContainerRef.current.style.width = `${safePercentage}%`;
    }
    
    if (beforeImageRef.current) {
      beforeImageRef.current.style.width = `${10000 / safePercentage}%`;
    }

    if (handleRef.current) {
      handleRef.current.style.left = `calc(${safePercentage}% - 1px)`;
    }
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    updateSliderPosition((x / rect.width) * 100);
  };

  useEffect(() => {
    const handleMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div 
       ref={containerRef}
      className={`relative w-full shadow-2xl aspect-[3/4] mx-auto rounded-2xl overflow-hidden cursor-ew-resize select-none border max-w-[400px] ${isLightMode ? 'border-gray-200 shadow-md' : 'border-white/10 bg-[#110e18]'}`}
      onMouseDown={(e) => { isDragging.current = true; handleMove(e.clientX); }}
      onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
      onTouchStart={(e) => { isDragging.current = true; handleMove(e.touches[0].clientX); }}
      onTouchMove={(e) => isDragging.current && handleMove(e.touches[0].clientX)}
    >
      {/* Background Image (Shows on the Right) - After Result */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black/5">
        <img
          src={afterImage}
          alt="ИИ-Результат" 
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none block"
          fetchPriority="high"
          loading="eager"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute bottom-4 left-[75%] -translate-x-1/2 px-3 py-1.5 bg-amber-500/95 backdrop-blur-md rounded-md text-[11px] sm:text-xs font-bold text-white shadow-md pointer-events-none z-10 border border-amber-400 tracking-wide whitespace-nowrap">
         ИИ-РЕЗУЛЬТАТ
      </div>
                  
      {/* Foreground Image (Shows on the Left) - Before Result */}
      <div 
         ref={beforeContainerRef}
        className="absolute top-0 bottom-0 left-0 pointer-events-none overflow-hidden"
        style={{ width: '50%' }}
      >
        <div 
          ref={beforeImageRef} 
          className="absolute top-0 bottom-0 left-0 pointer-events-none"
          style={{ width: '200%', height: '100%' }}
        >
          <img
            src={beforeImage}
            alt="Обычное фото" 
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none block bg-black/5"
            fetchPriority="high"
            loading="eager"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-[25%] -translate-x-1/2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-md text-[11px] sm:text-xs font-bold text-gray-900 pointer-events-none shadow-md z-10 border border-gray-200 tracking-wide whitespace-nowrap">
             ОБЫЧНОЕ ФОТО
          </div>
        </div>
      </div>

      {/* Watermark Hider (Retouch Stripe) */}
      <div className="absolute bottom-0 right-0 w-32 h-8 bg-black/40 backdrop-blur-md rounded-tl-xl pointer-events-none z-10"></div>

      {/* Slider Line and Handle */}
      <div 
         ref={handleRef}
        className="absolute top-0 bottom-0 w-[2px] sm:w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
        style={{ left: `calc(50% - 1px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 sm:border-[3px] border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] text-white">
            <div className="flex gap-0 sm:gap-1 items-center">
              <ChevronLeft size={10} strokeWidth={4} />
              <ChevronRight size={10} strokeWidth={4} />
            </div>
        </div>
      </div>
    </div>
  );
};

export const BeforeAfterSlider = React.memo(BeforeAfterSliderComponent);
