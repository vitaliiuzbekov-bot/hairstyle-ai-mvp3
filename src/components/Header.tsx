import React from "react";
import { Scissors, Coins, Zap, HelpCircle, Sun, Moon } from "lucide-react";

interface HeaderProps {
  generationsLeft: number | null;
  isBuying: boolean;
  buyTokens: () => void;
  userId: string | null;
  userAvatar: string | null;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  setIsFaqOpen: (open: boolean) => void;
  isLightMode: boolean;
  setIsLightMode: (light: boolean) => void;
  isDeveloper?: boolean;
  setIsDeveloper?: (dev: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  generationsLeft,
  isBuying,
  buyTokens,
  userId,
  userAvatar,
  isProfileOpen,
  setIsProfileOpen,
  setIsFaqOpen,
  isLightMode,
  setIsLightMode,
  isDeveloper = false,
  setIsDeveloper,
}) => {
  const [logoClicks, setLogoClicks] = React.useState(0);
  
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
            className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full cursor-pointer select-none active:scale-95 flex items-center justify-center border shadow-sm transition-all ${isDeveloper ? 'bg-gradient-to-tr from-red-500 to-amber-500 text-white border-transparent animate-pulse' : isLightMode ? 'bg-white text-gray-800 border-gray-200' : 'glass-button text-white/90 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]'}`}
          >
            <Scissors size={16} className="opacity-90 sm:w-5 sm:h-5 w-4 h-4" />
          </div>
          <h1 className={`font-serif font-semibold text-lg sm:text-2xl tracking-tight truncate max-w-[140px] sm:max-w-none ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
            НейроСтилист{" "}
            <span className={`italic opacity-80 hidden sm:inline ${isLightMode ? 'text-gray-400' : 'text-white/60'}`}>AI</span>
            {isDeveloper && <span className="ml-1.5 text-[9px] bg-red-500 text-white font-mono px-1 rounded uppercase tracking-widest">DEV</span>}
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-mono ${isLightMode ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-white/5 border-white/10 text-white/90'}`}>
            <Coins size={14} className="text-amber-500" />
            <span>
              <span className="hidden sm:inline">Баланс: </span>{generationsLeft !== null ? generationsLeft : "..."}
            </span>
          </div>
          <button
            onClick={buyTokens}
            disabled={isBuying}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-black font-bold text-[9px] sm:text-[11px] uppercase tracking-wider px-2 sm:px-3 py-1.5 rounded-full transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] whitespace-nowrap"
          >
            <Zap size={10} fill="currentColor" className="sm:inline hidden" />
            {isBuying ? "Загрузка..." : "Купить"}
          </button>
          <div className="hidden md:flex flex-col items-end gap-1">
            <p className={`text-xs tracking-[0.2em] uppercase font-medium ${isLightMode ? 'text-gray-400' : 'text-white/60'}`}>
              ИИ-Подбор
            </p>
          </div>

          <div className="relative ml-2">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${userAvatar ? "p-0" : isLightMode ? "bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200" : "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className={`w-9 h-9 rounded-full border object-cover ${isLightMode ? 'border-gray-200' : 'border-white/20'}`}
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLightMode ? 'bg-gray-200 text-gray-600' : 'bg-white/10'}`}>
                  U
                </div>
              )}
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${isLightMode ? 'bg-white border-gray-200' : 'glass-panel border-white/10'}`}>
                  <div className={`p-3 border-b ${isLightMode ? 'border-gray-100 bg-gray-50' : 'border-white/5'}`}>
                    <p className={`text-xs uppercase tracking-widest font-medium mb-1 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>
                      Настройки профиля
                    </p>
                    <p className={`text-sm truncate ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>
                      ID: {userId}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsFaqOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${isLightMode ? 'hover:bg-gray-100 text-gray-700 hover:text-gray-900' : 'hover:bg-white/5 text-white/80 hover:text-white'}`}
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle size={16} />
                        Вопросы и ответы (FAQ)
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setIsLightMode(!isLightMode);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${isLightMode ? 'hover:bg-gray-100 text-gray-700 hover:text-gray-900' : 'hover:bg-white/5 text-white/80 hover:text-white'}`}
                    >
                      <span className="flex items-center gap-2">
                        {isLightMode ? <Sun size={16} /> : <Moon size={16} />}
                        Светлая тема
                      </span>
                      <div
                        className={`w-8 h-4 rounded-full relative transition-colors ${isLightMode ? "bg-amber-400" : "bg-white/10"}`}
                      >
                        <div
                          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isLightMode ? "left-4.5" : "left-0.5"}`}
                        ></div>
                      </div>
                    </button>

                    {isDeveloper && (
                      <div className={`mt-2 p-2 rounded-xl text-xs flex flex-col gap-1.5 border leading-tight ${isLightMode ? 'bg-red-50/80 border-red-200 text-red-900' : 'bg-red-500/10 border-red-500/20 text-red-200 font-mono'}`}>
                        <div className="font-bold flex items-center justify-between mb-0.5 border-b pb-1 border-current/10">
                          <span>🛠️ Developer Panel</span>
                          <span className="px-1 py-0.2 text-[8px] bg-red-500 text-white rounded">ON</span>
                        </div>
                        <button
                          onClick={() => {
                            localStorage.removeItem("localHistory");
                            localStorage.removeItem("localGenerationsLeft");
                            window.location.reload();
                          }}
                          className={`w-full text-left py-1 px-1.5 rounded transition-colors text-[11px] ${isLightMode ? 'hover:bg-gray-200' : 'hover:bg-white/5'}`}
                        >
                          🧹 Сбросить баланс и историю
                        </button>
                        <button
                          onClick={() => {
                            const keys = Object.keys(localStorage);
                            keys.forEach(k => {
                              if (k.startsWith("cached_") || k.includes("base64")) {
                                localStorage.removeItem(k);
                              }
                            });
                            alert("Кэш изображений очищен.");
                          }}
                          className={`w-full text-left py-1 px-1.5 rounded transition-colors text-[11px] ${isLightMode ? 'hover:bg-gray-200' : 'hover:bg-white/5'}`}
                        >
                          🖼️ Очистить кэш картинок
                        </button>
                        <button
                          onClick={() => {
                            if (setIsDeveloper) {
                              setIsDeveloper(false);
                              localStorage.setItem("isDeveloperMode", "false");
                              window.location.reload();
                            }
                          }}
                          className="w-full text-left py-1 px-1.5 rounded text-red-500 font-bold text-[11px]"
                        >
                          🚫 Выйти из Dev-режима
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
