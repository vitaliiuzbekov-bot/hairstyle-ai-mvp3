export async function downloadVideoInTelegram(videoBlob: Blob, filename: string): Promise<void> {
  const tg = (window as any).Telegram?.WebApp;

  // 1. Попытка использования WebShare API (Работает на Safari / iOS WebView)
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
        // Пользователь отменил шеринг или возникла ошибка - фолбэк ниже
      }
    }
  }

  // 2. Фолбэк для iOS WebView внутри Telegram (когда Blob URLs не работают)
  if (tg && tg.initData) {
      const reader = new FileReader();
      reader.readAsDataURL(videoBlob);
      await new Promise<void>((resolve) => {
          reader.onloadend = async () => {
              try {
                  const base64data = reader.result as string;
                  const ext = filename.split('.').pop() || 'mp4';
                  const resUpload = await fetch('/api/upload-temp', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ base64: base64data, ext })
                  });
                  if (resUpload.ok) {
                      const upData = await resUpload.json();
                      const finalUrl = window.location.origin + `/api/download-local?file=${upData.file}&filename=${filename}`;
                      
                      if (tg.downloadFile) {
                          tg.downloadFile({ url: finalUrl, file_name: filename });
                      } else if (tg.openLink) {
                          tg.openLink(finalUrl);
                      } else {
                          const a = document.createElement('a');
                          a.href = finalUrl;
                          a.target = '_blank';
                          a.download = filename;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                      }
                  }
                  resolve();
              } catch(e) { resolve(); }
          };
      });
      return;
  }

  // 3. Стандартный метод для Desktop / Android Webview
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
