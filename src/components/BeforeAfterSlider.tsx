import React, { useState, useRef, useEffect } from 'react';
import { CachedImage } from './CachedImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSliderComponent: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div 
      className="relative w-full aspect-[3/4] sm:aspect-square md:aspect-[3/4] mx-auto overflow-hidden rounded-xl border border-white/10 select-none cursor-ew-resize touch-none group bg-black/40"
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After Image (Background) - dictating aspect ratio */}
      <CachedImage
        src={afterImage}
        alt="После"
        className="w-full h-auto object-contain pointer-events-none block"
      />
      
      {/* Before Image (Foreground/Clipped) */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <CachedImage
          src={beforeImage}
          alt="До"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none flex items-center justify-center"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] pointer-events-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-900 pointer-events-none opacity-80">
            <path d="M15 18l6-6-6-6M9 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-white border border-white/10 pointer-events-none whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">ДО</div>
      <div className="absolute top-4 right-4 z-10 bg-emerald-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-emerald-100 border border-emerald-500/30 pointer-events-none whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">ПОСЛЕ</div>
    </div>
  );
};

export const BeforeAfterSlider = React.memo(BeforeAfterSliderComponent);
