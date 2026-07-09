const fs = require('fs');
const content = fs.readFileSync('src/components/Header.tsx', 'utf8');
const newContent = content.replace(
  /<button onClick={onOpenTutorial}.*?>[\s\S]*?<\/button>\s*<button onClick={onOpenLibrary}.*?>[\s\S]*?<\/button>/,
  `<button onClick={onOpenTutorial} className={\`h-8 sm:h-9 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all font-medium text-[11px] sm:text-xs border \${isLightMode ? "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300" : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"}\`}>
              <Info size={14} />
              <span className="hidden sm:inline">Как это работает</span>
            </button>
            <button onClick={onOpenLibrary} className={\`h-8 sm:h-9 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all font-medium text-[11px] sm:text-xs border \${isLightMode ? "bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300" : "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"}\`}>
              <BookOpen size={14} />
              <span className="hidden sm:inline">Каталог</span>
            </button>`
);
fs.writeFileSync('src/components/Header.tsx', newContent);
