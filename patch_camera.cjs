const fs = require('fs');
const file = 'src/hooks/usePhotoHandlers.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {`,
  `const tg = (window as any).Telegram?.WebApp;
      const isTgMobile = tg && ['android', 'ios'].includes(tg.platform);
      
      if (!isTgMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {`
);

fs.writeFileSync(file, content);
console.log('patched camera handler');
