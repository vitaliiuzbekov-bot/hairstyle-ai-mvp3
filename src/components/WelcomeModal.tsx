import { useModalBackButton } from '../hooks/useTelegramBackButton';
import React, { useState } from "react";
import { Scissors, User, Store, Sparkles, Image, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import { useScrollLock } from "../hooks/useScrollLock";
import { motion, AnimatePresence } from "motion/react";

interface WelcomeModalProps {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  salonName: string;
  setSalonName: (name: string) => void;
  showSalonNameInput: boolean;
  setShowSalonNameInput: (show: boolean) => void;
  isLightMode?: boolean;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  showWelcome,
  setShowWelcome,
  salonName,
  setSalonName,
  showSalonNameInput,
  setShowSalonNameInput,
  isLightMode,
}) => {
  useScrollLock(showWelcome);
  
  const [step, setStep] = useState(0);

  useModalBackButton(showWelcome, () => setShowWelcome(false));

  if (!showWelcome) return null;

    const finishOnboarding = () => {
    setShowWelcome(false);
    localStorage.setItem("welcomeShown", "true");
    const tg = (window as any).Telegram?.WebApp as any;
    if (tg?.isVersionAtLeast?.('6.9') && tg?.CloudStorage) {
      tg.CloudStorage.setItem('welcomeShown', 'true', () => {});
    }
  };

  const slides = [
    {
      icon: <Image size={40} className={isLightMode ? 'text-blue-500' : 'text-blue-400'} />,
      title: "Шаг 1: Загрузите свое фото",
      text: "Сделайте селфи или загрузите фото, где вы смотрите прямо в камеру при хорошем освещении. Важно: лицо должно быть открыто.",
      bg: isLightMode ? "bg-gradient-to-br from-blue-50 to-indigo-50" : "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
      border: isLightMode ? "border-blue-100" : "border-blue-500/20"
    },
    {
      icon: <Zap size={40} className={isLightMode ? 'text-amber-500' : 'text-amber-400'} />,
      title: "Шаг 2: Получите анализ",
      text: "Нейросеть мгновенно определит форму вашего лица и структуру волос, чтобы подобрать стили, которые гарантированно вам подойдут.",
      bg: isLightMode ? "bg-gradient-to-br from-amber-50 to-orange-50" : "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      border: isLightMode ? "border-amber-100" : "border-amber-500/20"
    },
    {
      icon: <Scissors size={40} className={isLightMode ? 'text-purple-500' : 'text-purple-400'} />,
      title: "Шаг 3: Выберите и примерьте",
      text: "Выбирайте любые прически из рекомендаций или нашей библиотеки, нажимайте «Примерить» и скачивайте готовый результат!",
      bg: isLightMode ? "bg-gradient-to-br from-purple-50 to-fuchsia-50" : "bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10",
      border: isLightMode ? "border-purple-100" : "border-purple-500/20"
    }
  ];

  return (
    <div className={`fixed-viewport z-[120] flex items-center justify-center p-4 ${isLightMode ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#111] border border-white/10'}`}
      >
        <div className="relative overflow-hidden min-h-[360px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-sm border ${slides[step].bg} ${slides[step].border}`}>
                  {slides[step].icon}
                </div>
                <h2 className={`text-2xl font-bold tracking-tight mb-4 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                  {slides[step].title}
                </h2>
                <p className={`text-base leading-relaxed ${isLightMode ? 'text-gray-600' : 'text-white/70'}`}>
                  {slides[step].text}
                </p>
              </motion.div>
            
            </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className={`p-6 pt-4 border-t ${isLightMode ? 'border-gray-100 bg-gray-50/50' : 'border-white/5 bg-white/5'}`}>
          {step < slides.length ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === step 
                        ? (isLightMode ? 'w-6 bg-purple-500' : 'w-6 bg-purple-400')
                        : (isLightMode ? 'w-2 bg-gray-300' : 'w-2 bg-white/20')
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => { if (step === slides.length - 1) finishOnboarding(); else setStep(s => s + 1); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition-opacity"
              >
                Далее <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              {!showSalonNameInput && (
                <button
                  onClick={() => setStep(0)}
                  className={`text-sm font-medium transition-colors ${isLightMode ? 'text-gray-500 hover:text-gray-800' : 'text-white/50 hover:text-white/80'}`}
                >
                  Вернуться к презентации
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

