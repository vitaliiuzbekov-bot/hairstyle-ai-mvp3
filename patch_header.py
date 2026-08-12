import sys
import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Replace the buttons wrapper or add hidden class
content = content.replace(
    '<button onClick={() => { if (window.Telegram?.WebApp?.openTelegramLink) { window.Telegram.WebApp.openTelegramLink("https://t.me/neirostilist_bot"); } else { window.open("https://t.me/neirostilist_bot", "_blank"); } }} className={`w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full flex items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0',
    '<button onClick={() => { if (window.Telegram?.WebApp?.openTelegramLink) { window.Telegram.WebApp.openTelegramLink("https://t.me/neirostilist_bot"); } else { window.open("https://t.me/neirostilist_bot", "_blank"); } }} className={`hidden sm:flex w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0'
)

content = content.replace(
    '<button onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))} className={`w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full flex items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0',
    '<button onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))} className={`hidden sm:flex w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0'
)

content = content.replace(
    '<button onClick={onOpenTutorial} className={`w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full flex items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0',
    '<button onClick={onOpenTutorial} className={`hidden sm:flex w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0'
)

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
