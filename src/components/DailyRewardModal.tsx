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
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 ${isLightMode ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}>
      <div className={`w-full max-w-sm rounded-[2rem] p-6 text-center transform transition-all shadow-2xl animate-in zoom-in duration-500 flex flex-col items-center ${isLightMode ? 'bg-white border border-gray-200' : 'bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-white/10'}`}>
        <button
          onClick={() => setShowModal(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/50'}`}
        >
          <X size={20} />
        </button>

        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
          <Gift size={40} className="text-white" />
        </div>

        <h2 className={`text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent mb-2`}>
          Ежедневный бонус!
        </h2>
        
        <p className={`text-sm mb-8 ${isLightMode ? 'text-gray-600' : 'text-white/70'}`}>
          Лови +1 бесплатную генерацию 📸<br/>Заходи завтра, чтобы получить ещё!
        </p>

        <button
          onClick={handleClaim}
          disabled={isClaiming}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
        >
          {isClaiming ? "Получаем..." : (
            <>
              <Zap size={20} fill="currentColor" />
              Забрать бонус!
            </>
          )}
        </button>
      </div>
    </div>
  );
};
