import React, { useEffect, useRef } from "react";
import { Skeleton } from "./Skeleton";
import { AlertCircle, Lock, RefreshCw, Sparkles, Maximize2, Share2, Wand2 } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { CachedImage } from "./CachedImage";
import { AnalysisResult } from "../types";

import { RotatingFactsLoader } from "./RotatingFactsLoader";

interface AnalysisResultsProps {
  isAnalyzing: boolean;
  results: AnalysisResult | null;
  generationsLeft: number | null;
  teaserUrl: string | null;
  isGeneratingTeaser: boolean;
  setShowBuyModal: (val: boolean) => void;
  setTryOnStyle: (val: any) => void;
  loadMoreRecommendations: () => void;
  isLoadingMore: boolean;
  isLightMode: boolean;
  exportToPDF?: (elementId: string, filename: string) => void;
  isExportingPDF?: boolean;
}

const AnalysisResultsComponent: React.FC<AnalysisResultsProps> = ({
  isAnalyzing,
  results,
  generationsLeft,
  teaserUrl,
  isGeneratingTeaser,
  setShowBuyModal,
  setTryOnStyle,
  loadMoreRecommendations,
  isLoadingMore,
  isLightMode,
  exportToPDF,
  isExportingPDF,
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
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center min-h-[400px] animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both">
          <RotatingFactsLoader isLightMode={isLightMode} title="Анализ и подбор стиля (около 15-30 сек)..." />
        </div>
      )}

      {results && (
        <div ref={resultsRef} className="col-span-1 lg:col-span-7 flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both" id="analysis-results-content">
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
            <div className={`px-5 py-4 rounded-2xl flex items-start gap-4 border ${isLightMode ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-500/10 border-red-500/20 text-red-200'}`}>
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm leading-relaxed">{results.warning}</p>
            </div>
          )}

          {/* Vitals */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 relative">
            {/* Background ambient glow */}
            <div className={`absolute -inset-4 bg-gradient-to-r blur-3xl opacity-20 -z-10 ${isLightMode ? 'from-blue-100 to-amber-100' : 'from-blue-900/40 to-amber-900/40'}`}></div>
            
            <div className={`rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group transition-all hover:-translate-y-1 border ${isLightMode ? 'bg-white/90 border-blue-100 hover:border-blue-300 hover:shadow-md' : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-white/20'}`}>
              <div className={`absolute top-0 right-0 p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${isLightMode ? 'text-blue-500/20' : 'text-white/5'}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <p className={`text-[10px] md:text-xs uppercase tracking-[0.15em] mb-3 relative z-10 ${isLightMode ? 'text-gray-500 font-semibold' : 'text-white/60'}`}>
                Форма лица
              </p>
              <p className={`font-serif text-xl sm:text-2xl font-medium tracking-tight relative z-10 ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
                {results.faceShape}
              </p>
            </div>

            <div className={`rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group transition-all delay-75 hover:-translate-y-1 border ${isLightMode ? 'bg-white/90 border-blue-100 hover:border-blue-300 hover:shadow-md' : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-white/20'}`}>
              <div className={`absolute top-0 right-0 p-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${isLightMode ? 'text-amber-500/20' : 'text-white/5'}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
              <p className={`text-[10px] md:text-xs uppercase tracking-[0.15em] mb-3 relative z-10 ${isLightMode ? 'text-gray-500 font-semibold' : 'text-white/60'}`}>
                Густота
              </p>
              <p className={`font-serif text-xl sm:text-2xl font-medium tracking-tight relative z-10 ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
                {results.hairDensity}
              </p>
            </div>

            <div className={`rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group transition-all delay-150 hover:-translate-y-1 border ${isLightMode ? 'bg-white/90 border-blue-100 hover:border-blue-300 hover:shadow-md' : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-white/20'}`}>
              <div className={`absolute top-0 right-0 p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${isLightMode ? 'text-emerald-500/20' : 'text-white/5'}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className={`text-[10px] md:text-xs uppercase tracking-[0.15em] mb-3 relative z-10 ${isLightMode ? 'text-gray-500 font-semibold' : 'text-white/60'}`}>
                Текстура
              </p>
              <p className={`font-serif text-xl sm:text-2xl font-medium tracking-tight relative z-10 ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
                {results.hairType}
              </p>
            </div>
          </div>

          {/* Trichology Analysis Card */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm ${
            isLightMode 
              ? 'bg-gradient-to-r from-teal-50/50 to-emerald-50/50 border-teal-100' 
              : 'bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border-emerald-500/10'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-emerald-500 shrink-0" size={18} />
              <h4 className={`text-base font-serif font-medium tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
                Трихологический анализ и качество волос
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hairline status */}
              <div className={`p-4 rounded-xl border text-sm flex flex-col justify-between ${
                isLightMode ? 'bg-white/80 border-gray-100' : 'bg-black/20 border-white/5'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold block mb-1 ${isLightMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                    Линия роста волос и зоны
                  </span>
                  <p className={`font-medium mb-1.5 ${isLightMode ? 'text-gray-800' : 'text-white/80'}`}>
                    {results.hairlineStatus || "Классическая ровная линия лба"}
                  </p>
                </div>
                <p className={`text-xs leading-relaxed mt-2 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>
                  {results.hairDensity?.toLowerCase().includes("редк") || results.hairlineStatus?.toLowerCase().includes("залыс")
                    ? "⚠️ Особенности: ИИ автоматически скорректировал форму стрижек, чтобы замаскировать зоны поредения или залысин."
                    : "✨ Особенности: Однородная густота по всей краевой линии роста. Подходят любые типы открытого и закрытого лба."}
                </p>
              </div>

              {/* Hair quality */}
              <div className={`p-4 rounded-xl border text-sm flex flex-col justify-between ${
                isLightMode ? 'bg-white/80 border-gray-100' : 'bg-black/20 border-white/5'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold block mb-1 ${isLightMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                    Структура и качество полотна
                  </span>
                  <p className={`font-medium mb-1.5 ${isLightMode ? 'text-gray-800' : 'text-white/80'}`}>
                    {results.hairQuality || "Волосы средней плотности, эластичные"}
                  </p>
                </div>
                <p className={`text-xs leading-relaxed mt-2 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>
                  Рекомендации по стайлингу и уходу в карточках ниже полностью адаптированы под силу натяжения и удерживающую способность ваших волос.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-px flex-1 ${isLightMode ? 'bg-gray-200' : 'bg-white/10'}`}></div>
              <h3 className={`font-serif text-xl italic px-4 ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>
                Рекомендации ИИ
              </h3>
              <div className={`h-px flex-1 ${isLightMode ? 'bg-gray-200' : 'bg-white/10'}`}></div>
            </div>

            <div className="flex flex-col gap-5 lg:gap-6 pb-6">
              {results.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`opacity-0 animate-fade-in-up rounded-2xl overflow-hidden transition-all duration-500 group flex flex-col sm:flex-row items-stretch border ${isLightMode ? 'bg-white shadow-md border-gray-200 hover:shadow-lg' : 'glass-panel hover:border-white/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-white/10'}`}
                  style={{ animationDelay: `${300 + idx * 150}ms` }}
                >
                  <div className={`w-full sm:w-[300px] shrink-0 relative overflow-hidden border-b sm:border-b-0 sm:border-r ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-transparent text-white/90 border-white/10'}`}>
                    <div className="w-full aspect-[4/5] relative">
                      {idx === 0 && (generationsLeft === null || generationsLeft <= 0 || teaserUrl || isGeneratingTeaser) && (
                        <div className="absolute top-3 right-3 z-30">
                          <span className="bg-amber-600 border border-amber-500/30 shadow-[0_0_15px_rgba(217,119,6,0.5)] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider py-1 px-2.5 rounded-full flex items-center gap-1.5 animate-pulse">
                            <Sparkles size={12} className="text-amber-200" /> ИИ-Примерка
                          </span>
                        </div>
                      )}
                      {idx === 0 && (generationsLeft === null || generationsLeft <= 0 || teaserUrl) ? (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#0A0510]">
                          {teaserUrl ? (
                            <CachedImage 
                              src={teaserUrl} 
                              className={`absolute inset-0 object-cover transition-all duration-1000 ${generationsLeft && generationsLeft > 0 ? "blur-none scale-100 opacity-100" : "blur-xl scale-[1.15] opacity-60 pointer-events-none"}`} 
                              style={{ width: '100%', height: '100%' }}
                              alt="Превью" 
                            />
                          ) : isGeneratingTeaser ? (
                            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0a0812] to-[#1a1224] relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                              <RefreshCw size={28} className="text-amber-500 animate-spin mb-4 relative z-10" />
                              <span className="text-[11px] font-medium text-amber-500 uppercase tracking-widest text-center mt-2 leading-relaxed relative z-10">Идет примерка<br/>этого стиля на Ваше фото...</span>
                            </div>
                          ) : (
                            <div className="absolute inset-0 w-full h-full bg-[#0a0812]"></div>
                          )}
                          
                          {(!generationsLeft || generationsLeft <= 0) && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-5 text-center">
                              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/30 to-amber-600/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                                <Lock size={22} className="text-amber-400" />
                              </div>
                              <h5 className="text-white font-serif font-medium text-lg leading-snug drop-shadow-md text-balance px-2 mb-2">
                                Примерка формы {rec.ru || rec.name}
                              </h5>
                              <p className="text-white/70 text-sm mb-5 leading-relaxed">
                                Разблокируйте этот и ещё 2 стиля, чтобы увидеть, как они смотрятся на вас.
                              </p>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowBuyModal(true); }}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3 px-5 sm:px-6 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all w-[95%] border border-amber-400/50"
                              >
                                Убрать блюр (199 ⭐)
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <LazyImage
                            keyword={rec.imageKeyword}
                            gender={results?.gender || ""}
                            uniqueName={rec.name}
                            description={rec.description}
                            results={results}
                            className={`absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ${isLightMode ? 'opacity-100' : 'opacity-90'}`}
                          />
                          <div className={`absolute inset-x-0 bottom-0 h-24 sm:hidden pointer-events-none z-10 ${isLightMode ? 'bg-gradient-to-t from-black/50 to-transparent' : 'bg-gradient-to-t from-black/80 to-transparent'}`}></div>
                          <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium z-20 shadow-sm border backdrop-blur-md ${isLightMode ? 'bg-white/80 text-gray-800 border-gray-200' : 'bg-white/5 text-white/90 border-white/10'}`}>
                            {idx + 1}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-center ${isLightMode ? 'bg-white' : ''}`}>
                    <div>
                      <h4 className={`text-2xl font-serif font-medium tracking-tight mb-2 transition-colors ${isLightMode ? 'text-gray-900 group-hover:text-amber-600' : 'text-white/90 group-hover:text-white/90/80'}`}>
                        {rec.name}
                      </h4>
                      <p className={`leading-relaxed font-light text-sm sm:text-base ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
                        {rec.description}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border mt-auto transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200 group-hover:bg-slate-100' : 'bg-transparent text-white/90 border-white/10 group-hover:bg-white/5'}`}>
                      <h5 className={`text-[10px] uppercase tracking-widest mb-2 font-medium flex items-center gap-2 ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
                        <Sparkles size={12} className={isLightMode ? "text-amber-500" : ""} /> Совет стилиста
                      </h5>
                      <p className={`text-sm font-light leading-relaxed ${isLightMode ? 'text-gray-700' : 'text-white/90/80'}`}>
                        {rec.stylingTips}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col xl:flex-row gap-3">
                      <button
                        onClick={() => setTryOnStyle(rec)}
                        className={`px-6 py-3.5 sm:py-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-95 w-full flex-1 border ${isLightMode ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-sm' : 'bg-blue-600/80 text-white hover:bg-blue-600 border-blue-500/50'}`}
                      >
                        <Sparkles size={16} className="shrink-0" /> Примерить этот стиль
                      </button>
                      <button
                        onClick={() => setTryOnStyle(rec)}
                        className={`px-6 py-3.5 sm:py-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-95 w-full flex-1 border ${isLightMode ? 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm' : 'text-white/90 bg-white/5 hover:bg-white/10 border-white/10'}`}
                      >
                        <Maximize2 size={16} className="shrink-0" /> Показать парикмахеру (гайд)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                   if (results && results.recommendations.length > 0) {
                     const randomRec = results.recommendations[Math.floor(Math.random() * results.recommendations.length)];
                     setTryOnStyle(randomRec);
                   }
                }}
                className={`flex items-center gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base border w-full sm:w-auto justify-center ${isLightMode ? 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-sm' : 'text-indigo-100 bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/30 shadow-[0_8px_32px_rgba(99,102,241,0.15)]'}`}
              >
                <Wand2 size={16} />
                Случайный стиль
              </button>
              <button
                onClick={loadMoreRecommendations}
                disabled={isLoadingMore}
                className={`flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50 border ${isLightMode ? 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm' : 'text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]'}`}
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
        </div>
      )}
    </>
  );
};

export const AnalysisResults = React.memo(AnalysisResultsComponent);
