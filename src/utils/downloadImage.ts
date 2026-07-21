import { applyWatermark } from "./watermark";

export const downloadImage = async (url: string, filename: string) => {
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
      } else {
        alert("В Telegram: нажмите на фото и удерживайте пару секунд, затем выберите «Сохранить».");
      }
      return;
    }
    
    const finalUrl = await applyWatermark(url).catch(() => url);
    if (finalUrl.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = finalUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn("Direct download failed, attempting fallback...", error);
    // Fallback
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
