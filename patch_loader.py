import sys

with open("src/components/RotatingFactsLoader.tsx", "r") as f:
    content = f.read()

target = """        {progress > 15 && (
          <div className={`mt-4 p-3 border rounded-xl text-xs sm:text-sm animate-fade-in-up flex items-start gap-2 text-left ${
            isLightMode 
              ? 'bg-purple-50 border-purple-200 text-purple-900' 
              : 'bg-purple-500/10 border-purple-500/20 text-purple-200'
          }`}>
            <Info size={16} className={`mt-0.5 shrink-0 ${isLightMode ? 'text-purple-600' : 'text-purple-400'}`} />
            <span>
              <b>Генерация может занять 15–25 секунд.</b> Вы можете свернуть или закрыть приложение, бот автоматически пришлет вам готовый результат прямо в чат!
            </span>
          </div>
        )}"""

replacement = """        {progress > 15 && (
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
        )}"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/components/RotatingFactsLoader.tsx", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
