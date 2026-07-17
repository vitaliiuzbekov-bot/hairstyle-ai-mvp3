import "dotenv/config";

export async function sendPhotoToTelegramUser(userId: string, imageBuffer: Buffer, caption: string = "", signal?: AbortSignal, webAppUrl?: string): Promise<string | null> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || botToken === "MY_TELEGRAM_BOT_TOKEN") return null;

  try {
    const formData = new FormData();
    formData.append("chat_id", userId);
    formData.append("photo", new Blob([imageBuffer], { type: "image/jpeg" }), "haircut.jpg");
    if (caption) {
      formData.append("caption", caption);
      formData.append("parse_mode", "HTML");
    }

    // Add inline keyboard to open mini app
    const url = webAppUrl || process.env.VITE_FRONTEND_URL || "https://neirostilist.ru";
    formData.append("reply_markup", JSON.stringify({
      inline_keyboard: [[
        { text: "📸 Открыть результат", web_app: { url } }
      ]]
    }));

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: "POST",
      body: formData,
      ...(signal ? { signal } : {})
    });

    const data: any = await res.json();
    if (data.ok && data.result?.photo) {
      // The photo array contains multiple sizes. We take the largest one (last element).
      const photos = data.result.photo;
      const largestPhoto = photos[photos.length - 1];
      return largestPhoto.file_id;
    } else {
      console.error("Failed to send photo to Telegram:", data);
      return null;
    }
  } catch (err) {
    console.error("Error sending photo to user:", err);
    return null;
  }
}

export async function getTelegramFileUrl(fileId: string): Promise<string | null> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return null;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
    const data: any = await res.json();
    if (data.ok && data.result?.file_path) {
      return `https://api.telegram.org/file/bot${botToken}/${data.result.file_path}`;
    }
    return null;
  } catch(e) {
    console.error("Failed to get file from telegram:", e);
    return null;
  }
}
