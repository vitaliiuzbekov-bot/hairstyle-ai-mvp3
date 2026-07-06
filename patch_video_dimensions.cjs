const fs = require('fs');
let file = '/app/applet/src/utils/videoExport.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the canvas dimensions
content = content.replace(
  `      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;`,
  `      const canvas = document.createElement('canvas');
      const targetWidth = Math.floor(beforeImg.width / 2) * 2;
      const targetHeight = Math.floor(beforeImg.height / 2) * 2;
      canvas.width = targetWidth;
      canvas.height = targetHeight;`
);

// Replace the usages of width and height in drawImage
content = content.replace(
  /width, height\)/g,
  `targetWidth, targetHeight)`
);
content = content.replace(
  /width, height\);/g,
  `targetWidth, targetHeight);`
);
content = content.replace(
  /height \/ 2/g,
  `targetHeight / 2`
);
content = content.replace(
  /height\);/g,
  `targetHeight);`
);
content = content.replace(
  /width \*/g,
  `targetWidth *`
);

fs.writeFileSync(file, content);
