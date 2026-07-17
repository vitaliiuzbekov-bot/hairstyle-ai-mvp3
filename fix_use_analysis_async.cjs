const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const targetStr = `          if (data.referenceImage) {
            setArGeneratedImageUrl((prev) => ({
              ...prev,
              [styleKeyword]: data.referenceImage,
            }));
          }

          if (data.imageUrl) {
            let watermarkedUrl = data.imageUrl;`;

const replacementStr = `          if (data.referenceImage) {
            setArGeneratedImageUrl((prev) => ({
              ...prev,
              [styleKeyword]: data.referenceImage,
            }));
          }

          if (data.isAsync) {
             consumeToken();
             addToast("Фото обрабатывается. Мы пришлем результат в Telegram!", "info");
             hapticNotification('success');
             return;
          }

          if (data.imageUrl) {
            let watermarkedUrl = data.imageUrl;`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/hooks/useAnalysis.ts', code);
console.log("Updated useAnalysis.ts to handle isAsync");
