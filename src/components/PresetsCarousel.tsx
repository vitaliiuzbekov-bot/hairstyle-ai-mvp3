import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Wand2 } from "lucide-react";
import { LazyImage } from "./LazyImage";

interface Preset {
  id: string;
  name: string;
  gender: "male" | "female";
}

// Top haircuts presets with actual AI-generated images
const PRESETS: Preset[] = [
  {
    id: "m_french_crop",
    name: "French Crop",
    gender: "male",
  },
  {
    id: "f_pixie",
    name: "Пикси (Pixie)",
    gender: "female",
  },
  {
    id: "m_pompadour",
    name: "Pompadour (Помпадур)",
    gender: "male",
  },
  {
    id: "f_bob",
    name: "Укороченный боб (Short Bob)",
    gender: "female",
  },
  {
    id: "m_buzz",
    name: "Buzz Cut (Под машинку)",
    gender: "male",
  },
  {
    id: "f_shag",
    name: "Шегги (Shag)",
    gender: "female",
  },
  {
    id: "m_quiff",
    name: "Quiff (Квифф)",
    gender: "male",
  },
  {
    id: "f_curls",
    name: "Многослойный Каскад",
    gender: "female",
  }
];

interface PresetsCarouselProps {
  isLightMode: boolean;
  onSelectPreset: (presetName: string) => void;
}

export const PresetsCarousel: React.FC<PresetsCarouselProps> = ({ isLightMode, onSelectPreset }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "male" | "female">("all");

  const filteredPresets = PRESETS.filter(p => filter === "all" || p.gender === filter);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className={`mb-12 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-medium flex items-center gap-2">
            Топ-стрижек месяца
          </h2>
          <p className={`text-sm mt-1 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>
            Выберите стиль и примерьте его на себя с помощью AI
          </p>
        </div>
        
        <div className={`flex p-1 rounded-full border ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-white/5 border-white/10'}`}>
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "all" ? (isLightMode ? 'bg-white shadow text-black' : 'bg-white/20 text-white') : (isLightMode ? 'text-gray-500' : 'text-white/60 hover:text-white')}`}
          >
            Все
          </button>
          <button 
            onClick={() => setFilter("female")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "female" ? (isLightMode ? 'bg-white shadow text-black' : 'bg-white/20 text-white') : (isLightMode ? 'text-gray-500' : 'text-white/60 hover:text-white')}`}
          >
            Женские
          </button>
          <button 
            onClick={() => setFilter("male")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "male" ? (isLightMode ? 'bg-white shadow text-black' : 'bg-white/20 text-white') : (isLightMode ? 'text-gray-500' : 'text-white/60 hover:text-white')}`}
          >
            Мужские
          </button>
        </div>
      </div>

      <div className="relative group">
        <button 
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 ${isLightMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white border border-white/10'}`}
        >
          <ChevronLeft size={24} />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredPresets.map((preset) => (
            <div 
              key={preset.id}
              onClick={() => onSelectPreset(preset.name)}
              className={`snap-start shrink-0 w-[160px] sm:w-[200px] rounded-2xl overflow-hidden cursor-pointer group/card border transition-all hover:scale-[1.02] ${isLightMode ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg' : 'bg-white/5 border-white/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'}`}
            >
              <div className="h-[200px] sm:h-[240px] relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110">
                  <LazyImage
                    keyword={preset.name}
                    gender={preset.gender}
                    uniqueName={preset.name}
                    results={null as any}
                    autoLoad={true}
                    isLightMode={isLightMode}
                    isLibrary={true}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 pointer-events-none" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none">
                  <h3 className="text-white font-medium text-lg leading-tight mb-1">{preset.name}</h3>
                  <div className="flex items-center gap-1.5 text-blue-300 text-sm opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all">
                    <Wand2 size={14} />
                    <span>Примерить</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 ${isLightMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white border border-white/10'}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
