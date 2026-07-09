const fs = require('fs');
const content = fs.readFileSync('src/components/RotatingFactsLoader.tsx', 'utf8');
const newContent = content.replace(
  /title = "ИИ анализирует образ\.\.\."/g,
  'title = "Изучаем ваши черты..."'
).replace(
  /else if \(title === "ИИ анализирует образ\.\.\."\) \{/g,
  'else if (title === "Изучаем ваши черты...") {'
);
fs.writeFileSync('src/components/RotatingFactsLoader.tsx', newContent);
