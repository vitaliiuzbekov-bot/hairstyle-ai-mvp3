const fs = require('fs');
let code = fs.readFileSync('src/server/services/telegramBot.ts', 'utf8');

code = code.replace(
  /export async function sendPhotoToTelegramUser\(userId: string, imageBuffer: Buffer, caption: string = "", signal\?: AbortSignal\): Promise<string \| null> \{/,
  'export async function sendPhotoToTelegramUser(userId: string, imageBuffer: Buffer, caption: string = "", signal?: AbortSignal, webAppUrl?: string): Promise<string | null> {'
);

const replyMarkupOriginal = `    // Add inline keyboard to open mini app
    formData.append("reply_markup", JSON.stringify({
      inline_keyboard: [[
        { text: "💇‍♂️ Твоя стрижка готова!", web_app: { url: process.env.VITE_FRONTEND_URL || "https://neirostilist.ru" } }
      ]]
    }));`;

const replyMarkupNew = `    // Add inline keyboard to open mini app
    const url = webAppUrl || process.env.VITE_FRONTEND_URL || "https://neirostilist.ru";
    formData.append("reply_markup", JSON.stringify({
      inline_keyboard: [[
        { text: "📸 Открыть результат", web_app: { url } }
      ]]
    }));`;

code = code.replace(replyMarkupOriginal, replyMarkupNew);

fs.writeFileSync('src/server/services/telegramBot.ts', code);
console.log("Updated telegramBot.ts");
