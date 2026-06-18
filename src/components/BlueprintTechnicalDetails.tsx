import React from "react";
import { Zap, Sparkles } from "lucide-react";
import { AnalysisResult } from "../types";

interface BlueprintTechnicalDetailsProps {
  tryOnStyle: any;
  results: AnalysisResult | null;
  isLightMode?: boolean;
  onClose: () => void;
}

export const BlueprintTechnicalDetails: React.FC<BlueprintTechnicalDetailsProps> = ({
  tryOnStyle,
  results,
  isLightMode,
  onClose
}) => {
  return (
    <div className="lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
      <div>
        <h4 className={`text-2xl sm:text-3xl font-serif mb-3 tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
          {tryOnStyle.name}
        </h4>
        <p className={`text-[15px] font-light leading-relaxed mb-6 ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
          Покажите этот экран вашему мастеру для точного воплощения
          задуманного образа. Эта стрижка подобрана с учетом вашей
          геометрии лица и текущей структуры волос.
        </p>
      </div>

      <div className="space-y-4">
        <div className={`rounded-[1.25rem] p-5 shadow-sm border transition-shadow hover:shadow-md ${isLightMode ? 'bg-white border-blue-100' : 'bg-transparent border-white/10 text-white/90'}`}>
          <h5 className={`text-[11px] uppercase tracking-widest mb-4 font-semibold flex items-center gap-2 ${isLightMode ? 'text-blue-600' : 'text-white/60'}`}>
             <div className={`p-1.5 rounded-lg ${isLightMode ? 'bg-blue-50 text-blue-500' : 'bg-white/5'}`}><Zap size={14} /></div>
             Ключевые зоны
          </h5>
          <ul className={`space-y-3.5 text-sm font-light ${isLightMode ? 'text-gray-700' : ''}`}>
            <li className="flex gap-3 items-start">
              <span className={`text-[16px] leading-[1.2] ${isLightMode ? 'text-blue-400' : 'text-white/60'}`}>•</span>
              <span className="leading-relaxed">
                <strong className={isLightMode ? 'font-medium text-gray-900' : ''}>Структура волос:</strong> {results?.hairType},{" "}
                {results?.hairDensity?.toLowerCase()}
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className={`text-[16px] leading-[1.2] ${isLightMode ? 'text-blue-400' : 'text-white/60'}`}>•</span>
              <span className="leading-relaxed">
                <strong className={isLightMode ? 'font-medium text-gray-900' : ''}>Верхняя зона:</strong> Оставить длину для
                текстуры, профилировать по необходимости.
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className={`text-[16px] leading-[1.2] ${isLightMode ? 'text-blue-400' : 'text-white/60'}`}>•</span>
              <span className="leading-relaxed">
                <strong className={isLightMode ? 'font-medium text-gray-900' : ''}>Бока и затылок:</strong> Плавный переход
                (fade) или укорачивание, чтобы подчеркнуть форму лица
                ({results?.faceShape?.toLowerCase()}).
              </span>
            </li>
          </ul>
        </div>

        <div className={`rounded-[1.25rem] p-5 shadow-sm border transition-shadow hover:shadow-md ${isLightMode ? 'bg-white border-amber-100' : 'bg-transparent border-white/10 text-white/90'}`}>
          <h5 className={`text-[11px] uppercase tracking-widest mb-3 font-semibold flex items-center gap-2 ${isLightMode ? 'text-amber-600' : 'text-white/60'}`}>
            <div className={`p-1.5 rounded-lg ${isLightMode ? 'bg-amber-50 text-amber-500' : 'bg-white/5'}`}><Sparkles size={14} /></div>
            Стайлинг (для мастера)
          </h5>
          <p className={`text-sm font-light leading-relaxed px-1 ${isLightMode ? 'text-gray-700' : ''}`}>
            {tryOnStyle.stylingTips}
          </p>
        </div>
      </div>

      <div className={`mt-auto pt-6 border-t ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
        <button
          onClick={onClose}
          className={`w-full font-medium py-4 px-6 rounded-2xl transition-colors active:scale-95 text-[15px] border ${isLightMode ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm' : 'bg-white/5 text-white/90 hover:bg-white/10 border-white/10'}`}
        >
          Вернуться к вариантам
        </button>
      </div>
    </div>
  );
};
