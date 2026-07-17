const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const targetStr = `        (async () => {
          if (imageBuffer && req.body.tgUserId) {
            try {
              const tgFileId = await sendPhotoToTelegramUser(
                req.body.tgUserId, 
                imageBuffer, 
                \`💇 Твоя стрижка готова!\\n\\n<i>\$\{keyword || 'Примерка'\}</i>\`,
                controller.signal
              );
              console.log("Telegram async send complete:", !!tgFileId);
            } catch (e) { console.error("Async telegram error", e); }
          }
        })(),`;

const replacementStr = `        (async () => {
          if (req.body.tgUserId) {
            try {
              const botToken = process.env.TELEGRAM_BOT_TOKEN;
              if (botToken) {
                const webApp = await fetch(\`https://api.telegram.org/bot\$\{botToken\}/sendMessage\`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: req.body.tgUserId,
                    text: '✅ Результат готов!',
                    reply_markup: {
                      inline_keyboard: [[
                        { text: '📸 Открыть результат', web_app: { url: \`\$\{process.env.VITE_FRONTEND_URL\}/result?image=\$\{encodeURIComponent(swappedImageUrl)\}\` } }
                      ]]
                    }
                  })
                });
                console.log("Telegram WebApp message send complete:", webApp.ok);
              }
            } catch (e) { console.error("Async telegram error", e); }
          }
        })(),`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Updated generate.ts");
