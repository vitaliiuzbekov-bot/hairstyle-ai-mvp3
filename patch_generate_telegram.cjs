const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const target = 'console.error("Gemini failed to generate prompt, falling back to basic prompt:", err?.message || err);';
const replacement = 'console.error("Gemini failed to generate prompt, falling back to basic prompt:", err?.message || err);\n        logToTelegram("⚠️ *Gemini Prompting:* Ошибка региона. Используется базовый промпт. Перенесите Render в US регион.").catch(console.error);';

code = code.replace(target, replacement);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Patched generate telegram log");
