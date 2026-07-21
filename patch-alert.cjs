const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

content = content.replace(/tg\.showAlert\(/g, "tg.showAlert ? tg.showAlert(");
content = content.replace(/tg\.showAlert\("Генерируем/g, "tg.showAlert ? tg.showAlert(\"Генерируем"); // wait regex is better

content = content.replace(/tg\.showAlert\((.*?)\);/g, "(tg.showAlert ? tg.showAlert($1) : alert($1));");

fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
