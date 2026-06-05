import React from "react";
import { ImageIcon, X } from "lucide-react";
import { CachedImage } from "./CachedImage";

interface HistoryItem {
  keyword: string;
  url: string;
  timestamp?: number;
}

interface HistoryCarouselProps {
  history: HistoryItem[];
  imageBase64: string | null;
  deleteHistoryItem: (e: React.MouseEvent, item: HistoryItem) => void;
  formatHistoryDate: (timestamp: number) => string;
  isLightMode?: boolean;
}

export const HistoryCarousel: React.FC<HistoryCarouselProps> = ({
  history,
  imageBase64,
  deleteHistoryItem,
  formatHistoryDate,
  isLightMode,
}) => {
  if (!history || history.length === 0 || imageBase64) return null;

  return (
    <div className="mb-12 max-w-4xl mx-auto text-center animate-in fade-in">
      <h3 className={`text-sm tracking-[0.1em] uppercase mb-4 font-medium flex items-center justify-center gap-2 ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
        <ImageIcon size={14} /> История образов
      </h3>
      <div className="flex overflow-x-auto pb-4 gap-4 px-4 snap-x hide-scrollbar sm:justify-center">
        {history.map((item, index) => (
          <div
            key={index}
            className={`flex-none snap-center relative rounded-xl overflow-hidden border group cursor-pointer w-[120px] h-[160px] sm:w-[150px] sm:h-[200px] ${isLightMode ? 'border-gray-200 shadow-sm' : 'border-white/10'}`}
            onClick={() => window.open(item.url, "_blank")}
          >
            <CachedImage
              src={item.url}
              alt={item.keyword}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <button
              onClick={(e) => deleteHistoryItem(e, item)}
              title="Удалить из истории"
              className={`absolute top-2 right-2 w-6 h-6 rounded-full backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 ${isLightMode ? 'bg-white/80 border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'bg-black/60 border border-white/20 text-white hover:bg-red-500/80'}`}
            >
              <X size={12} />
            </button>

            <div className={`absolute inset-x-0 bottom-0 p-3 pt-12 flex flex-col items-start ${isLightMode ? 'bg-gradient-to-t from-black/60 via-black/20 to-transparent' : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'}`}>
              <p className="text-[10px] sm:text-xs font-semibold text-white/90 truncate w-full text-left">
                {item.keyword}
              </p>
              {item.timestamp && (
                <p className="text-[8px] sm:text-[9px] text-white/80 mt-0.5">
                  {formatHistoryDate(item.timestamp)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
