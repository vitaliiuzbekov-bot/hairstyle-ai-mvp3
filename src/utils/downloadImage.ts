export const downloadImage = async (url: string, filename: string) => {
  try {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData) {
      if (tg.showAlert) {
        tg.showAlert(
          "В Telegram: нажмите на фото и удерживайте пару секунд, затем выберите «Сохранить» или «Поделиться».",
        );
      } else {
        alert(
          "В Telegram: нажмите на фото и удерживайте пару секунд, затем выберите «Сохранить».",
        );
      }
      return;
    }

    if (url.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const response = await fetch(url);
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
