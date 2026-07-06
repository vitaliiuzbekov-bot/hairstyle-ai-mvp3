import React from "react";
import { Sparkles, Lock, RefreshCw, Maximize2 } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { CachedImage } from "./CachedImage";
import { AnalysisResult } from "../types";

interface RecommendationCardProps {
  rec: any;
  idx: number;
  results: AnalysisResult;
  generationsLeft: number | null;
  teaserUrl: string | null;
  isGeneratingTeaser: boolean;
  setShowBuyModal: (val: boolean) => void;
  setTryOnStyle: (val: any) => void;
  isLightMode: boolean;
}

export const RecommendationCard = React.memo(({
  rec,
  idx,
  results,
  generationsLeft,
  teaserUrl,
  isGeneratingTeaser,
  setShowBuyModal,
  setTryOnStyle,
  isLightMode,
}: RecommendationCardProps) => {
  return (
    <div
      className={`opacity-0 animate-fade-in-up rounded-2xl overflow-hidden transition-all duration-500 group flex flex-col sm:flex-row items-stretch border ${isLightMode ? 'bg-white shadow-md border-gray-200 hover:shadow-lg' : 'glass-panel hover:border-white/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-white/10'}`}
      style={{ animationDelay: `${300 + idx * 150}ms` }}
    >
      <div className={`w-full sm:w-[300px] shrink-0 relative overflow-hidden [mask-image:-webkit-radial-gradient(white,black)] border-b sm:border-b-0 sm:border-r ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-transparent text-white/90 border-white/10'}`}>
        <div className="w-full aspect-[3/4] relative">
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
                  src={teaserUrl || undefined as any} 
                  className={`absolute inset-0 object-cover object-center transition-all duration-1000 blur-none scale-100 ${isLightMode ? 'opacity-100' : 'opacity-90'}`} 
                  style={{ width: '100%', height: '100%' }}
                  alt="Референс" 
                />
              ) : isGeneratingTeaser ? (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0a0812] to-[#1a1224] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                  <RefreshCw size={28} className="text-amber-500 animate-spin mb-4 relative z-10" />
                  <span className="text-[11px] font-medium text-amber-500 uppercase tracking-widest text-center mt-2 leading-relaxed relative z-10">Поиск идеального<br/>референса...</span>
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-[#0a0812]"></div>
              )}
              
              <div className={`absolute inset-x-0 bottom-0 h-32 pointer-events-none z-10 ${isLightMode ? 'bg-gradient-to-t from-black/20 to-transparent' : 'bg-gradient-to-t from-black/80 to-transparent'}`}></div>
              
              {(!generationsLeft || generationsLeft <= 0) && (
                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end p-4 text-center pb-5 space-y-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowBuyModal(true); }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider py-3 px-4 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all w-[95%] border border-amber-400/50"
                  >
                     <Lock size={12} className="inline mr-1 pb-[2px]" /> Примерка на вас (Купить)
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const tg = (window as any).Telegram?.WebApp;
                      if (!tg) {
                        alert("Доступно только в Telegram");
                        return;
                      }
                      const botName = tg.initDataUnsafe?.chat?.username || "neurostylist_ai_bot";
                      const userId = tg.initDataUnsafe?.user?.id || "";
                      const url = `https://t.me/${botName}/app?startapp=ref_${userId}`;
                      const text = "Примерь новую стрижку с помощью ИИ!";
                      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
                    }}
                    className="bg-transparent text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wide py-2 px-4 rounded-full hover:bg-white/5 active:bg-white/10 transition-all w-[95%] border border-amber-500/30"
                  >
                     Или пригласи друга (+1 🎁)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {rec.customImageUrl ? (
                <img
                  src={rec.customImageUrl}
                  alt={rec.name}
                  className={`absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ${isLightMode ? 'opacity-100' : 'opacity-90'}`}
                />
              ) : (
                <LazyImage
                  keyword={rec.imageKeyword || rec.name}
                  gender={results?.gender || ""}
                  uniqueName={rec.name}
                  description={rec.description}
                  results={results}
                  autoLoad={true} isLightMode={isLightMode}
                  isPriority={idx < 4}
                  className={`absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ${isLightMode ? 'opacity-100' : 'opacity-90'}`}
                />
              )}
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
  );
});
