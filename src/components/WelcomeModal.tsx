import React, { useState } from "react";
import { Scissors, User, Store, Sparkles, Image, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import { useScrollLock } from "../hooks/useScrollLock";
import { motion, AnimatePresence } from "motion/react";

interface WelcomeModalProps {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  setUserRole: (role: 'client' | 'master' | 'salon') => void;
  salonName: string;
  setSalonName: (name: string) => void;
  showSalonNameInput: boolean;
  setShowSalonNameInput: (show: boolean) => void;
  isLightMode?: boolean;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  showWelcome,
  setShowWelcome,
  setUserRole,
  salonName,
  setSalonName,
  showSalonNameInput,
  setShowSalonNameInput,
  isLightMode,
}) => {
  useScrollLock(showWelcome);
  
  const [step, setStep] = useState(0);

  if (!showWelcome) return null;

  const handleRoleSelect = (role: 'client' | 'master' | 'salon', name?: string) => {
    setUserRole(role);
    setShowWelcome(false);
    localStorage.setItem("userRole", role);
    localStorage.setItem("welcomeShown", "true");
    if (name) {
      localStorage.setItem("salonName", name);
    }
    
    const tg = (window as any).Telegram?.WebApp as any;
    if (tg?.isVersionAtLeast?.('6.9') && tg?.CloudStorage) {
      tg.CloudStorage.setItem('welcomeShown', 'true', () => {});
      tg.CloudStorage.setItem('userRole', role, () => {});
      if (name) tg.CloudStorage.setItem('salonName', name, () => {});
    }
  };

  const slides = [
    {
      icon: <Sparkles size={40} className={isLightMode ? 'text-purple-500' : 'text-purple-400'} />,
      title: "Добро пожаловать в НейроСтилист",
      text: "Ваша персональная лаборатория красоты на базе ИИ. Подберите свой идеальный образ до похода в салон.",
      bg: isLightMode ? "bg-gradient-to-br from-purple-50 to-indigo-50" : "bg-gradient-to-br from-purple-500/10 to-indigo-500/10",
      border: isLightMode ? "border-purple-100" : "border-purple-500/20"
    },
    {
      icon: <Image size={40} className={isLightMode ? 'text-blue-500' : 'text-blue-400'} />,
      title: "Сотни вариантов",
      text: "Смотрите, как на вас будут смотреться различные стрижки, челки и цвета волос. Поддерживается реалистичный перенос стиля.",
      bg: isLightMode ? "bg-gradient-to-br from-blue-50 to-cyan-50" : "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
      border: isLightMode ? "border-blue-100" : "border-blue-500/20"
    },
    {
      icon: <Zap size={40} className={isLightMode ? 'text-amber-500' : 'text-amber-400'} />,
      title: "Умный анализ",
      text: "Мы анализируем вашу форму лица и структуру волос, чтобы давать индивидуальные рекомендации, которые точно вам подойдут.",
      bg: isLightMode ? "bg-gradient-to-br from-amber-50 to-orange-50" : "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      border: isLightMode ? "border-amber-100" : "border-amber-500/20"
    }
  ];

  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 ${isLightMode ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#111] border border-white/10'}`}
      >
        <div className="relative overflow-hidden min-h-[360px] flex flex-col">
          <AnimatePresence mode="wait">
            {step < slides.length ? (
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
            ) : (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`p-6 flex-1 flex flex-col justify-center ${isLightMode ? 'bg-white' : ''}`}
              >
                {showSalonNameInput ? (
                  <div className="flex flex-col gap-4">
                    <h3 className={`text-lg font-medium text-center ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>Укажите название вашего салона</h3>
                    <input
                      type="text"
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      placeholder="Например: Салон 'Красота'"
                      className={`w-full p-4 rounded-xl border outline-none transition-colors text-center ${isLightMode ? 'bg-gray-50 text-gray-900 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400' : 'bg-[#1A1A1A] text-white border-white/10 focus:border-purple-500/50 placeholder:text-white/30'}`}
                    />
                    <button 
                      onClick={() => handleRoleSelect('salon', salonName)}
                      disabled={!salonName.trim()}
                      className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      Начать работу
                    </button>
                    <button onClick={() => setShowSalonNameInput(false)} className={`text-sm transition-colors ${isLightMode ? 'text-gray-500 hover:text-gray-800' : 'text-white/50 hover:text-white/80'}`}>
                      Назад
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/10">
                        <Scissors size={28} className={isLightMode ? 'text-gray-700' : 'text-white/80'} />
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                        Остался один шаг
                      </h3>
                      <p className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Укажите вашу роль для настройки интерфейса</p>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => handleRoleSelect('client')}
                        className={`w-full text-left p-4 rounded-2xl border active:scale-[0.98] transition-all group flex items-center gap-4 ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform ${isLightMode ? 'bg-blue-50 border-blue-200' : 'bg-blue-500/20 border-blue-500/30'}`}>
                          <User size={24} className={isLightMode ? 'text-blue-500' : 'text-blue-400'} />
                        </div>
                        <div>
                          <h3 className={`font-bold ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>Ищу свой стиль</h3>
                          <p className={`text-sm mt-0.5 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Хочу подобрать идеальную стрижку для себя</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => handleRoleSelect('master')}
                        className={`w-full text-left p-4 rounded-2xl border active:scale-[0.98] transition-all group flex items-center gap-4 ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform ${isLightMode ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/20 border-amber-500/30'}`}>
                          <Scissors size={24} className={isLightMode ? 'text-amber-500' : 'text-amber-400'} />
                        </div>
                        <div>
                          <h3 className={`font-bold ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>Я стилист / мастер</h3>
                          <p className={`text-sm mt-0.5 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Для работы с клиентами</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setShowSalonNameInput(true)}
                        className={`w-full text-left p-4 rounded-2xl border active:scale-[0.98] transition-all group flex items-center gap-4 ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform ${isLightMode ? 'bg-purple-50 border-purple-200' : 'bg-purple-500/20 border-purple-500/30'}`}>
                          <Store size={24} className={isLightMode ? 'text-purple-500' : 'text-purple-400'} />
                        </div>
                        <div>
                          <h3 className={`font-bold ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>Я владелец салона</h3>
                          <p className={`text-sm mt-0.5 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Внедрить нейросети в бизнес</p>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
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
                onClick={() => setStep(s => s + 1)}
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

