import sys

with open("src/components/ProfileModal.tsx", "r") as f:
    content = f.read()

import re

# Add openUrlInTelegram import if missing
if "openUrlInTelegram" not in content:
    content = content.replace(
        'import { shareToTelegram } from "../utils/telegram";',
        'import { shareToTelegram, openUrlInTelegram } from "../utils/telegram";'
    )

new_buttons = """
          <button 
            onClick={() => {
              window.dispatchEvent(new Event('open-tutorial'));
              onClose();
            }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors ${
              isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'
            }`}
          >
            <Clock size={14} className="text-amber-500" />
            Как это работает
          </button>
          
          {userRole === 'master' && (
             <button 
               onClick={() => {
                 window.dispatchEvent(new Event('open-library'));
                 onClose();
               }}
               className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors ${
                 isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'
               }`}
             >
               <BookOpen size={14} className="text-purple-500" />
               Каталог стрижек (PRO)
             </button>
          )}

          <button 
            onClick={() => {
              openUrlInTelegram("https://t.me/neirostilist_bot");
              onClose();
            }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors ${
              isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'
            }`}
          >
            <Share2 size={14} className="text-blue-400" />
            Перейти в бота
          </button>
"""

# Replace Clock in import with BookOpen, Info
if "BookOpen" not in content:
    content = content.replace("Clock } from", "Clock, BookOpen, Info } from")

content = content.replace(
    "Оставить отзыв / Контакты\n          </button>",
    "Оставить отзыв / Контакты\n          </button>\n" + new_buttons
)

with open("src/components/ProfileModal.tsx", "w") as f:
    f.write(content)
