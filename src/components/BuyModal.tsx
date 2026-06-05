import React from "react";
import { X, Star, Gift, Share2 } from "lucide-react";

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
  if (!showBuyModal) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isLightMode ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}>
      <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl relative flex flex-col items-center ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#111] border border-white/10'}`}>
        <button
          onClick={() => setShowBuyModal(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/60'}`}
        >
          <X size={20} className="stroke-current" />
        </button>
        <h2 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent mb-6 mt-2 flex items-center gap-2">
           <Star size={24} className="text-amber-400 fill-current" />
          Пополнить баланс
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {[
            { id: "basic", label: "1 стрижка + базовый цвет", count: 1, stars: 99 },
            { id: "popular", label: "3 стрижки + 3 цвета", count: 3, stars: 199, isPopular: true },
            { id: "premium", label: "3 стрижки + все цвета + PDF", count: 3, stars: 349 },
            ...(userRole === 'master' || userRole === 'salon' ? [{ id: "master", label: "Пакет мастера (10 генераций для клиентов)", count: 10, stars: 500 }] : [])
          ].map(pkg => (
            <button
              key={pkg.id}
              onClick={() => processPayment(pkg.id as any, pkg.stars, pkg.count)}
              disabled={isBuying}
              className={`relative flex items-center justify-between w-full p-4 rounded-2xl border active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden ${
                pkg.isPopular 
                  ? (isLightMode ? 'bg-orange-50/50 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:bg-orange-50' : 'bg-white/5 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-white/10')
                  : (isLightMode ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' : 'bg-white/5 border-white/10 hover:bg-white/10')
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-400 text-[10px] font-bold text-white px-2 py-0.5 rounded-bl-lg tracking-wider">
                  ВЫБОР ПОЛЬЗОВАТЕЛЕЙ
                </div>
              )}
              <div className="flex flex-col items-start gap-1 z-10 w-2/3">
                 <span className={`font-bold text-sm sm:text-base text-left leading-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>{pkg.label}</span>
                 <span className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>{pkg.count} генераци{pkg.count === 1 ? 'я' : pkg.count < 5 ? 'и' : 'й'}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border z-10 shrink-0 ${isLightMode ? 'bg-amber-100 border-amber-200' : 'bg-amber-500/20 border-amber-500/30'}`}>
                <span className={`font-bold ${isLightMode ? 'text-amber-600' : 'text-amber-500'}`}>{pkg.stars}</span>
                <Star size={16} className={`fill-current ${isLightMode ? 'text-amber-500' : 'text-amber-500'}`} />
              </div>
            </button>
          ))}
        </div>
        
        {/* Referral Banner */}
        <div className={`mt-8 pt-6 border-t w-full text-center ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
          <h3 className={`font-medium mb-2 flex items-center justify-center gap-2 ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>
            <Gift size={16} className="text-pink-500" />
            Бесплатные генерации
          </h3>
          <p className={`text-xs mb-4 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>
            Пригласи друга и получите +1 генерацию каждый!
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
            className={`w-full text-sm py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 border ${isLightMode ? 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/90'}`}
          >
            <Share2 size={16} /> Пригласить друга
          </button>
        </div>
        
        <p className={`text-[10px] mt-6 text-center ${isLightMode ? 'text-gray-400' : 'text-white/40'}`}>
          Оплата производится во внутренней валюте Telegram (Stars). Звёзды списываются с вашего баланса Telegram.
        </p>
      </div>
    </div>
  );
};
