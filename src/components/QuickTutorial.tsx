import React from 'react';
import { Camera, Wand2, MessageSquare, Video, X } from 'lucide-react';

interface QuickTutorialProps {
  isLightMode: boolean;
  onComplete: () => void;
}

export const QuickTutorial: React.FC<QuickTutorialProps> = ({ isLightMode, onComplete }) => {
  const steps = [
    {
      title: 'Сделайте качественное фото',
      description: 'Используйте фото хорошего качества, где ваше лицо освещено равномерно дневным светом. Уберите волосы с лица и снимите очки.',
      icon: Camera,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Нейро-подбор',
      description: 'Наш интеллект проанализирует форму вашего лица, тип волос и цветотип, чтобы предложить идеальные стрижки.',
      icon: Wand2,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Реалистичная примерка',
      description: 'Наслаждайтесь десятками вариантов причесок с помощью технологий виртуальной примерки.',
      icon: MessageSquare,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Поделитесь результатом',
      description: 'Создавайте залипательные видео с трансформацией или экспортируйте PDF-гайд для вашего парикмахера.',
      icon: Video,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className={`w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative flex flex-col overflow-hidden ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
        <button
          onClick={onComplete}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${isLightMode ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/50'}`}
        >
          <X size={20} />
        </button>

        <h2 className={`text-2xl font-bold mb-6 pr-8 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
          Как работает НейроСтилист?
        </h2>

        <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar max-h-[60vh] pr-2">
          {steps.map((step, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border flex gap-4 ${isLightMode ? 'bg-gray-50/50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
              <div className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center ${step.color}`}>
                <step.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className={`font-semibold mb-1 ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onComplete}
          className={`w-full mt-6 py-4 rounded-xl font-medium tracking-wide transition-all active:scale-[0.98] ${
            isLightMode 
              ? 'bg-gray-900 text-white hover:bg-gray-800' 
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
