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

  loadMoreRecommendations: () => void;
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

    const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCropperFileSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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
              setIsLibraryOpen(false);
              setCropperFileSrc(null);
            }}
          />
        )}
        
        {isLibraryOpen &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsLibraryOpen(false)}
              ></div>
              <div
                className={`relative w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 ${isLightMode ? "bg-white border border-gray-200" : "bg-[#1a1625] border border-white/10"}`}
              >
                <div
                  className={`p-5 flex justify-between items-center border-b ${isLightMode ? "border-gray-200" : "border-white/10"}`}
                >
                  <h3
                    className={`font-serif text-xl tracking-tight flex items-center gap-2 ${isLightMode ? "text-gray-900" : "text-white"}`}
                  >
                    <BookOpen
                      size={20}
                      className={
                        isLightMode ? "text-indigo-600" : "text-indigo-400"
                      }
                    />
                    Библиотека стрижек
                  </h3>
                  <button
                    onClick={() => setIsLibraryOpen(false)}
                    className={`p-2 rounded-full transition-colors ${isLightMode ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/10 text-white/70"}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] custom-scrollbar">
                  <label
                    className={`cursor-pointer w-full p-4 mb-6 rounded-2xl flex items-center justify-center gap-3 border-2 border-dashed transition-all group ${isLightMode ? "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 text-gray-700" : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white/90"}`}
                  >
                    <Upload
                      size={20}
                      className={`group-hover:-translate-y-1 transition-transform ${isLightMode ? "text-gray-400" : "text-white/50"}`}
                    />
                    <span className="font-medium">
                      Загрузить фото с устройства
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCustomUpload}
                    />
                  </label>

                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`h-px flex-1 ${isLightMode ? "bg-gray-200" : "bg-white/10"}`}
                    ></div>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${isLightMode ? "text-gray-400" : "text-white/40"}`}
                    >
                      Или из нашей базы
                    </span>
                    <div
                      className={`h-px flex-1 ${isLightMode ? "bg-gray-200" : "bg-white/10"}`}
                    ></div>
                  </div>

                  <div className="flex overflow-x-auto gap-2 pb-4 mb-2 custom-scrollbar">
                    {(Object.keys(CATEGORY_LABELS) as HaircutCategory[]).map(cat => (
                       <button 
                         key={cat}
                         onClick={() => setActiveCategory(cat)}
                         className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? (isLightMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white") : (isLightMode ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white/10 text-white/70 hover:bg-white/20")}`}
                       >
                         {CATEGORY_LABELS[cat]}
                       </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {(results?.gender?.toLowerCase()?.includes("female") || results?.gender?.toLowerCase()?.includes("woman") || results?.gender?.toLowerCase()?.includes("girl") ||
                    results?.gender?.toLowerCase()?.includes("жен") ||
                    results?.gender?.toLowerCase()?.includes("дев")
                      ? FEMALE_LIBRARY
                      : MALE_LIBRARY
                    ).filter(item => item.category === activeCategory).map((item, idx) => (
                      <div
                        key={idx}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setTryOnStyle({
                            name: item.name,
                            description: item.description,
                            stylingTips: item.stylingTips,
                            imageKeyword: "",
                            customImageUrl: "",
                          });
                          setIsLibraryOpen(false);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-[3/4] group text-left border transition-transform hover:scale-105 shadow-sm ${isLightMode ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/10"}`}
                      >
                                                <div className="absolute inset-0 w-full h-full object-cover rounded-xl overflow-hidden">
                          <LazyImage
                            keyword={item.name}
                            gender={results?.gender || (results?.gender?.toLowerCase()?.includes("жен") || results?.gender?.toLowerCase()?.includes("дев") ? "woman" : "man")}
                            uniqueName={item.name}
                            description={item.description}
                            results={results || undefined}
                            autoLoad={true} isLightMode={isLightMode}
                          />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 flex flex-col justify-end">
                          <span className="text-white text-sm font-semibold leading-tight shadow-sm drop-shadow-md">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
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
            onClick={() => setIsLibraryOpen(true)}
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

          <button
            onClick={loadMoreRecommendations}
            disabled={isLoadingMore}
            className={`flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50 border ${isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm" : "text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"}`}
          >
            <RefreshCw
              size={16}
              className={isLoadingMore ? "animate-spin" : ""}
            />
            {isLoadingMore
              ? "Поиск вариантов..."
              : "Найти другие крутые варианты"}
          </button>
        </div>
      </div>
    );
  },
);
