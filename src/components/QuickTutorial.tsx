import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Wand2, MessageSquare, History, ChevronRight } from 'lucide-react';

interface QuickTutorialProps {
  isLightMode: boolean;
  onComplete: () => void;
}

const steps = [
  {
    id: 'step-1',
    title: 'Загрузите селфи',
    description: 'Используйте фото хорошего качества, где ваше лицо освещено равномерно.',
    icon: Camera,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 'step-2',
    title: 'ИИ Анализ',
    description: 'Наш интеллект проанализирует форму вашего лица, тип волос и цветотип.',
    icon: Wand2,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 'step-3',
    title: 'Примеряйте новые стили',
    description: 'Наслаждайтесь десятками вариантов причесок в AR или через нейросети.',
    icon: MessageSquare,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'step-4',
    title: 'Сохраняйте в каталог',
    description: 'Все ваши удачные генерации сохраняются в истории и присылаются в чат.',
    icon: History,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
  }
];

export const QuickTutorial: React.FC<QuickTutorialProps> = ({ isLightMode, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col ${isLightMode ? 'bg-slate-50' : 'bg-[#050508]'} animate-in fade-in duration-300`}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl sm:rounded-[2rem] border flex items-center justify-center mb-8 ${steps[currentStep].color}`}>
              {React.createElement(steps[currentStep].icon, { size: 48, strokeWidth: 1.5 })}
            </div>
            
            <h2 className={`text-2xl font-bold mb-4 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
              {steps[currentStep].title}
            </h2>
            <p className={`text-base leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 safe-bottom">
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? 'w-6 bg-blue-500' 
                  : `w-1.5 ${isLightMode ? 'bg-slate-300' : 'bg-slate-800'}`
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isLightMode 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {isLastStep ? 'Начать' : 'Далее'}
          {!isLastStep && <ChevronRight size={20} />}
        </button>
        
        {!isLastStep && (
          <button
            onClick={onComplete}
            className={`w-full py-4 mt-2 text-sm font-medium transition-colors ${
              isLightMode ? 'text-slate-500 hover:text-slate-900' : 'text-slate-500 hover:text-white'
            }`}
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
};
