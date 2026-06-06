import React, { useState, useEffect } from 'react';
import { Sparkles, Info } from 'lucide-react';

const FACTS = [
  "Факт 1: Волосы растут быстрее всего летом благодаря теплу и солнечному свету.",
  "Факт 2: ИИ анализирует более 120 точек на лице для точного подбора стрижки.",
  "Факт 3: Правильный цвет волос может сделать кожу визуально свежее на несколько лет.",
  "Факт 4: Регулярная стрижка кончиков не ускоряет рост, но предотвращает сечение.",
  "Факт 5: Каждый фолликул может вырастить до 20-30 волос за время жизни человека.",
  "Факт 6: Форма лица может меняться с возрастом, поэтому стрижку стоит периодически обновлять."
];

interface Props {
  isLightMode: boolean;
  title?: string;
  className?: string;
}

export const RotatingFactsLoader: React.FC<Props> = ({ isLightMode, title = "ИИ анализирует образ...", className = "" }) => {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-4 text-center ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Sparkles size={32} className={`relative animate-pulse ${isLightMode ? 'text-blue-500' : 'text-blue-400'}`} />
      </div>
      <h3 className={`font-medium sm:text-lg ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
        {title}
      </h3>
      <div className={`mt-2 p-4 max-w-sm rounded-xl border flex items-start gap-3 text-left transition-all duration-500 ${isLightMode ? 'bg-blue-50/50 border-blue-100 text-blue-800' : 'bg-blue-500/10 border-blue-500/20 text-blue-200'}`}>
        <Info size={18} className="shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed animate-in fade-in zoom-in duration-500" key={factIndex}>
          {FACTS[factIndex]}
        </p>
      </div>
    </div>
  );
};
