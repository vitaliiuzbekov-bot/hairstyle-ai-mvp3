import sys
import re

with open("src/components/WelcomeModal.tsx", "r") as f:
    content = f.read()

# Replace the slides definition
new_slides = """const slides = [
    {
      icon: <Image size={40} className={isLightMode ? 'text-blue-500' : 'text-blue-400'} />,
      title: "Шаг 1: Загрузите свое фото",
      text: "Сделайте селфи или загрузите фото, где вы смотрите прямо в камеру при хорошем освещении. Важно: лицо должно быть открыто.",
      bg: isLightMode ? "bg-gradient-to-br from-blue-50 to-indigo-50" : "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
      border: isLightMode ? "border-blue-100" : "border-blue-500/20"
    },
    {
      icon: <Zap size={40} className={isLightMode ? 'text-amber-500' : 'text-amber-400'} />,
      title: "Шаг 2: Получите анализ",
      text: "Нейросеть мгновенно определит форму вашего лица и структуру волос, чтобы подобрать стили, которые гарантированно вам подойдут.",
      bg: isLightMode ? "bg-gradient-to-br from-amber-50 to-orange-50" : "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      border: isLightMode ? "border-amber-100" : "border-amber-500/20"
    },
    {
      icon: <Scissors size={40} className={isLightMode ? 'text-purple-500' : 'text-purple-400'} />,
      title: "Шаг 3: Выберите и примерьте",
      text: "Выбирайте любые прически из рекомендаций или нашей библиотеки, нажимайте «Примерить» и скачивайте готовый результат!",
      bg: isLightMode ? "bg-gradient-to-br from-purple-50 to-fuchsia-50" : "bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10",
      border: isLightMode ? "border-purple-100" : "border-purple-500/20"
    }
  ];"""

content = re.sub(r'const slides = \[\s*\{.*?\}\s*\];', new_slides, content, flags=re.DOTALL)

with open("src/components/WelcomeModal.tsx", "w") as f:
    f.write(content)
