import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import f_bob from "../assets/golden_base/f_bob.jpg";
import f_long_straight from "../assets/golden_base/f_long_straight.jpg";

export const ImageSlider = ({ isLightMode }: { isLightMode?: boolean }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) return;
    let frame: number;
    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const pos = 50 + Math.sin(elapsed / 800) * 25; // Animate between 25% and 75% smoothly
      setSliderPos(pos);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isDragging]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
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
      className={`relative w-full shadow-lg aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden cursor-ew-resize select-none border ${isLightMode ? 'border-amber-200 shadow-sm' : 'border-white/10 bg-[#110e18]'}`}
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onMouseMove={(e) => isDragging && handleMove(e.clientX)}
      onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      onTouchMove={(e) => isDragging && handleMove(e.touches[0].clientX)}
    >
      {/* After Image */}
      <img 
         src={f_bob} 
         alt="AI Result" 
         className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
         draggable={false}
      />
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-amber-500/90 backdrop-blur-md rounded text-[10px] sm:text-xs font-bold text-white shadow-sm pointer-events-none">
         ИИ-РЕЗУЛЬТАТ
      </div>
      
      {/* Before Image */}
      <div 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img 
           src={f_long_straight} 
           alt="Before" 
           className="absolute inset-0 w-full h-full object-cover" 
           draggable={false}
        />
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] sm:text-xs font-bold text-white pointer-events-none shadow-sm">
           ОБЫЧНОЕ ФОТО
        </div>
      </div>

      {/* Slider Line and Handle */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] sm:w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"
        style={{ left: `calc(${sliderPos}% - 1px)` }}
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
