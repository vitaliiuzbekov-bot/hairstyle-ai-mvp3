import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { FEMALE_LIBRARY, MALE_LIBRARY, HaircutCategory, CATEGORY_LABELS } from "../data/haircutLibrary";

interface HaircutLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
  genderHint?: string; // "male" or "female"
  onSelectStyle?: (style: any) => void;
}

export const HaircutLibraryModal: React.FC<HaircutLibraryModalProps> = ({
  isOpen,
  onClose,
  isLightMode,
  genderHint,
  onSelectStyle
}) => {
  const [activeCategory, setActiveCategory] = useState<HaircutCategory>("short");
  const [currentGender, setCurrentGender] = useState<"male" | "female">(
    genderHint === "female" || genderHint === "жен" ? "female" : "male"
  );

  if (!isOpen) return null;

  const library = currentGender === "female" ? FEMALE_LIBRARY : MALE_LIBRARY;

  return createPortal(
    <div className={`fixed inset-0 z-[1000] flex flex-col ${isLightMode ? "bg-slate-50" : "bg-[#050508]"} animate-in fade-in duration-300`}>
      <div className={`p-4 flex items-center justify-between border-b ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <h3 className={`font-semibold text-lg ${isLightMode ? "text-gray-900" : "text-white"}`}>Библиотека Стрижек</h3>
        <button onClick={onClose} className={`p-2 rounded-full ${isLightMode ? "bg-gray-100 text-gray-500" : "bg-white/10 text-white"}`}>
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 flex gap-2">
        <button onClick={() => setCurrentGender("male")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${currentGender === "male" ? (isLightMode ? "bg-blue-500 text-white" : "bg-blue-600 text-white") : (isLightMode ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-400")}`}>Мужские</button>
        <button onClick={() => setCurrentGender("female")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${currentGender === "female" ? (isLightMode ? "bg-pink-500 text-white" : "bg-pink-600 text-white") : (isLightMode ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-400")}`}>Женские</button>
      </div>

      <div className="px-4 pb-2">
        <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide`}>
          {(["short", "medium", "long", "creative"] as HaircutCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
                activeCategory === cat 
                  ? (isLightMode ? "bg-gray-900 text-white" : "bg-white text-black")
                  : (isLightMode ? "bg-gray-100 text-gray-600" : "bg-white/5 text-gray-400")
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {library.filter(item => item.category === activeCategory).map((item, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => {
                const styleData = {
                  name: item.name,
                  description: item.description,
                  stylingTips: item.stylingTips,
                  imageKeyword: "",
                  customImageUrl: "",
                };
                if (onSelectStyle) {
                  onSelectStyle(styleData);
                } else {
                  window.dispatchEvent(new CustomEvent('select-style', { detail: styleData }));
                }
                onClose();
              }}
              className={`relative rounded-xl overflow-hidden aspect-[3/4] group text-left border transition-transform shadow-sm ${isLightMode ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/10"} hover:scale-105 cursor-pointer`}
            >
              <div className="absolute inset-0 w-full h-full object-cover rounded-xl overflow-hidden">
                <LazyImage
                  keyword={item.name}
                  gender={currentGender}
                  uniqueName={item.name}
                  results={null as any}
                  autoLoad={true}
                  isLightMode={isLightMode}
                  isLibrary={true}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none rounded-xl" />
              <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                <h4 className="text-white font-medium text-sm leading-tight drop-shadow-md">
                  {item.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
        <div className="h-20" />
      </div>
    </div>,
    document.body
  );
};
