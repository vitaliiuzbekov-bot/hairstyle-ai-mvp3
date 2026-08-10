import React from "react";
import { useAnalysisContext } from "../context/AnalysisContext";
import { Sparkles, Share2 } from "lucide-react";

interface PersonalGuideSectionProps {
  tryOnStyle: any;
  styleConsultations: Record<string, string>;
  isLightMode?: boolean;
  exportToPDF: () => void;
  isExportingPDF: boolean;
  generateARPreview: (kw: string, name: string) => void;
  loadingARStyles: Record<string, boolean>;
  arError: string | null;
}

export const PersonalGuideSection: React.FC<PersonalGuideSectionProps> = ({
  tryOnStyle,
  styleConsultations,
  isLightMode,
  exportToPDF,
  isExportingPDF,
  generateARPreview,
  loadingARStyles,
  arError,
}) => {
  const { isProMode, stylistNotes, setStylistNotes } = useAnalysisContext();
  return (
    <div className="mt-6 flex flex-col gap-3">
      {styleConsultations[tryOnStyle.imageKeyword || tryOnStyle.name] && (
        <div
          id="hairdresser-guide-content"
          className={`mb-4 border rounded-2xl p-5 relative ${isLightMode ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-white/5 border-white/10 text-white/90'}`}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 hide-in-pdf">
            <h4 className={`flex items-center gap-2 font-medium text-sm uppercase tracking-widest ${isLightMode ? 'text-gray-500' : 'text-white/80'}`}>
              <Sparkles size={16} className={isLightMode ? 'text-blue-500' : ''} /> Персональный гайд (AI)
            </h4>
            {isProMode && <button
              onClick={exportToPDF}
              disabled={isExportingPDF}
              className={`flex items-center justify-center gap-1.5 text-[11px] font-semibold border px-3.5 py-2 rounded-full transition-all active:scale-[0.98] w-full sm:w-auto ${isLightMode ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'}`}
              title="Сгенерировать PDF / Поделиться результатом"
            >
              <Share2 size={14} />
              {isExportingPDF
                ? "Подготовка PDF..."
                : "Поделиться (PDF)"}
            </button>}
          </div>
          {isProMode && (
            <div className="mb-6 hide-in-pdf">
              <label className={`block text-xs uppercase tracking-widest font-medium mb-1.5 ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>Заметки мастера для клиента</label>
              <textarea 
                value={stylistNotes || ''}
                onChange={(e) => setStylistNotes(e.target.value)}
                placeholder="Добавьте свои комментарии, рецепт окрашивания или рекомендации по уходу..."
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[80px] resize-y ${isLightMode ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400' : 'bg-[#0f0c1b] border-white/10 text-white placeholder:text-white/30'}`}
              />
            </div>
          )}
          {stylistNotes && (
            <div className="mb-6 border-b border-t py-4 border-amber-500/20 bg-amber-500/5 px-4 rounded-lg">
              <h5 className="text-amber-500 font-medium text-sm mb-2">Заметки мастера:</h5>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{stylistNotes}</div>
            </div>
          )}
          <div
            className={`text-sm font-light leading-relaxed space-y-4 font-sans
                       [&>strong]:font-medium [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 ${isLightMode ? '[&>strong]:text-gray-900 text-gray-700' : '[&>strong]:text-white text-white/90'}`}
            dangerouslySetInnerHTML={{
              __html: styleConsultations[tryOnStyle.imageKeyword || tryOnStyle.name],
            }}
          />
        </div>
      )}
      <button
        onClick={() => generateARPreview(tryOnStyle.imageKeyword || tryOnStyle.name, tryOnStyle.name)}
        disabled={loadingARStyles[tryOnStyle.imageKeyword || tryOnStyle.name]}
        className={`w-full font-medium py-4 px-6 rounded-full transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border text-sm sm:text-base ${isLightMode ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300' : 'glass-button hover:bg-white/10 text-white/90 border-white/20'}`}
      >
        <Sparkles size={18} className={isLightMode ? 'text-blue-500' : ''} />
        {loadingARStyles[tryOnStyle.imageKeyword || tryOnStyle.name]
          ? "Генерация..."
          : styleConsultations[tryOnStyle.imageKeyword || tryOnStyle.name]
            ? "🔄 Обновить персональный гайд"
            : "📝 Сгенерировать персональный гайд"}
      </button>
      {arError && (
        <p className="text-xs text-orange-200/90 bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-lg text-center leading-relaxed">
          {arError}
        </p>
      )}
    </div>
  );
};
