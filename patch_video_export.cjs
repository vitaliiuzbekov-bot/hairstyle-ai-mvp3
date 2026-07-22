const fs = require('fs');
let content = fs.readFileSync('src/utils/videoExport.ts', 'utf8');

content = content.replace(
    'img.crossOrigin = "anonymous";\n          img.onload = () => res(img);\n          img.onerror = rej;',
    `if (!src.startsWith('data:') && !src.startsWith('blob:')) {
            img.crossOrigin = "anonymous";
          }
          img.onload = () => res(img);
          img.onerror = () => rej(new Error("Не удалось загрузить изображение: " + src.substring(0, 50)));`
);

fs.writeFileSync('src/utils/videoExport.ts', content);
console.log("Patched videoExport.ts crossOrigin and onerror!");
