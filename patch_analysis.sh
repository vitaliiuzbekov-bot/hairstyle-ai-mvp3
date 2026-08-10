#!/bin/bash
sed -i 's/<RotatingFactsLoader isLightMode={isLightMode} title="Изучаем ваши черты..." \/>/{\!isProMode ? <RotatingFactsLoader isLightMode={isLightMode} title="Изучаем ваши черты..." \/> : <div className="text-xl font-medium animate-pulse">Загрузка...<\/div>}/g' src/components/AnalysisResults.tsx

sed -i 's/<button\n            onClick={() => window.dispatchEvent(new Event('"'"'open-library'"'"'))}/{\!isProMode \&\& <button\n            onClick={() => window.dispatchEvent(new Event('"'"'open-library'"'"'))}/g' src/components/AnalysisResults.tsx

sed -i 's/Полистать каталог пока ИИ думает\n          <\/button>/Полистать каталог пока ИИ думает\n          <\/button>}/g' src/components/AnalysisResults.tsx

