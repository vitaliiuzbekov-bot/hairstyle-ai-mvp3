import React from "react";
import { AnalysisResult } from "../types";

interface FaceShapeCardProps {
  results: AnalysisResult;
  isLightMode: boolean;
}

export const FaceShapeCard: React.FC<FaceShapeCardProps> = ({ results, isLightMode }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 relative">
      {/* Background ambient glow */}
      <div className={`absolute -inset-4 bg-gradient-to-r blur-3xl opacity-20 -z-10 ${isLightMode ? 'from-blue-100 to-amber-100' : 'from-blue-900/40 to-amber-900/40'}`}></div>
      
      <div className={`rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group transition-all hover:scale-[1.02] border ${isLightMode ? 'bg-white border-gray-100 hover:border-blue-200' : 'bg-[#1a1a1a]/60 backdrop-blur-xl border-white/5 hover:border-white/10'}`}>
        <p className={`text-[10px] md:text-xs uppercase tracking-[0.15em] mb-4 relative z-10 ${isLightMode ? 'text-gray-500 font-semibold' : 'text-white/50'}`}>
          Форма лица
        </p>
        <p className={`font-serif text-lg sm:text-xl font-semibold tracking-tight relative z-10 ${isLightMode ? 'text-gray-900 bg-clip-text' : 'text-white/90'} leading-tight`}>
          {results.faceShape}
        </p>
      </div>

      <div className={`rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group transition-all hover:scale-[1.02] border ${isLightMode ? 'bg-white border-gray-100 hover:border-amber-200' : 'bg-[#1a1a1a]/60 backdrop-blur-xl border-white/5 hover:border-white/10'}`}>
        <p className={`text-[10px] md:text-xs uppercase tracking-[0.15em] mb-4 relative z-10 ${isLightMode ? 'text-gray-500 font-semibold' : 'text-white/50'}`}>
          Тип волос
        </p>
        <p className={`font-serif text-lg sm:text-xl font-semibold tracking-tight relative z-10 ${isLightMode ? 'text-gray-900 bg-clip-text' : 'text-white/90'} leading-tight`}>
          {results.hairDensity}, {results.hairType?.toLowerCase()}
        </p>
      </div>

      <div className={`rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group transition-all hover:scale-[1.02] border ${isLightMode ? 'bg-white border-gray-100 hover:border-emerald-200' : 'bg-[#1a1a1a]/60 backdrop-blur-xl border-white/5 hover:border-white/10'}`}>
        <p className={`text-[10px] md:text-xs uppercase tracking-[0.15em] mb-4 relative z-10 ${isLightMode ? 'text-gray-500 font-semibold' : 'text-white/50'}`}>
          Тон кожи
        </p>
        <p className={`font-serif text-lg sm:text-xl font-semibold tracking-tight relative z-10 ${isLightMode ? 'text-gray-900 bg-clip-text' : 'text-white/90'} leading-tight`}>
          {results.skinTone || "Светлый"}
        </p>
      </div>
      
      <div className={`rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group transition-all hover:scale-[1.02] border ${isLightMode ? 'bg-white border-gray-100 hover:border-purple-200' : 'bg-[#1a1a1a]/60 backdrop-blur-xl border-white/5 hover:border-white/10'}`}>
        <p className={`text-[10px] md:text-xs uppercase tracking-[0.15em] mb-4 relative z-10 ${isLightMode ? 'text-gray-500 font-semibold' : 'text-white/50'}`}>
          Цвет волос
        </p>
        <p className={`font-serif text-lg sm:text-xl font-semibold tracking-tight relative z-10 ${isLightMode ? 'text-gray-900 bg-clip-text' : 'text-white/90'} leading-tight`}>
          {results.hairColor || "Темный"}
        </p>
      </div>
    </div>
  );
};
