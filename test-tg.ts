import { uploadToTelegram, getTelegramFileUrl } from "./src/server/services/telegramBot";

async function run() {
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    
    if (!tgToken || !adminChatId) {
        console.log("No token or admin chat");
        return;
    }
    try {
        const fileId = await uploadToTelegram(tgToken, adminChatId, Buffer.from("test image data 123", 'utf8'));
        console.log("FileId:", fileId);
        if (fileId) {
            const url = await getTelegramFileUrl(fileId);
            console.log("URL:", url);
            const r = await fetch(url!);
            console.log("Fetch ok:", r.ok);
        }
    } catch(e) {
        console.error(e);
    }
}
run();
