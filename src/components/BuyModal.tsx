import React, { useEffect } from "react";
import { X, Star, Gift, Share2 } from "lucide-react";
import { useScrollLock } from "../hooks/useScrollLock";
import { ImageSlider } from "./ImageSlider";
import { useModalBackButton } from "../hooks/useTelegramBackButton";

interface BuyModalProps {
  showBuyModal: boolean;
  setShowBuyModal: (show: boolean) => void;
  isBuying: boolean;
  userRole: string;
  userId: string | null;
  processPayment: (planId: "basic" | "popular" | "premium" | "master", stars: number, tokens: number) => Promise<void>;
  isLightMode?: boolean;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  showBuyModal,
  setShowBuyModal,
  isBuying,
  userRole,
  userId,
  processPayment,
  isLightMode,
}) => {
  useScrollLock(showBuyModal);
  useModalBackButton(showBuyModal, () => setShowBuyModal(false));

  if (!showBuyModal) return null;

  return (
    <div className={`fixed-viewport z-[200] flex items-center justify-center p-4 ${isLightMode ? 'bg-gray-900/40 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}>
      <div className={`w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 fade-in duration-300 overflow-hidden ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#0f0c1b] border border-white/10'} max-h-[95vh] overflow-y-auto custom-scrollbar`}>
        
        {/* Glow effect */}
        <div className="absolute top-[-20%] right-[-20%] w-[120%] h-[120%] bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none"></div>

        <button
          onClick={() => setShowBuyModal(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${isLightMode ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/50'}`}
        >
          <X size={20} className="stroke-current" />
        </button>
        <h2 className={`text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent mb-4 mt-2 flex items-center gap-2 z-10`}>
           <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isLightMode ? 'bg-amber-100' : 'bg-amber-500/20'}`}>
             <Star size={18} className="text-amber-500 fill-current" />
           </div>
          Buy Generations
        </h2>

        {/* Onboarding Teaser inside BuyModal */}
        <div className={`w-full text-center relative z-10 mb-5`}>
          <ImageSlider isLightMode={isLightMode} />
          <p className={`text-[12px] mt-4 font-medium px-2 leading-relaxed ${isLightMode ? 'text-gray-700' : 'text-white/80'}`}>
            С невероятной точностью. Получите <b>детальный PDF-гайд</b> со схемами, параметрами окрашивания и подробным мудбордом для вашего мастера.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full z-10">
          {[
            { id: "basic", label: "1 генерация стрижек", count: 1, stars: 99 },
            { id: "popular", label: "3 генерации стрижек", count: 3, stars: 199, isPopular: true },
            { id: "premium", label: "3 генерации + PDF", count: 3, stars: 349 },
            ...(userRole === 'master' || userRole === 'salon' ? [{ id: "master", label: "Пакет мастера (10 генераций для клиентов)", count: 10, stars: 500 }] : [])
          ].map(pkg => (
            <button
              key={pkg.id}
              onClick={() => processPayment(pkg.id as any, pkg.stars, pkg.count)}
              disabled={isBuying}
              className={`relative flex items-center justify-between w-full p-4 rounded-[1.25rem] border active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden group ${
                pkg.isPopular 
                  ? (isLightMode ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-300 shadow-[0_4px_15px_rgba(245,158,11,0.1)] hover:shadow-[0_8px_20px_rgba(245,158,11,0.2)]' : 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-amber-500/40 shadow-[0_4px_15px_rgba(245,158,11,0.1)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.2)] hover:border-amber-400')
                  : (isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-white/5 border-white/10 hover:bg-white/10 text-left')
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-bold text-white px-2.5 py-1 rounded-bl-xl tracking-wider uppercase">
                  ВЫБОР ПОЛЬЗОВАТЕЛЕЙ
                </div>
              )}
              <div className="flex flex-col items-start gap-1 z-10 w-2/3">
                 <span className={`font-bold text-[15px] leading-tight ${isLightMode ? 'text-gray-900 group-hover:text-amber-700' : 'text-white/90 group-hover:text-amber-300'}`}>{pkg.label}</span>
                 <span className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>{pkg.count} генераци{pkg.count === 1 ? 'я' : pkg.count < 5 ? 'и' : 'й'}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border z-10 shrink-0 transition-colors ${isLightMode ? 'bg-white border-amber-200 group-hover:bg-amber-100' : 'bg-black/20 border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/30'}`}>
                <span className={`font-bold text-sm ${isLightMode ? 'text-amber-600' : 'text-amber-400'}`}>{pkg.stars}</span>
                <Star size={14} className={`fill-current ${isLightMode ? 'text-amber-500' : 'text-amber-400'}`} />
              </div>
            </button>
          ))}
        </div>
        
        {/* Referral Banner */}
        <div className={`mt-6 pt-5 w-full text-center relative z-10`}>
          <div className={`p-4 rounded-2xl border ${isLightMode ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-purple-100' : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-purple-500/20'}`}>
            <h3 className={`font-semibold mb-1 flex items-center justify-center gap-2 text-sm ${isLightMode ? 'text-purple-800' : 'text-purple-300'}`}>
              <Gift size={16} className={isLightMode ? 'text-purple-500' : "text-purple-400"} />
              Бесплатные генерации
            </h3>
            <p className={`text-[11px] mb-3 leading-relaxed ${isLightMode ? 'text-purple-600/80' : 'text-purple-300/70'}`}>
              Пригласи друга и получите +1 бесплатную генерацию каждый!
            </p>
            <button 
              onClick={() => {
                 const inviteLink = `https://t.me/neirostilist_bot/app?startapp=ref_${userId}`;
                 // @ts-ignore
                 if (window.Telegram?.WebApp?.openTelegramLink) {
                    // @ts-ignore
                    window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent("Смотри, какой крутой ИИ-стилист! Заходи по моей ссылке и получи бонусные генерации 🎁")}`);
                 } else {
                    navigator.clipboard.writeText(inviteLink);
                    alert("Ссылка скопирована!");
                 }
              }}
              className={`w-full text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isLightMode ? 'bg-white text-purple-700 shadow-sm hover:shadow-md' : 'bg-purple-500/30 text-white hover:bg-purple-500/40'}`}
            >
              <Share2 size={16} /> Пригласить
            </button>
          </div>
        </div>
        
        <p className={`text-[10px] mt-5 px-4 text-center leading-relaxed relative z-10 ${isLightMode ? 'text-gray-400' : 'text-white/40'}`}>
          Оплата производится во внутренней валюте Telegram (Stars). Звёзды списываются с вашего баланса Telegram.
        </p>
      </div>
    </div>
  );
};

