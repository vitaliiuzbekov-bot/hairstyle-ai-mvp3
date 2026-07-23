const fs = require('fs');
let code = `export async function downloadVideoInTelegram(videoBlob: Blob, filename: string): Promise<void> {
  const tg = (window as any).Telegram?.WebApp;

  // 1. В Telegram WebApp самое надежное решение (особенно для iOS) — отправка файла в чат
  if (tg && tg.initData) {
      try {
          const reader = new FileReader();
          reader.readAsDataURL(videoBlob);
          await new Promise<void>((resolve, reject) => {
              reader.onloadend = async () => {
                  try {
                      const base64data = reader.result as string;
                      const ext = filename.split('.').pop() || 'mp4';
                      
                      const resUpload = await fetch('/api/send-video-to-chat', {
                          method: 'POST',
                          headers: { 
                              'Content-Type': 'application/json',
                              'x-telegram-init-data': tg.initData
                          },
                          body: JSON.stringify({ base64: base64data, ext })
                      });
                      
                      if (!resUpload.ok) throw new Error("Server error " + resUpload.status);
                      resolve();
                  } catch(e) { reject(e); }
              };
              reader.onerror = reject;
          });
          
          if (tg.showAlert) {
              tg.showAlert("Видео отправлено в чат с ботом! Вернитесь в чат, чтобы сохранить его в галерею.");
          }
          return; // Успешно отправлено
      } catch (e) {
          console.error("Failed to send video to chat", e);
          // Если не получилось, идем дальше к запасным вариантам
      }
  }

  // 2. Попытка использования WebShare API (Safari / macOS)
  if (navigator.share && navigator.canShare) {
    const file = new File([videoBlob], filename, { type: videoBlob.type });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Моя новая прическа',
          files: [file]
        });
        return;
      } catch (e) {
        // Пользователь отменил шеринг или возникла ошибка
      }
    }
  }

  // 3. Стандартный метод для Desktop / Android Chrome
  const url = URL.createObjectURL(videoBlob);
  
  if (tg?.downloadFile) {
    tg.downloadFile({ url, file_name: filename });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return;
  }

  // 4. Фолбэк через обычную ссылку
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
`;

fs.writeFileSync('src/utils/telegramDownload.ts', code);
console.log("Patched telegramDownload.ts");
