import sys

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Add import if missing
if "openUrlInTelegram" not in content:
    content = content.replace(
        'import { LogOut, Sun, Moon, Info, Coins, Scissors, User, Settings, BookOpen, MessageSquare } from "lucide-react";',
        'import { LogOut, Sun, Moon, Info, Coins, Scissors, User, Settings, BookOpen, MessageSquare } from "lucide-react";\nimport { openUrlInTelegram } from "../utils/telegram";'
    )

content = content.replace(
    'onClick={() => { if (window.Telegram?.WebApp?.openTelegramLink) { window.Telegram.WebApp.openTelegramLink("https://t.me/neirostilist_bot"); } else { window.open("https://t.me/neirostilist_bot", "_blank"); } }}',
    'onClick={() => openUrlInTelegram("https://t.me/neirostilist_bot")}'
)

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
