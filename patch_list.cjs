const fs = require('fs');
const content = fs.readFileSync('src/components/HaircutList.tsx', 'utf8');

const target = `          <button
            onClick={loadMoreRecommendations}
            disabled={isLoadingMore}
            className={\`flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50 border \${isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm" : "text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"}\`}
          >
            <RefreshCw
              size={16}
              className={isLoadingMore ? "animate-spin" : ""}
            />
            {isLoadingMore
              ? "Поиск вариантов..."
              : "Найти другие крутые варианты"}
          </button>`;

const replacement = `          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <button
              onClick={() => loadMoreRecommendations('library')}
              disabled={isLoadingMore}
              className={\`flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50 border \${isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm" : "text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"}\`}
            >
              <BookOpen size={16} />
              Варианты из библиотеки (Бесплатно)
            </button>
            
            <button
              onClick={() => loadMoreRecommendations('ai')}
              disabled={isLoadingMore}
              className={\`flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50 border \${isLightMode ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-sm" : "bg-indigo-600/80 text-white hover:bg-indigo-500/80 border-indigo-500/50 shadow-[0_8px_32px_rgba(99,102,241,0.2)]"}\`}
            >
              <Sparkles size={16} className={isLoadingMore ? "animate-pulse" : ""} />
              {isLoadingMore
                ? "ИИ генерирует..."
                : "Сгенерировать новые (1 ⭐️)"}
            </button>
          </div>`;

fs.writeFileSync('src/components/HaircutList.tsx', content.replace(target, replacement));
