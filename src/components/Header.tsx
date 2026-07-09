import React from "react";
import { Scissors, Coins, Zap, BookOpen, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  generationsLeft: number | null;
  isBuying: boolean;
  buyTokens: () => void;
  userId: string | null;
  userAvatar: string | null;
  isLightMode: boolean;
  isDeveloper?: boolean;
  setIsDeveloper?: (dev: boolean) => void;
  setIsProfileOpen: (val: boolean) => void;
  onOpenLibrary: () => void;
  onOpenTutorial: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  generationsLeft,
  isBuying,
  buyTokens,
  userId,
  userAvatar,
  isLightMode,
  isDeveloper = false,
  setIsDeveloper,
  setIsProfileOpen,
  onOpenLibrary,
  onOpenTutorial,
}) => {
  const [logoClicks, setLogoClicks] = React.useState(0);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 5) {
      if (setIsDeveloper) {
        const nextDev = !isDeveloper;
        setIsDeveloper(nextDev);
        localStorage.setItem("isDeveloperMode", nextDev ? "true" : "false");
        
        if (window.Telegram?.WebApp?.showPopup) {
          window.Telegram.WebApp.showPopup({
            title: nextDev ? "🔧 Режим Разработчика" : "🔒 Режим Разработчика",
            message: nextDev 
              ? "Тестовый режим разработчика успешно активирован! Генерации заблокированы на 999. Токены не списываются."
              : "Режим разработчика отключен.",
            buttons: [{ id: "ok", type: "ok" }]
          }, () => {});
        } else {
          alert(nextDev 
            ? "🔧 Тестовый режим разработчика активирован! Вся функциональность разблокирована. Баланс установлен на 999 и не списывается." 
            : "Режим разработчика деактивирован."
          );
        }
      }
      setLogoClicks(0);
    }
  };

  return (
    <header className={`border-b sticky top-0 z-50 backdrop-blur-xl ${isLightMode ? 'bg-white/80 border-gray-200' : 'glass-header border-white/10'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            onClick={handleLogoClick}
            className={`w-8 h-8 sm:w-12 sm:h-12 shrink-0 rounded-full cursor-pointer select-none active:scale-95 flex items-center justify-center border shadow-sm transition-all ${isDeveloper ? 'bg-gradient-to-tr from-red-500 to-amber-500 text-white border-transparent animate-pulse' : isLightMode ? 'bg-white text-gray-800 border-gray-200' : 'glass-button text-white/90 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]'}`}
          >
            <Scissors size={16} className="opacity-90 sm:w-5 sm:h-5 w-4 h-4" />
          </div>
          <h1 className={`font-serif font-semibold text-xl sm:text-2xl tracking-tight truncate hidden min-[370px]:block max-w-[100px] sm:max-w-none ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
            НейроСтилист{" "}
            <span className={`italic font-light opacity-60 hidden sm:inline ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>AI</span>
            {isDeveloper && <span className="ml-1 sm:ml-2 text-[9px] bg-red-500/90 text-white font-mono px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">DEV</span>}
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <div className={`flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-mono shrink-0 ${isLightMode ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-white/5 border-white/10 text-white/90'}`}>
            <Coins size={12} className="text-amber-500 shrink-0 sm:w-3.5 sm:h-3.5" />
            <span className="shrink-0">
              <span className="hidden sm:inline">Баланс: </span>{generationsLeft !== null ? generationsLeft : "..."}
            </span>
          </div>
          <button
            onClick={buyTokens}
            disabled={isBuying}
            className="flex items-center gap-0.5 sm:gap-1 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-black font-bold text-[9px] sm:text-[11px] uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] whitespace-nowrap shrink-0"
          >
            <Zap size={10} fill="currentColor" className="sm:inline hidden shrink-0" />
            {isBuying ? "..." : "Купить"}
          </button>
          
          <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
            <p className={`text-xs tracking-[0.2em] uppercase font-medium ${isLightMode ? 'text-gray-400' : 'text-white/60'}`}>
              ИИ-Подбор
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-2 shrink-0">
            <button onClick={onOpenTutorial} className={`w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full flex items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0 ${isLightMode ? "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300" : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"}`}>
              <Info size={14} className="shrink-0" />
              <span className="hidden sm:inline">Как это работает</span>
            </button>
            <button onClick={onOpenLibrary} className={`w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full flex items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0 ${isLightMode ? "bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300" : "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"}`}>
              <BookOpen size={14} className="shrink-0" />
              <span className="hidden sm:inline">Каталог</span>
            </button>
          </div>
          <div className="relative ml-0 sm:ml-2 shrink-0">
            <button
              onClick={() => setIsProfileOpen(true)}
              className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center transition-all ${userAvatar ? "p-0" : isLightMode ? "bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200" : "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              {userAvatar ? (
                <img
                  src={userAvatar || undefined}
                  alt="Avatar"
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border object-cover ${isLightMode ? 'border-gray-200' : 'border-white/20'}`}
                />
              ) : (
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-sm ${isLightMode ? 'bg-gray-200 text-gray-600' : 'bg-white/10'}`}>
                  U
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
