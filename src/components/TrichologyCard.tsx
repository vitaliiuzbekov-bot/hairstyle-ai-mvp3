import React from "react";
import { Sparkles } from "lucide-react";
import { AnalysisResult } from "../types";

interface TrichologyCardProps {
  results: AnalysisResult;
  isLightMode: boolean;
}

export const TrichologyCard: React.FC<TrichologyCardProps> = ({ results, isLightMode }) => {
  return (
    <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
      isLightMode 
        ? 'bg-gradient-to-br from-teal-50/50 via-white to-emerald-50/50 border-teal-100/50' 
        : 'bg-gradient-to-br from-[#0a0a0a]/80 to-[#121212]/80 backdrop-blur-xl border-emerald-500/10'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl border ${isLightMode ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
          <Sparkles className="text-emerald-500 shrink-0" size={20} />
        </div>
        <h4 className={`text-lg md:text-xl font-serif font-medium tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
          Структура и Качество Волос
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hairline status */}
        <div className={`p-5 rounded-2xl border text-sm flex flex-col justify-between ${
          isLightMode ? 'bg-white border-gray-100 shadow-sm' : 'bg-white/[0.02] border-white/5'
        }`}>
          <div>
            <span className={`text-[10px] uppercase tracking-widest font-semibold block mb-2 ${isLightMode ? 'text-emerald-600/80' : 'text-emerald-400/80'}`}>
              Линия роста
            </span>
            <p className={`font-semibold text-base mb-2 ${isLightMode ? 'text-gray-800' : 'text-white/80'}`}>
              {results.hairlineStatus || "Классическая ровная линия лба"}
            </p>
          </div>
          <p className={`text-xs leading-relaxed mt-3 pt-3 border-t ${isLightMode ? 'text-gray-500 border-gray-100' : 'text-white/40 border-white/5'}`}>
            {results.hairDensity?.toLowerCase().includes("редк") || results.hairlineStatus?.toLowerCase().includes("залыс")
              ? "ИИ автоматически скорректировал форму стрижек, чтобы замаскировать зоны поредения или залысин."
              : "Однородная густота по всей краевой линии роста. Подходят любые типы открытого и закрытого лба."}
          </p>
        </div>

        {/* Hair quality */}
        <div className={`p-5 rounded-2xl border text-sm flex flex-col justify-between ${
          isLightMode ? 'bg-white border-gray-100 shadow-sm' : 'bg-white/[0.02] border-white/5'
        }`}>
          <div>
            <span className={`text-[10px] uppercase tracking-widest font-semibold block mb-2 ${isLightMode ? 'text-emerald-600/80' : 'text-emerald-400/80'}`}>
              Текстура и Плотность
            </span>
            <p className={`font-semibold text-base mb-2 ${isLightMode ? 'text-gray-800' : 'text-white/80'}`}>
              {results.hairQuality || "Волосы средней плотности, эластичные"}
            </p>
          </div>
          <p className={`text-xs leading-relaxed mt-3 pt-3 border-t ${isLightMode ? 'text-gray-500 border-gray-100' : 'text-white/40 border-white/5'}`}>
            Рекомендации по стайлингу и уходу в карточках ниже полностью адаптированы под силу натяжения и удерживающую способность ваших волос.
          </p>
        </div>
      </div>
    </div>
  );
};
