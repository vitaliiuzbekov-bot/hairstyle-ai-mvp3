import React from "react";
import { HistoryCarousel } from "./HistoryCarousel";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  keyword: string;
  url: string;
  timestamp?: number;
}

interface HistoryPageProps {
  history: HistoryItem[];
  imageBase64: string | null;
  deleteHistoryItem: (e: React.MouseEvent, item: HistoryItem) => void;
  isLightMode?: boolean;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, imageBase64, deleteHistoryItem, isLightMode }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen p-6 animate-in fade-in slide-in-from-right-8 ${isLightMode ? 'bg-gray-50' : 'bg-[#050508]'}`}>
      <div className={`max-w-4xl mx-auto border rounded-3xl p-6 relative shadow-xl backdrop-blur-md mt-8 ${isLightMode ? 'bg-white border-gray-200' : 'bg-white/10 border-white/10 text-white'}`}>
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-6 left-6 p-2 rounded-full transition-colors z-10 ${isLightMode ? 'hover:bg-gray-100 bg-gray-50' : 'hover:bg-white/20 bg-white/10'}`}
        >
          <ChevronLeft size={20} className={isLightMode ? 'text-gray-500' : 'text-white/60'} />
        </button>
        <div className="pt-2">
            <HistoryCarousel 
                history={history} 
                imageBase64={imageBase64} 
                deleteHistoryItem={deleteHistoryItem}
                isLightMode={isLightMode}
            />
        </div>
      </div>
    </div>
  );
};
