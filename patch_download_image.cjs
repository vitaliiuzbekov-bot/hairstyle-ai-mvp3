const fs = require('fs');

const content = `import { applyWatermark } from "./watermark";

export const downloadImage = async (url: string, filename: string) => {
  try {
    const finalUrl = await applyWatermark(url).catch(() => url);
    const tg = (window as any).Telegram?.WebApp;
    
    let publicUrl = finalUrl;
    
    // If we have a Data URI and we are inside Telegram, we need to upload it first
    // to get a public URL for tg.downloadFile or tg.openLink
    if (finalUrl.startsWith("data:") && tg && tg.initData) {
        const ext = filename.split('.').pop() || 'jpg';
        const res = await fetch('/api/upload-temp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: finalUrl, ext })
        });
        
        if (res.ok) {
            const data = await res.json();
            // Use the download-local proxy endpoint that sets Content-Disposition
            publicUrl = window.location.origin + \`/api/download-local?file=\${data.file}&filename=\${filename}\`;
        }
    } else if (!finalUrl.startsWith("data:") && tg && tg.initData) {
        // External URL inside telegram
        publicUrl = window.location.origin + \`/api/download-proxy?url=\${encodeURIComponent(finalUrl)}&filename=\${filename}\`;
    }

    // Attempt native Telegram download if available
    if (tg && tg.initData && tg.downloadFile && !publicUrl.startsWith("data:")) {
        tg.downloadFile({ url: publicUrl, file_name: filename });
        return;
    }
    
    // Attempt Telegram openLink if available
    if (tg && tg.initData && tg.openLink && !publicUrl.startsWith("data:")) {
        // On iOS sometimes openLink needs to be triggered directly or might not prompt download
        // but it's the safest fallback inside WebView
        tg.openLink(publicUrl);
        return;
    }

    // Standard Web Fallback
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
    
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
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
`;

fs.writeFileSync('src/utils/downloadImage.ts', content);
console.log("Rewrote downloadImage.ts!");
