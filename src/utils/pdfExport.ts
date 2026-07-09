declare var html2pdf: any;

function getBase64Image(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return img.src;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}


async function urlToBase64(url) {
  if (!url || url.startsWith('data:')) return url;
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Failed to fetch image to base64:", url, e);
    return url;
  }
}

const loadHtml2Pdf = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).html2pdf) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load html2pdf.js"));
    document.head.appendChild(script);
  });
};

export const exportToPDF = async (
  elementIdOrEvent?: string | React.MouseEvent,
  filename: string = "neurostylist-guide.pdf",
  images?: { before?: string, reference?: string, after?: string }
): Promise<void> => {
  let elementId = "hairdresser-guide-content";
  if (elementIdOrEvent && typeof elementIdOrEvent === "string") {
    elementId = elementIdOrEvent;
  }

  const guideElement = document.getElementById(elementId);
  if (!guideElement) return;

  try {
    await loadHtml2Pdf();
    // 1. Get images (from passed props or fallback to DOM)
    let imgBeforeSrc = images?.before;
    let imgRefSrc = images?.reference;
    let imgAfterSrc = images?.after;

    const beforeImageElement = document.querySelector("#upload-zone-container img") as HTMLImageElement;
    const refImageElement = document.querySelector("#reference-image-preview img") as HTMLImageElement;
    const vtonResultEl = document.querySelector("#vton-result-image img") as HTMLImageElement;
    
    if (!imgBeforeSrc) imgBeforeSrc = beforeImageElement ? getBase64Image(beforeImageElement) : null;
    if (!imgRefSrc) imgRefSrc = refImageElement ? getBase64Image(refImageElement) : null;
    if (!imgAfterSrc) imgAfterSrc = (vtonResultEl && vtonResultEl !== beforeImageElement && vtonResultEl !== refImageElement) ? getBase64Image(vtonResultEl) : null;

    // Convert all URLs to base64 to ensure html2canvas can render them
    imgBeforeSrc = await urlToBase64(imgBeforeSrc);
    imgRefSrc = await urlToBase64(imgRefSrc);
    imgAfterSrc = await urlToBase64(imgAfterSrc);

    // 2. Clone the content to extract textual data
    const cloneText = guideElement.cloneNode(true) as HTMLElement;
    const interactiveElements = cloneText.querySelectorAll("button, input, textarea, svg, img, .hide-in-pdf");
    interactiveElements.forEach(el => el.remove());

    // Strip all class attributes to prevent complex Tailwind v4 colors from appearing in the cloned HTML
    const allElements = cloneText.querySelectorAll("*");
    allElements.forEach(el => el.removeAttribute("class"));
    cloneText.removeAttribute("class");

    let contentHTML = cloneText.innerHTML;

    // Wrap the inner HTML in a beautifully styled container
    const pdfContainer = document.createElement("div");
    pdfContainer.style.width = "718px"; // A4 width (210mm) minus 2x 15mm margins ≈ 180mm ≈ 680px. We use 718px for good scale.
    pdfContainer.style.backgroundColor = "#ffffff";
    pdfContainer.style.color = "#111827";
    pdfContainer.style.fontFamily = "Arial, Helvetica, sans-serif";
    pdfContainer.style.position = "relative";
    
    pdfContainer.innerHTML = `
      <style>
        .pdf-page { box-sizing: border-box; padding: 10px 20px; }
        
        .pdf-header { border-bottom: 2px solid #111; padding-bottom: 24px; margin-bottom: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; page-break-inside: avoid; }
        .pdf-header h1 { font-size: 34px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; color: #000; }
        .pdf-header p { font-size: 13px; color: #4b5563; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; }
        .pdf-date { font-size: 12px; font-weight: 500; color: #6b7280; margin-top: 12px; }
        
        .pdf-images-grid { display: flex; flex-direction: row; justify-content: center; align-items: stretch; gap: 16px; width: 100%; margin-bottom: 36px; page-break-inside: avoid; }
        .pdf-img-col { flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 0; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }
        .pdf-img-wrap { width: 100%; height: 260px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .pdf-img-wrap img { max-width: 100%; max-height: 260px; object-fit: contain; border-radius: 8px; }
        
        .pdf-content { text-align: left; font-size: 14px; line-height: 1.6; color: #1f2937; letter-spacing: normal; word-spacing: normal; }
        
        /* Strong aesthetic typography and clear structure */
        .pdf-content h2, .pdf-content h3, .pdf-content h4 { font-size: 18px; font-weight: 800; text-transform: uppercase; margin-top: 36px; margin-bottom: 16px; color: #000; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; page-break-after: avoid; page-break-inside: avoid; letter-spacing: 0.02em; }
        .pdf-content p { margin-bottom: 16px; font-weight: 400; page-break-inside: avoid; word-wrap: break-word; }
        .pdf-content ul { padding-left: 24px; margin-bottom: 24px; }
        .pdf-content li { margin-bottom: 10px; page-break-inside: avoid; }
        .pdf-content strong { font-weight: 700; color: #000; }
        
        /* Visual footer for the end of the document */
        .pdf-footer { margin-top: 60px; border-top: 1px solid #e5e7eb; padding-top: 20px; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; page-break-inside: avoid; font-weight: 600; }
        
        .pdf-watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 140px; font-weight: 900; color: rgba(0,0,0,0.03); pointer-events: none; white-space: nowrap; z-index: 9999; }
      </style>
      <div class="pdf-page">
        <div class="pdf-watermark">HAIRSTYLE AI</div>
        
        <div class="pdf-header">
          <h1>НейроСтилист</h1>
          <p>Техническая карта / Blueprint</p>
          <div class="pdf-date">
            Дата: ${new Date().toLocaleDateString('ru-RU')}
          </div>
        </div>

        <div class="pdf-images-grid ${imgBeforeSrc && imgRefSrc && imgAfterSrc ? 'cols-3' : (imgBeforeSrc && imgRefSrc) ? 'cols-2' : 'cols-2'}">
          ${imgBeforeSrc ? `
            <div class="pdf-img-col">
              <span>До (База)</span>
              <div class="pdf-img-wrap"><img src="${imgBeforeSrc}" ${imgBeforeSrc.startsWith('http') ? 'crossorigin="anonymous"' : ''} /></div>
            </div>
          ` : ''}
          ${imgRefSrc ? `
            <div class="pdf-img-col">
              <span>Стиль (Референс)</span>
              <div class="pdf-img-wrap"><img src="${imgRefSrc}" ${imgRefSrc && imgRefSrc.startsWith('http') ? 'crossorigin="anonymous"' : ''} /></div>
            </div>
          ` : ''}
          ${imgAfterSrc ? `
            <div class="pdf-img-col">
              <span>После (Результат)</span>
              <div class="pdf-img-wrap"><img src="${imgAfterSrc}" ${imgAfterSrc && imgAfterSrc.startsWith('http') ? 'crossorigin="anonymous"' : ''} /></div>
            </div>
          ` : ''}
        </div>

        <div class="pdf-content">
          ${contentHTML.replace(/TailwindClasses/g, '')}
        </div>

        <div class="pdf-footer">
          <span>Сгенерировано AI Studio</span>
          <span>HairStyle AI • Конфиденциально</span>
        </div>
      </div>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "718px";
    iframe.style.height = "2000px";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);
    
    const idoc = iframe.contentDocument || (iframe.contentWindow ? iframe.contentWindow.document : null);
    if (idoc) {
      idoc.body.appendChild(pdfContainer);
    }

    const opt = {
      margin: 15,
      filename: filename,
      image: { type: "jpeg" as const, quality: 1 },
      pagebreak: { mode: ['css', 'legacy'] },
      html2canvas: { 
         scale: 2, 
         useCORS: true,
         // REMOVED letterRendering: true, this fixes glued text in PDF
        onclone: (clonedDoc: Document) => {
          // Keep our custom PDF styles, but remove/sanitize others that crash html2canvas
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach(s => {
             // If it's our injected PDF style, keep it
             if (s.innerHTML.includes('.pdf-page')) return;
             // Otherwise sanitize oklch
             if (s.innerHTML) {
                s.innerHTML = s.innerHTML.replace(/oklch\([^)]+\)/g, '#cbd5e1');
             }
          });
          const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
          links.forEach(l => l.remove());
        }
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    const worker = html2pdf().set(opt).from(pdfContainer);
    
    let shared = false;
    let sentToBot = false;
    const pdfBlob = await worker.output('blob');

    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }

    const file = new File([pdfBlob], filename, { type: "application/pdf" });
    const tg = typeof window !== "undefined" ? (window as any).Telegram?.WebApp : null;
    const isTelegramEnv = !!tg?.initDataUnsafe?.user;

    if (isTelegramEnv && tg.initDataUnsafe?.user?.id) {
       try {
          const fd = new FormData();
          fd.append("tgUserId", tg.initDataUnsafe.user.id.toString());
          fd.append("pdf", file);
          const res = await fetch("/api/send-pdf", {
             method: "POST",
             headers: {
                "x-telegram-init-data": tg.initData || ""
             },
             body: fd
          });
          if (res.ok) {
             sentToBot = true;
             if (tg.showAlert) {
                tg.showAlert("Готово! Гайд успешно отправлен вам в личные сообщения бота.");
             }
          }
       } catch(e) {
          console.warn("Failed to send PDF to bot", e);
       }
    }

    if (!sentToBot && typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Техническая карта стрижки",
            text: "Мой персональный гайд от стилиста",
            files: [file]
          });
          shared = true;
        }
      } catch (e) {
        console.warn("Share failed, falling back to download", e);
      }
    }

    if (!shared && !sentToBot) {
      await worker.save();
    }

  } catch (error) {
    console.error("PDF export failed:", error);
    alert("Ошибка при экспорте в PDF.");
  }
};
