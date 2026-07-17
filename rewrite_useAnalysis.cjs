const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const oldCode = `          if (data.isAsync) {
             consumeToken();
             addToast("Фото обрабатывается. Мы пришлем результат в Telegram!", "info");
             hapticNotification('success');
             return;
          }`;

const newCode = `          if (data.isAsync) {
             consumeToken();
             addToast("Фото обрабатывается. Мы пришлем результат в Telegram!", "info");
             hapticNotification('success');
             return;
          }
          
          if (data.originalUrl && data.imageUrl) {
            localStorage.setItem('lastResult', JSON.stringify({ 
              imageUrl: data.imageUrl, 
              originalUrl: data.originalUrl 
            }));
          }`;

code = code.replace(oldCode, newCode);

fs.writeFileSync('src/hooks/useAnalysis.ts', code);
console.log("Rewrote useAnalysis.ts");
