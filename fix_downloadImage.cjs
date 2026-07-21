const fs = require('fs');
let content = fs.readFileSync('src/utils/downloadImage.ts', 'utf8');

content = content.replace(
  /export const downloadImage = async \(url: string, filename: string\) => \{/,
  `export const downloadImage = async (url: string, filename: string) => {
  try {
    const tg = window.Telegram?.WebApp;
    const tgUserId = tg?.initDataUnsafe?.user?.id;
    if (tgUserId) {
      try {
        const finalUrl = await applyWatermark(url).catch(() => url);
        tg.showAlert("Отправляем фото вам в чат бота, подождите секунду...");
        const res = await fetch('/api/send-to-telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tgUserId: tgUserId.toString(),
            type: 'image',
            singleImage: finalUrl
          })
        });
        if (res.ok) {
          tg.showAlert("Готово! Фото отправлено вам в личные сообщения бота.");
          return;
        } else {
            console.error("Failed to send to telegram via bot", await res.text());
        }
      } catch (err) {
        console.error("Error in telegram upload", err);
      }
      // If it fails for any reason, fallback to instructions
      if (tg.showAlert) {
        tg.showAlert("В Telegram: нажмите на фото и удерживайте пару секунд, затем выберите «Сохранить» или «Поделиться».");
      }
      return;
    }`
);

// We need to remove the old tg branch
content = content.replace(
  /    const tg = window\.Telegram\?\.WebApp;\n    if \(tg && tg\.initData\) \{[\s\S]*?      return;\n    \}\n    const finalUrl/,
  `    const finalUrl`
);

fs.writeFileSync('src/utils/downloadImage.ts', content);
