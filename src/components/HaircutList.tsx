import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RecommendationCard } from "./RecommendationCard";
import { LazyImage } from "./LazyImage";
import {
  RefreshCw,
  Wand2,
  Upload,
  BookOpen,
  X,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { AnalysisResult } from "../types";
import { ImageCropperModal } from "./ImageCropperModal";
import { FEMALE_LIBRARY, MALE_LIBRARY, HaircutCategory, CATEGORY_LABELS } from "../data/haircutLibrary";
interface HaircutListProps {
  results: AnalysisResult | null;
  generationsLeft: number | null;
  teaserUrl: string | null;
  isGeneratingTeaser: boolean;
  setShowBuyModal: (show: boolean) => void;
  setTryOnStyle: (style: any) => void;

  loadMoreRecommendations: (mode?: 'library' | 'ai') => void;
  isLoadingMore: boolean;
  isLightMode: boolean;
}

export const HaircutList = React.memo(
  ({
    results,
    generationsLeft,
    teaserUrl,
    isGeneratingTeaser,
    setShowBuyModal,
    setTryOnStyle,
    loadMoreRecommendations,
    isLoadingMore,
    isLightMode,
  }: HaircutListProps) => {
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false);
    const [customPromptText, setCustomPromptText] = useState("");
    
    const [cropperFileSrc, setCropperFileSrc] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<HaircutCategory>("short");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCustomUploadClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCropperFileSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    };

    
      
    
    return (
      <div className="w-full">
      {isCustomPromptOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCustomPromptOpen(false)}>
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isLightMode ? 'bg-white' : 'bg-[#1A1525] border border-white/10'}`} onClick={e => e.stopPropagation()}>
            <h3 className={`text-xl font-bold mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Свой вариант</h3>
            <p className={`text-sm mb-4 ${isLightMode ? 'text-gray-600' : 'text-white/70'}`}>
              Опишите желаемую стрижку, укладку или цвет своими словами. Нейросеть сгенерирует образ по вашему описанию.
            </p>
            <textarea
              value={customPromptText}
              onChange={e => setCustomPromptText(e.target.value)}
              placeholder="Например: короткая стрижка с зачесом назад, выбритые виски, пепельный блонд..."
              className={`w-full h-32 p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-colors ${isLightMode ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-black/40 border-white/10 text-white placeholder-white/30'}`}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCustomPromptOpen(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${isLightMode ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/5 text-white hover:bg-white/10'}`}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  if (customPromptText.trim().length > 0) {
                    setTryOnStyle({
                        name: "Свой вариант",
                        keyword: "Свой вариант",
                        description: customPromptText.trim()
                    });
                    setIsCustomPromptOpen(false);
                  }
                }}
                disabled={!customPromptText.trim()}
                className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${!customPromptText.trim() ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}

        {cropperFileSrc && (
          <ImageCropperModal
            imageSrc={cropperFileSrc}
            isLightMode={isLightMode}
            onClose={() => setCropperFileSrc(null)}
            onCropComplete={(croppedBase64) => {
              setTryOnStyle({
                name: "Своя прическа (Кастомная)",
                description: "Фото, загруженное пользователем",
                stylingTips: "Загружено пользователем",
                imageKeyword: "",
                customImageUrl: croppedBase64,
              });
              setCropperFileSrc(null);
            }}
          />
        )}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`h-px flex-1 ${isLightMode ? "bg-gray-200" : "bg-white/10"}`}
          ></div>
          <h3
            className={`font-serif text-xl italic px-4 ${isLightMode ? "text-gray-800" : "text-white/90"}`}
          >
            Рекомендации ИИ
          </h3>
          <div
            className={`h-px flex-1 ${isLightMode ? "bg-gray-200" : "bg-white/10"}`}
          ></div>
        </div>

        <div className="flex flex-col gap-5 lg:gap-6 pb-6">
          {(results.recommendations || []).map((rec, idx) => (
            <RecommendationCard
              key={idx}
              idx={idx}
              rec={rec}
              results={results}
              generationsLeft={generationsLeft}
              teaserUrl={teaserUrl}
              isGeneratingTeaser={isGeneratingTeaser}
              setShowBuyModal={setShowBuyModal}
              setTryOnStyle={setTryOnStyle}
              isLightMode={isLightMode}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          <button 
            onClick={handleCustomUploadClick}
            className={`relative overflow-hidden cursor-pointer flex items-center gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base border w-full sm:w-auto justify-center ${isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm" : "text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"}`}
          >
            <Upload size={16} />
            <span>Своя стрижка (фото)</span>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleCustomUpload} />
          </button>
          
          <button
            onClick={() => {
               setIsCustomPromptOpen(true);
            }}
            className={`flex items-center gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base border w-full sm:w-auto justify-center ${isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm" : "text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"}`}
          >
            <Sparkles size={16} />
            <span>Свой вариант (текст)</span>
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event('open-library'))}
            className={`flex items-center gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base border w-full sm:w-auto justify-center ${isLightMode ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-sm" : "text-amber-100 bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 shadow-[0_8px_32px_rgba(245,158,11,0.15)]"}`}
          >
            <ImageIcon size={16} />
            Каталог стрижек
          </button>
        </div>
      </div>
    );
  },
);
