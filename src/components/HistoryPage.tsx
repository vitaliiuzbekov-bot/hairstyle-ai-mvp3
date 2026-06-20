import React from "react";
import { HistoryCarousel } from "./HistoryCarousel";
import { ChevronLeft, ImageIcon } from "lucide-react";
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
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${isLightMode ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            <ChevronLeft size={18} />
            <span className="font-medium text-sm">Назад к Анализу</span>
          </button>
          
          <div className={`text-sm font-medium ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>
             Всего: {history?.length || 0}
          </div>
        </div>

        <div className="pt-2 min-h-[400px]">
            <HistoryCarousel 
                history={history} 
                imageBase64={imageBase64} 
                deleteHistoryItem={deleteHistoryItem}
                isLightMode={isLightMode}
            />

            {history?.length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                   <ImageIcon size={24} className="text-white/30" />
                 </div>
                 <p className="text-white/60 mb-6">История пуста</p>
                 <button onClick={() => navigate("/")} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition">
                    Загрузить фото
                 </button>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};
