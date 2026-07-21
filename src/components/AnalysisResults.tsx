import React, { useEffect, useRef } from "react";
// HMR trigger
import { Skeleton } from "./Skeleton";
import { AlertCircle, Lock, RefreshCw, Sparkles, Maximize2, Share2, Wand2, ShieldCheck, BookOpen } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { CachedImage } from "./CachedImage";
import { FaceShapeCard } from "./FaceShapeCard";
import { TrichologyCard } from "./TrichologyCard";
import { ColorChangeOnlyCard } from "./ColorChangeOnlyCard";
import { HaircutList } from "./HaircutList";
import { AnalysisResult } from "../types";

import { RotatingFactsLoader } from "./RotatingFactsLoader";

interface AnalysisResultsProps {
  isAnalyzing: boolean;
  results: AnalysisResult | null;
  generationsLeft: number | null;
  teaserUrl: string | null;
  isGeneratingTeaser: boolean;
  setShowBuyModal: (val: boolean) => void;
  checkLimits: () => Promise<boolean>;
  consumeToken: () => Promise<boolean>;
  setTryOnStyle: (val: any) => void;
  loadMoreRecommendations: () => void;
  isLoadingMore: boolean;
  isLightMode: boolean;
  exportToPDF?: (elementId?: string, filename?: string, images?: { before?: string, reference?: string, after?: string }) => void;
  isExportingPDF?: boolean;
  
  imageUrl: string | null;
  imageBase64: string | null;
  mimeType: string | null;
  generateVirtualTryOn: (kw: string, name: string, desc: string, imgUrl?: string) => void;
  vtonResultUrl: string | null;
  loadingVTONStyles: Record<string, boolean>;
  vtonError: string | null;
  onGenerationSuccess?: () => void;
}

const AnalysisResultsComponent: React.FC<AnalysisResultsProps> = ({
  isAnalyzing,
  results,
  generationsLeft,
  teaserUrl,
  isGeneratingTeaser,
  setShowBuyModal,
  checkLimits,
  consumeToken,
  setTryOnStyle,
  loadMoreRecommendations,
  isLoadingMore,
  isLightMode,
  exportToPDF,
  isExportingPDF,
  imageUrl,
  imageBase64,
  mimeType,
  generateVirtualTryOn,
  vtonResultUrl,
  loadingVTONStyles,
  vtonError,
  onGenerationSuccess
}) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [results]);

  return (
    <>
      {isAnalyzing && !results && (
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center min-h-[400px] animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both items-center gap-6">
          <RotatingFactsLoader isLightMode={isLightMode} title="Изучаем ваши черты..." />
          <button
            onClick={() => window.dispatchEvent(new Event('open-library'))}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-all shadow-md active:scale-95 ${isLightMode ? 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30'}`}
          >
            <BookOpen size={18} />
            Полистать каталог пока ИИ думает
          </button>
        </div>
      )}

      {results && (
        <div ref={resultsRef} className="col-span-1 lg:col-span-7 flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-1000 fill-mode-both" id="analysis-results-content">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h3 className={`font-serif text-2xl sm:text-3xl ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
              Результаты анализа
            </h3>
            {exportToPDF && (
              <button
                onClick={() => exportToPDF("analysis-results-content", "neurostylist-analysis.pdf")}
                disabled={isExportingPDF}
                className={`flex items-center justify-center gap-2 text-sm font-semibold border px-4 py-2.5 rounded-full transition-all active:scale-[0.98] w-full sm:w-auto shadow-sm ${
                  isLightMode
                    ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                    : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'
                }`}
                title="Сгенерировать PDF / Поделиться результатом"
              >
                <Share2 size={16} />
                {isExportingPDF ? "Подготовка PDF..." : "Поделиться (PDF)"}
              </button>
            )}
          </div>
          {results.warning && (
            <div className={`px-4 sm:px-5 py-3 rounded-2xl flex items-center gap-3 border ${isLightMode ? 'bg-indigo-50/50 border-indigo-100 text-indigo-700' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200'}`}>
              <ShieldCheck className={`shrink-0 ${isLightMode ? 'text-indigo-500' : 'text-indigo-400'}`} size={18} />
              <p className="text-xs sm:text-sm font-medium leading-relaxed">{results.warning}</p>
            </div>
          )}

          {/* Vitals */}
          <FaceShapeCard results={results} isLightMode={isLightMode} />

          {/* Trichology Analysis Card */}
          <TrichologyCard results={results} isLightMode={isLightMode} />

          {/* Color Change Only */}
          <ColorChangeOnlyCard
            isLightMode={isLightMode}
            imageUrl={imageUrl}
            imageBase64={imageBase64}
            mimeType={mimeType}
            checkLimits={checkLimits}
            consumeToken={consumeToken}
            setShowBuyModal={setShowBuyModal}
            onGenerationSuccess={onGenerationSuccess}
          />

          {/* Recommendations */}
          <HaircutList
            results={results}
            generationsLeft={generationsLeft}
            teaserUrl={teaserUrl}
            isGeneratingTeaser={isGeneratingTeaser}
            setShowBuyModal={setShowBuyModal}
            setTryOnStyle={setTryOnStyle}
            loadMoreRecommendations={loadMoreRecommendations}
            isLoadingMore={isLoadingMore}
            isLightMode={isLightMode}
          />
        </div>
      )}
    </>
  );
};

export const AnalysisResults = React.memo(AnalysisResultsComponent);
