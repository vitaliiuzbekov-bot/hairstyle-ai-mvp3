import React from 'react';
import { Sparkles, Scissors, Info } from 'lucide-react';
import { useLoadingState } from '../hooks/useLoadingState';

const TIPS = [
  "💡 Асимметричная челка поможет визуально сузить лицо 💇‍♀️",
  "✨ Тонким волосам добавит объема стрижка каскад ✨",
  "🌟 Теплые оттенки блонда освежают цвет лица 🌟",
  "✂️ Обновляйте кончики каждые 6-8 недель ✂️",
  "🌿 Термозащита сохранит здоровье ваших волос 🌿",
  "💡 Косой пробор визуально смягчает квадратное лицо 💡",
  "💧 Увлажнение - ключ к блестящим и здоровым волосам 💧"
];

interface Props {
  isLightMode: boolean;
  title?: string;
  className?: string;
}

export const RotatingFactsLoader: React.FC<Props> = ({ isLightMode, title = "Изучаем ваши черты...", className = "" }) => {
  const { progress } = useLoadingState(20000, 200);

  let displayTitle = title;
  if (title === "Примерка стиля...") {
    if (progress < 20) displayTitle = "Анализ особенностей лица...";
    else if (progress < 45) displayTitle = "Генерация базового стиля...";
    else if (progress < 75) displayTitle = "Адаптация структуры и цвета...";
    else if (progress < 90) displayTitle = "Нейросетевой FaceSwap...";
    else displayTitle = "Финальные штрихи...";
  } else if (title === "Изучаем ваши черты...") {
     if (progress < 30) displayTitle = "Сканирование структуры лица...";
     else if (progress < 60) displayTitle = "Определение цветотипа и тона...";
     else if (progress < 85) displayTitle = "Анализ текущей прически...";
     else displayTitle = "Подбор индивидуальных рекомендаций...";
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-6 text-center ${className} w-full overflow-hidden`}>
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Sparkles size={32} className={`relative animate-pulse ${isLightMode ? 'text-purple-500' : 'text-purple-400'}`} />
      </div>
      
      <div className="w-full justify-center flex flex-col items-center max-w-sm space-y-3">
        <h3 className={`font-medium sm:text-lg ${isLightMode ? 'text-gray-900' : 'text-white/90'} transition-all duration-300`}>
          {displayTitle}
        </h3>
        
        {/* Progress Bar */}
        <div className="w-full relative max-w-xs">
          <div className={`h-2 w-full rounded-full overflow-hidden ${isLightMode ? 'bg-gray-200' : 'bg-gray-800'}`}>
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>
          <div className={`text-xs mt-2 font-medium ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {Math.round(progress)}%
          </div>
        </div>
        {progress > 15 && (
          <div className={`mt-4 p-3 border rounded-xl text-xs sm:text-sm animate-fade-in-up flex flex-col gap-3 text-left ${
            isLightMode 
              ? 'bg-purple-50 border-purple-200 text-purple-900' 
              : 'bg-purple-500/10 border-purple-500/20 text-purple-200'
          }`}>
            <div className="flex items-start gap-2">
              <Info size={16} className={`mt-0.5 shrink-0 ${isLightMode ? 'text-purple-600' : 'text-purple-400'}`} />
              <span>
                <b>Генерация может занять 15–25 секунд.</b> Вы можете свернуть приложение, бот пришлет результат в чат!
              </span>
            </div>

            {/* Promotional Banner (Monetization / Up-sell) */}
            <div className={`w-full p-3 rounded-lg flex flex-col gap-2 items-center text-center ${
              isLightMode ? 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-amber-900' : 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 text-amber-200'
            }`}>
              <div className="font-bold flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500" />
                Premium Аккаунт
              </div>
              <p className="text-xs opacity-90">Пропускайте очередь и получайте генерации в 3 раза быстрее!</p>
              <button 
                onClick={() => window.dispatchEvent(new Event('open-buy-modal'))}
                className={`mt-1 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                  isLightMode ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-amber-500/80 text-white hover:bg-amber-500'
                }`}
              >
                Подробнее
              </button>
            </div>

            <button 
              onClick={() => window.dispatchEvent(new Event('open-library'))}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
                isLightMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              <Info size={16} className="hidden" /> {/* to balance layout if needed, or remove */}
              <span>Пока ждете, посмотрите наш Каталог!</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-md relative overflow-hidden rounded-xl py-3 border transition-all duration-500 mt-2">
        <div className={`absolute inset-0 opacity-10 ${isLightMode ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
        <div className={`absolute inset-0 border rounded-xl ${isLightMode ? 'border-purple-200' : 'border-purple-500/20'}`}></div>
        
        {/* Gradients to hide the edges smoothly */}
        <div className={`absolute top-0 left-0 h-full w-12 z-10 bg-gradient-to-r pointer-events-none from-[#f8fafc] to-transparent dark:from-[#050508] ${isLightMode ? 'from-white' : 'from-[#050508]'}`} style={{ backgroundImage: isLightMode ? 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)' : 'linear-gradient(to right, rgb(15, 12, 27), transparent)'}}></div>
        <div className={`absolute top-0 right-0 h-full w-12 z-10 bg-gradient-to-l pointer-events-none from-[#f8fafc] to-transparent dark:from-[#050508] ${isLightMode ? 'from-white' : 'from-[#050508]'}`} style={{ backgroundImage: isLightMode ? 'linear-gradient(to left, rgba(255,255,255,0.9), transparent)' : 'linear-gradient(to left, rgb(15, 12, 27), transparent)'}}></div>

        <div className={`flex w-[fit-content] animate-marquee whitespace-nowrap items-center ${isLightMode ? 'text-purple-800' : 'text-purple-200'}`}>
          {/* We duplicate the array to ensure smooth circular scrolling */}
          {[...TIPS, ...TIPS].map((tip, idx) => (
             <React.Fragment key={idx}>
               <span className="mx-6 text-sm font-medium tracking-wide">
                 {tip}
               </span>
               <span className="mx-2 opacity-50">•</span>
             </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

