const fs = require('fs');
let code = fs.readFileSync('src/utils/telegramDownload.ts', 'utf8');

code = code.replace(
  'tg.showAlert("Видео отправлено в чат с ботом! Вернитесь в чат, чтобы сохранить его в галерею.");',
  'tg.showAlert("Видео отправлено в чат! Нажмите ОК, чтобы вернуться в чат и сохранить его.", () => { tg.close(); });'
);

fs.writeFileSync('src/utils/telegramDownload.ts', code);
console.log("Patched to close WebApp");
