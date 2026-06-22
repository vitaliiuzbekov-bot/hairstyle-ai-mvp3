import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RecommendationCard } from "./RecommendationCard";
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

import f_pixie from "../../public/golden_base/f_pixie.jpg";
import f_bob from "../../public/golden_base/f_bob.jpg";
import f_long_bob from "../../public/golden_base/f_long_bob.jpg";
import f_long_straight from "../../public/golden_base/f_long_straight.jpg";
import f_long_wavy from "../../public/golden_base/f_long_wavy.jpg";
import f_bangs from "../../public/golden_base/f_bangs.jpg";

import m_buzz from "../../public/golden_base/m_buzz.jpg";
import m_crop from "../../public/golden_base/m_crop.jpg";
import m_pompadour from "../../public/golden_base/m_pompadour.jpg";

const FEMALE_LIBRARY = [
  {
    name: "Пикси (Pixie)",
    description: "Короткая элегантная женская стрижка.",
    customImageUrl: f_pixie,
    stylingTips: "Используйте текстурирующий спрей или легкую пасту.",
  },
  {
    name: "Классический Боб",
    description: "Элегантное каре, прямые волосы.",
    customImageUrl: f_bob,
    stylingTips: "Гладкая укладка феном и утюжком.",
  },
  {
    name: "Удлиненный боб",
    description: "Универсальный боб до ключиц (Lob).",
    customImageUrl: f_long_bob,
    stylingTips: "Легкие волны спреем с морской солью.",
  },
  {
    name: "Длинные прямые",
    description: "Длинные идеально прямые волосы.",
    customImageUrl: f_long_straight,
    stylingTips: "Термозащита и сыворотка для блеска.",
  },
  {
    name: "Длинные волнистые",
    description: "Роскошные объемные волны.",
    customImageUrl: f_long_wavy,
    stylingTips: "Нанесите мусс для объема и накрутите на брашинг.",
  },
  {
    name: "Длинные с челкой",
    description: "Прямые волосы с классической челкой.",
    customImageUrl: f_bangs,
    stylingTips: "Уложите челку круглой щеткой и феном.",
  },
];

const MALE_LIBRARY = [
  {
    name: "Buzz Cut",
    description: "Очень короткая мужская стрижка под машинку.",
    customImageUrl: m_buzz,
    stylingTips: "Не требует укладки, идеальна для спорта.",
  },
  {
    name: "Текстурный Кроп",
    description: "Короткая стрижка с текстурированной челкой.",
    customImageUrl: m_crop,
    stylingTips: "Используйте матовую пасту для подчеркивания текстуры.",
  },
  {
    name: "Помпадур",
    description: "Классическая мужская объемная укладка назад.",
    customImageUrl: m_pompadour,
    stylingTips: "Потребуется помада сильной фиксации и сушка феном.",
  },
];

interface HaircutListProps {
  results: AnalysisResult;
  generationsLeft: number | null;
  teaserUrl: string | null;
  isGeneratingTeaser: boolean;
  setShowBuyModal: (val: boolean) => void;
  setTryOnStyle: (val: any) => void;
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

    const handleCustomUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setCropImageSrc(base64);
        };
        reader.readAsDataURL(file);
        // Reset input value so same file can be uploaded again if needed
        event.target.value = "";
      }
    };

    const handleCropComplete = (croppedBase64: string) => {
      setTryOnStyle({
        name: "Свой референс",
        description: "Кастомная стрижка по вашему фото-референсу.",
        stylingTips: "Следуйте рекомендациям вашего мастера.",
        imageKeyword: "",
        customImageUrl: croppedBase64,
      });
      setCropImageSrc(null);
      setIsLibraryOpen(false);
    };

    return (
      <div className="mt-4">
        {cropImageSrc && (
          <ImageCropperModal
            imageSrc={cropImageSrc}
            onClose={() => setCropImageSrc(null)}
            onCropComplete={handleCropComplete}
            isLightMode={isLightMode}
          />
        )}

        {isLibraryOpen &&
          !cropImageSrc &&
          createPortal(
            <div
              className={`fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300 ${isLightMode ? "bg-black/20" : "bg-black/80"} backdrop-blur-sm`}
            >
              <div
                className={`w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-4 duration-300 ${isLightMode ? "bg-white border-gray-200" : "bg-[#1a1625] border border-white/10"}`}
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
                    Свой референс
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

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {(results?.gender?.toLowerCase()?.includes("female") ||
                    results?.gender?.toLowerCase()?.includes("жен") ||
                    results?.gender?.toLowerCase()?.includes("дев")
                      ? FEMALE_LIBRARY
                      : MALE_LIBRARY
                    ).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTryOnStyle({
                            name: item.name,
                            description: item.description,
                            stylingTips: item.stylingTips,
                            imageKeyword: "",
                            customImageUrl: item.customImageUrl,
                          });
                          setIsLibraryOpen(false);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-[3/4] group text-left border transition-transform hover:scale-105 shadow-sm ${isLightMode ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/10"}`}
                      >
                        <img
                          src={item.customImageUrl || undefined}
                          alt={item.name}
                          loading={idx < 4 ? undefined : "lazy"}
                          fetchPriority={idx < 4 ? "high" : "auto"}
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 flex flex-col justify-end">
                          <span className="text-white text-xs font-medium leading-tight shadow-sm drop-shadow-md">
                            {item.name}
                          </span>
                        </div>
                      </button>
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
            Свой референс
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
