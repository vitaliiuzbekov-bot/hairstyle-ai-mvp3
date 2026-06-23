import html2pdf from "html2pdf.js";

function getBase64Image(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return img.src;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}

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
    // 1. Fetch images from passed payload or DOM fallback
    const beforeImageElement = document.querySelector('img[alt="Ваша база"], img[alt="До"]') as HTMLImageElement;
    const refImageElement = document.querySelector('img[alt="Свой референс"], img[alt="Референс"]') as HTMLImageElement;
    const afterImageElement = document.querySelector('img[alt="После"]') as HTMLImageElement;
    const vtonResultEl = document.querySelector('.ReactCompareSliderImage, img[alt="Результат"]') as HTMLImageElement;

    const imgBeforeSrc = images?.before || (beforeImageElement ? getBase64Image(beforeImageElement) : null);
    const imgRefSrc = images?.reference || (refImageElement ? getBase64Image(refImageElement) : null);
    const imgAfterSrc = images?.after || (afterImageElement ? getBase64Image(afterImageElement) : 
                        (vtonResultEl && vtonResultEl !== beforeImageElement && vtonResultEl !== refImageElement) ? getBase64Image(vtonResultEl) : null);


    // 2. Clone the content to extract textual data
    const cloneText = guideElement.cloneNode(true) as HTMLElement;
    const interactiveElements = cloneText.querySelectorAll("button, input, textarea, svg, img, .hide-in-pdf");
    interactiveElements.forEach(el => el.remove());

    let contentHTML = cloneText.innerHTML;

    // Wrap the inner HTML in a beautifully styled container
    const pdfContainer = document.createElement("div");
    pdfContainer.style.width = "794px"; // A4 width at 96 DPI
    pdfContainer.style.minHeight = "1123px"; // A4 height
    pdfContainer.style.backgroundColor = "#ffffff";
    pdfContainer.style.color = "#111827";
    pdfContainer.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
    pdfContainer.style.position = "relative";
    pdfContainer.style.overflow = "hidden";

    pdfContainer.innerHTML = `
      <style>
        .pdf-page { padding: 40px; box-sizing: border-box; }
        .pdf-header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .pdf-header h1 { font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -0.03em; color: #000; }
        .pdf-header p { font-size: 14px; color: #4b5563; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.1em; }
        .pdf-date { font-size: 14px; font-weight: 600; color: #000; }
        
        .pdf-images-grid { display: grid; gap: 20px; margin-bottom: 40px; }
        .pdf-images-grid.cols-2 { grid-template-columns: 1fr 1fr; }
        .pdf-images-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
        .pdf-img-col { display: flex; flex-direction: column; }
        .pdf-img-col span { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
        .pdf-img-wrap { width: 100%; aspect-ratio: 3/4; overflow: hidden; border-radius: 8px; background: #f3f4f6; }
        .pdf-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        .pdf-content { column-count: 2; column-gap: 40px; text-align: left; }
        .pdf-content h2, .pdf-content h3 { font-size: 16px; font-weight: 800; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; color: #000; border-bottom: 1px solid #000; padding-bottom: 4px; break-after: avoid; }
        .pdf-content p { font-size: 13px; line-height: 1.6; color: #374151; margin-bottom: 12px; font-weight: 400; }
        .pdf-content ul { padding-left: 16px; margin-bottom: 16px; font-size: 13px; line-height: 1.6; color: #374151; }
        .pdf-content li { margin-bottom: 6px; }
        
        /* Strong visual separator for brand */
        .pdf-footer { position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
        .pdf-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; font-weight: 900; color: rgba(0,0,0,0.02); pointer-events: none; white-space: nowrap; }
      </style>

      <div class="pdf-page">
        <div class="pdf-watermark">HAIRSTYLE AI</div>
        
        <div class="pdf-header">
          <div>
            <h1>НейроСтилист</h1>
            <p>Техническая карта / Blueprint</p>
          </div>
          <div class="pdf-date">
            Дата: ${new Date().toLocaleDateString('ru-RU')}
          </div>
        </div>

        <div class="pdf-images-grid ${imgBeforeSrc && imgRefSrc && imgAfterSrc ? 'cols-3' : (imgBeforeSrc && imgRefSrc) ? 'cols-2' : 'cols-2'}">
          ${imgBeforeSrc ? `
            <div class="pdf-img-col">
              <span>До (База)</span>
              <div class="pdf-img-wrap"><img src="${imgBeforeSrc}" /></div>
            </div>
          ` : ''}
          ${imgRefSrc ? `
            <div class="pdf-img-col">
              <span>Стиль (Референс)</span>
              <div class="pdf-img-wrap"><img src="${imgRefSrc}" /></div>
            </div>
          ` : ''}
          ${imgAfterSrc ? `
            <div class="pdf-img-col">
              <span>После (Результат)</span>
              <div class="pdf-img-wrap"><img src="${imgAfterSrc}" /></div>
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

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: "jpeg" as const, quality: 1 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    const worker = html2pdf().set(opt).from(pdfContainer);
    
    let shared = false;
    let sentToBot = false;
    const pdfBlob = await worker.output('blob');

    const file = new File([pdfBlob], filename, { type: "application/pdf" });

    const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
    const isTelegramEnv = !!tg?.initDataUnsafe?.user;

    if (isTelegramEnv && tg.initDataUnsafe?.user?.id) {
       try {
          const fd = new FormData();
          fd.append("tgUserId", tg.initDataUnsafe.user.id.toString());
          fd.append("pdf", file);

          const res = await fetch("/api/send-pdf", {
             method: "POST",
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

