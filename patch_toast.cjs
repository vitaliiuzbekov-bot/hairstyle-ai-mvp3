const fs = require('fs');
let code = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

code = code.replace(
  'setToastMessage(`Видео отправлено на скачивание!`);',
  'setToastMessage(`Видео успешно создано!`);'
);

fs.writeFileSync('src/components/VTONPreviewSection.tsx', code);
console.log("Patched toast message in VTONPreviewSection.tsx");
