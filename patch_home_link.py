import sys

with open("src/components/HomePage.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '<a href="https://t.me/vitalii_uzbekov" onClick={(e) => { e.preventDefault(); openUrlInTelegram("https://t.me/vitalii_uzbekov"); }} className="text-blue-500 underline hover:text-blue-400 cursor-pointer">Связь с разработчиком для внедрения</a>',
    '<span onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))} className="text-blue-500 underline hover:text-blue-400 cursor-pointer">Связь с разработчиком для внедрения</span>'
)

with open("src/components/HomePage.tsx", "w") as f:
    f.write(content)
