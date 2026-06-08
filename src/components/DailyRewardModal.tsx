import React, { useState, useEffect } from "react";
import { Gift, Zap, X } from "lucide-react";
import { useTokenManager } from "../hooks/useTokenManager";

interface DailyRewardModalProps {
  isLightMode?: boolean;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isLightMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // Determine if today is a new day
    const lastClaimed = localStorage.getItem("lastClaimedDate");
    const today = new Date().toDateString();

    if (lastClaimed !== today) {
      setTimeout(() => {
        setShowModal(true);
      }, 3000); // delay so it doesn't pop up immediately upon mounting before welcome modal
    }
  }, []);

  const handleClaim = async () => {
    setIsClaiming(true);
    
    // Quick frontend update
    const today = new Date().toDateString();
    localStorage.setItem("lastClaimedDate", today);
    
    // Assuming useTokenManager local update logic
    const currentGens = parseInt(localStorage.getItem("localGenerationsLeft") || "0", 10);
    localStorage.setItem("localGenerationsLeft", (currentGens + 1).toString());
    
    // We can also trigger a custom event that useTokenManager listens to, or just reload the page/let app handle state
    window.dispatchEvent(new CustomEvent("daily_reward_claimed"));

    setTimeout(() => {
      setShowModal(false);
      setIsClaiming(false);
    }, 1000);
  };

  if (!showModal) return null;

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 ${isLightMode ? 'bg-gray-900/40 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}>
      <div className={`relative w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl animate-in zoom-in-95 fade-in duration-500 overflow-hidden ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#0f0c1b] border border-white/10'}`}>
        
        {/* Background Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none transform rotate-12"></div>

        <button
          onClick={() => setShowModal(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${isLightMode ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' : 'text-white/40 hover:text-white/80 hover:bg-white/10'}`}
        >
          <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-6 group">
            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-40 animate-pulse"></div>
            <div className={`relative w-full h-full rounded-3xl flex items-center justify-center shadow-inner border transition-transform duration-500 ${isLightMode ? 'bg-gradient-to-br from-amber-100 to-orange-50 border-amber-200' : 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/30'}`}>
              <Gift size={44} className={isLightMode ? 'text-orange-500' : 'text-amber-400'} />
            </div>
            {/* Sparkles around */}
            <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 w-3 h-3 bg-amber-400 rounded-full blur-[1px] animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute bottom-2 left-[-10px] w-2 h-2 bg-orange-400 rounded-full blur-[1px] animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-3">
            <span className={`bg-gradient-to-r text-transparent bg-clip-text ${isLightMode ? 'from-orange-600 to-amber-500' : 'from-amber-400 to-orange-300'}`}>
              Ежедневный бонус!
            </span>
          </h2>
          
          <p className={`text-[15px] mb-8 leading-relaxed font-light px-2 ${isLightMode ? 'text-gray-600' : 'text-white/70'}`}>
            Ловите <strong className={isLightMode ? 'text-orange-600 font-medium' : 'text-amber-400 font-medium'}>+1 бесплатную примерку</strong> 📸<br/>
            Заходите завтра, чтобы получить ещё!
          </p>

          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className={`w-full group font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              isClaiming
                ? 'opacity-70 cursor-not-allowed bg-orange-400 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.5)]'
            }`}
          >
            {isClaiming ? (
              <span className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                 Получаем...
              </span>
            ) : (
              <>
                <Zap size={20} className="fill-current text-white/90 group-hover:text-white transition-colors" />
                Забрать бонус!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
