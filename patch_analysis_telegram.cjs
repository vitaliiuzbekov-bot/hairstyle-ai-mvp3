const fs = require('fs');
let code = fs.readFileSync('src/server/routes/analysis.ts', 'utf8');

code = code.replace(
  'logToTelegram("⚠️ *Gemini Vision Fallback:* " + e.message).catch(console.error);',
  'logToTelegram("⚠️ *Gemini Vision:* Ошибка региона (Render). Рекомендуется выбрать регион US (Oregon/Ohio) при деплое, чтобы избежать блокировок Gemini Free Tier. Перешел на резервный базовый анализ.").catch(console.error);'
);

fs.writeFileSync('src/server/routes/analysis.ts', code);
console.log("Patched analysis telegram log");
