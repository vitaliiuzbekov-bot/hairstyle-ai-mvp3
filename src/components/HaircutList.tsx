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
          {results.recommendations.map((rec, idx) => (
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
            <span>Свое фото</span>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleCustomUpload} />
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event('open-library'))}
            className={`flex items-center gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base border w-full sm:w-auto justify-center ${isLightMode ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-sm" : "text-amber-100 bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 shadow-[0_8px_32px_rgba(245,158,11,0.15)]"}`}
          >
            <ImageIcon size={16} />
            Библиотека стрижек
          </button>
          <button
            onClick={() => {
              if (results && results.recommendations.length > 0) {
                const randomRec =
                  results.recommendations[
                    Math.floor(Math.random() * results.recommendations.length)
                  ];
                setTryOnStyle(randomRec);
              }
            }}
            className={`flex items-center gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base border w-full sm:w-auto justify-center ${isLightMode ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-sm" : "text-indigo-100 bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/30 shadow-[0_8px_32px_rgba(99,102,241,0.15)]"}`}
          >
            <Wand2 size={16} />
            Случайный стиль
          </button>

          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <button
              onClick={() => loadMoreRecommendations('library')}
              disabled={isLoadingMore}
              className={`flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50 border ${isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm" : "text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"}`}
            >
              <BookOpen size={16} />
              Варианты из библиотеки (Бесплатно)
            </button>
            
            <button
              onClick={() => loadMoreRecommendations('ai')}
              disabled={isLoadingMore}
              className={`flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50 border ${isLightMode ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-sm" : "bg-indigo-600/80 text-white hover:bg-indigo-500/80 border-indigo-500/50 shadow-[0_8px_32px_rgba(99,102,241,0.2)]"}`}
            >
              <Sparkles size={16} className={isLoadingMore ? "animate-pulse" : ""} />
              {isLoadingMore
                ? "ИИ генерирует..."
                : "Сгенерировать новые (1 ⭐️)"}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
