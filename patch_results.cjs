const fs = require('fs');
let content = fs.readFileSync('src/components/AnalysisResults.tsx', 'utf8');

const target = `      {isAnalyzing && !results && (
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center min-h-[400px] animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both">
          <RotatingFactsLoader isLightMode={isLightMode} title="Изучаем ваши черты..." />
        </div>
      )}`;

const replacement = `      {isAnalyzing && !results && (
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center min-h-[400px] animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both items-center gap-6">
          <RotatingFactsLoader isLightMode={isLightMode} title="Изучаем ваши черты..." />
          <button
            onClick={() => window.dispatchEvent(new Event('open-library'))}
            className={\`px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-all shadow-md active:scale-95 \${isLightMode ? 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30'}\`}
          >
            <BookOpen size={18} />
            Полистать каталог пока ИИ думает
          </button>
        </div>
      )}`;

if(content.includes('isAnalyzing && !results')) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/AnalysisResults.tsx', content);
    console.log("Patched AnalysisResults successfully");
} else {
    console.log("Could not find target in AnalysisResults");
}
