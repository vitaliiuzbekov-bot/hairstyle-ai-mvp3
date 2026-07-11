import React, { useState, useEffect } from "react";
import { X, Share, PlusSquare, ArrowDownToLine } from "lucide-react";

export const PWAPrompt: React.FC<{ isLightMode?: boolean }> = ({ isLightMode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isModalStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isSaveMode = (navigator as any).standalone;
    if (isModalStandalone || isSaveMode) {
      setIsStandalone(true);
      return;
    }

    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Standard Android/Chrome installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Give a little delay before showing to not distract instantly
      setTimeout(() => setShowPrompt(true), 15000); 
    };

    const handleManualShow = () => {
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('show-pwa-prompt', handleManualShow);

    // If iOS and not installed, maybe show after some time using logic
    if (isIosDevice && !isModalStandalone && !isSaveMode) {
      // Check if we previously dismissed it
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
         setTimeout(() => setShowPrompt(true), 20000); 
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('show-pwa-prompt', handleManualShow);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className={`fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-10 fade-in duration-500`}>
      <div className={`relative max-w-sm w-full p-4 rounded-2xl shadow-2xl border flex flex-col gap-3 ${isLightMode ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800 text-white'}`}>
        <button 
          onClick={handleDismiss}
          className={`absolute top-2 right-2 p-1.5 rounded-full ${isLightMode ? 'text-gray-400 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          <X size={16} />
        </button>
        
        <div className="flex items-start gap-4 pr-6">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex-shrink-0 flex items-center justify-center text-blue-500 mt-1">
             <ArrowDownToLine size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-1">Установить приложение</h4>
            <p className={`text-sm leading-tight ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Добавьте НейроСтилист на главный экран для быстрого доступа и оффлайн сохранения.
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className={`p-3 rounded-xl mt-1 text-sm flex flex-col gap-2 ${isLightMode ? 'bg-gray-50 text-gray-700' : 'bg-white/5 text-gray-300'}`}>
            <div className="flex items-center gap-2">
              <span>1. Нажмите иконку <b>Поделиться</b></span>
              <Share size={16} className="text-blue-500 ml-auto" />
            </div>
            <div className="flex items-center gap-2">
              <span>2. Выберите <b>На экран «Домой»</b></span>
              <PlusSquare size={16} className="text-blue-500 ml-auto" />
            </div>
          </div>
        ) : deferredPrompt ? (
          <button
            onClick={handleInstallClick}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Установить сейчас
          </button>
        ) : (
          <div className={`p-3 rounded-xl mt-1 text-sm ${isLightMode ? 'bg-gray-50 text-gray-700' : 'bg-white/5 text-gray-300'}`}>
            <p>Для установки откройте приложение в системном браузере (через меню <b>⋯</b>) и выберите <b>"Добавить на главный экран"</b>.</p>
          </div>
        )}
      </div>
    </div>
  );
};
