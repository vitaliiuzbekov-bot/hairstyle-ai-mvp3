const fs = require('fs');
let content = fs.readFileSync('src/utils/videoExport.ts', 'utf8');

content = content.replace(
  /const canvas = document\.createElement\('canvas'\);/,
  `const canvas = document.createElement('canvas');
      if (typeof canvas.captureStream !== 'function') {
        throw new Error("Ваше устройство не поддерживает сохранение видео. Попробуйте на компьютере или используйте 'Коллаж'.");
      }`
);

fs.writeFileSync('src/utils/videoExport.ts', content);
