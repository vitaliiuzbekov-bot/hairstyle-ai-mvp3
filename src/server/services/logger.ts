import fs from "fs";
import "dotenv/config";

export async function logToTelegram(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  
  try {
    
    fs.appendFileSync('/app/applet/app.log', new Date().toISOString() + ': ' + message + '\n');
  } catch(e) {}

  if (!botToken || !adminChatId) return;

  try {
    const text = `🕒 ${new Date().toISOString()}\n\n${message}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: adminChatId,
        text,
        parse_mode: "HTML"
      })
    });
  } catch (e) {
    console.error("Failed to send log to Telegram", e);
  }
}
