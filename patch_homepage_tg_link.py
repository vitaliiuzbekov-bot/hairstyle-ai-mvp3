import sys
import re

with open("src/components/HomePage.tsx", "r") as f:
    content = f.read()

# add import
if 'openUrlInTelegram' not in content:
    content = content.replace(
        'import { PresetsCarousel } from "../components/PresetsCarousel";',
        'import { PresetsCarousel } from "../components/PresetsCarousel";\nimport { openUrlInTelegram } from "../utils/telegram";'
    )

# replace link
target_link = '<a href="https://t.me/neirostilist_bot" target="_blank" className="text-blue-500 underline hover:text-blue-400">Связь с разработчиком для внедрения</a>'
replacement_link = '<span onClick={() => openUrlInTelegram("https://t.me/neirostilist_bot")} className="text-blue-500 underline hover:text-blue-400 cursor-pointer">Связь с разработчиком для внедрения</span>'

content = content.replace(target_link, replacement_link)

with open("src/components/HomePage.tsx", "w") as f:
    f.write(content)
