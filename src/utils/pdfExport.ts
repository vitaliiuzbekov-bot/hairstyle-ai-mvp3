export const exportToPDF = async (
  elementIdOrEvent?: string | React.MouseEvent, 
  filename: string = "neurostylist-guide.pdf"
): Promise<void> => {
  let elementId = "hairdresser-guide-content";
  if (elementIdOrEvent && typeof elementIdOrEvent === "string") {
    elementId = elementIdOrEvent;
  }

  const guideElement = document.getElementById(elementId);
  if (!guideElement) return;

  try {
    // Create a clone of the element to style it correctly for PDF
    const clone = guideElement.cloneNode(true) as HTMLElement;
    
    // Base setup for the clone to ensure clean rendering
    clone.style.width = "800px";
    clone.style.minHeight = "100%";
    clone.style.background = "#ffffff";
    clone.style.color = "#111827"; // Tailwind gray-900
    clone.style.padding = "50px";
    clone.style.fontSize = "16px";
    clone.style.lineHeight = "1.6";
    clone.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";

    // Try to find the images in the DOM to include them in the PDF
    const beforeImageElement = document.querySelector('img[alt="Ваша база"], img[alt="До"]') as HTMLImageElement;
    const refImageElement = document.querySelector('img[alt="Свой референс"], img[alt="Референс"]') as HTMLImageElement;
    const afterImageElement = document.querySelector('img[alt="После"]') as HTMLImageElement;

    // Create a dedicated top gallery for the photos
    const imagesContainer = document.createElement("div");
    imagesContainer.style.display = "flex";
    imagesContainer.style.gap = "24px";
    imagesContainer.style.marginBottom = "40px";
    imagesContainer.style.justifyContent = "center";
    imagesContainer.style.alignItems = "flex-start"; // Ensure images scale naturally

    const addImageToPdf = (imgEl: HTMLImageElement | null, label: string) => {
        if (!imgEl || !imgEl.src) return;
        const col = document.createElement("div");
        col.style.flex = "1";
        col.style.display = "flex";
        col.style.flexDirection = "column";
        col.style.alignItems = "center";
        
        const labelEl = document.createElement("div");
        labelEl.innerText = label;
        labelEl.style.fontWeight = "700";
        labelEl.style.marginBottom = "14px";
        labelEl.style.fontSize = "16px";
        labelEl.style.color = "#374151"; // gray-700
        labelEl.style.letterSpacing = "0.05em"; // Tracking wide
        
        const imgContainer = document.createElement("div");
        imgContainer.style.width = "100%";
        imgContainer.style.borderRadius = "16px";
        imgContainer.style.overflow = "hidden";
        imgContainer.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"; // shadow-lg

        const img = document.createElement("img");
        img.src = imgEl.src;
        img.style.display = "block";
        img.style.width = "100%";
        img.style.height = "auto"; // Prevents flattening/squishing
        
        imgContainer.appendChild(img);
        col.appendChild(labelEl);
        col.appendChild(imgContainer);
        imagesContainer.appendChild(col);
    };

    addImageToPdf(beforeImageElement, "ДО (Ваша база)");
    addImageToPdf(refImageElement, "РЕФЕРЕНС (Стиль)");
    
    // Find VTON result
    const vtonResultEl = document.querySelector('.ReactCompareSliderImage, img[alt="Результат"]') as HTMLImageElement;
    if (afterImageElement) {
       addImageToPdf(afterImageElement, "ПОСЛЕ (Результат)");
    } else if (vtonResultEl && vtonResultEl !== beforeImageElement && vtonResultEl !== refImageElement) {
       addImageToPdf(vtonResultEl, "ОЖИДАЕМЫЙ РЕЗУЛЬТАТ");
    }

    if (imagesContainer.children.length > 0) {
        clone.insertBefore(imagesContainer, clone.firstChild);
    }

    // Add general text colors inside the clone since they might be white/translucent in dark mode
    const textElements = clone.querySelectorAll("span, p, li, div, h1, h2, h3, h4");
    textElements.forEach((el) => {
      const hel = el as HTMLElement;
      hel.style.color = "#1f2937"; // gray-800
      
      if (hel.tagName.toLowerCase() === "ul") {
        hel.style.listStyleType = "disc";
        hel.style.paddingLeft = "24px";
        hel.style.marginBottom = "16px";
        hel.style.color = "#4b5563"; // gray-600
      }
      if (hel.tagName.toLowerCase() === "li") {
        hel.style.marginBottom = "8px";
        hel.style.lineHeight = "1.5";
      }
      if (hel.tagName.toLowerCase() === "p") {
        hel.style.marginBottom = "16px";
        hel.style.lineHeight = "1.6";
        hel.style.color = "#374151";
      }
    });

    // Remove buttons, inputs from the clone to avoid showing it in PDF
    const interactiveElements = clone.querySelectorAll("button, input, textarea, svg");
    interactiveElements.forEach(el => el.remove());
    
    // Add Neurostylist Header
    const headerEl = document.createElement("div");
    headerEl.style.borderBottom = "2px solid #f3f4f6";
    headerEl.style.paddingBottom = "24px";
    headerEl.style.marginBottom = "32px";
    headerEl.style.display = "flex";
    headerEl.style.alignItems = "flex-end";
    headerEl.style.justifyContent = "space-between";
    headerEl.innerHTML = `
      <div>
        <h1 style="font-size: 32px; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.02em;">НейроСтилист <span style="color: #3b82f6;">AI</span></h1>
        <p style="font-size: 15px; color: #6b7280; margin: 6px 0 0 0; font-weight: 500;">Персональный гайд по стилю и стрижке</p>
      </div>
      <div style="font-size: 14px; color: #9ca3af; text-align: right; font-weight: 500;">
        ${new Date().toLocaleDateString('ru-RU')}
      </div>
    `;
    clone.insertBefore(headerEl, clone.firstChild);

    // Format H tags properly for documents
    const headings = clone.querySelectorAll("h1, h2, h3, h4");
    headings.forEach((el) => {
        const hel = el as HTMLElement;
        hel.style.color = "#111827";
        hel.style.fontWeight = "700";
        hel.style.marginTop = "32px";
        hel.style.marginBottom = "16px";
        
        if (hel.tagName === "H3" || hel.tagName === "H2") {
            hel.style.fontSize = "20px";
            hel.style.borderLeft = "4px solid #3b82f6"; // Blue brand accent
            hel.style.paddingLeft = "12px";
            // Remove bottom border as left border looks more professional
            hel.style.borderBottom = "none";
        }
    });

    // Structure cards nicely for document print format
    const cards = clone.querySelectorAll(".rounded-2xl, .rounded-3xl, .bg-white\\/5, .glass-panel");
    cards.forEach((el) => {
        const cel = el as HTMLElement;
        cel.style.background = "#f9fafb"; // Light gray bg
        cel.style.border = "1px solid #e5e7eb";
        cel.style.boxShadow = "none";
        cel.style.color = "#1f2937";
        cel.style.padding = "28px";
        cel.style.marginBottom = "24px";
        cel.style.borderRadius = "16px";
    });

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: [15, 15, 15, 15],
      filename: filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 800, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const worker = html2pdf().set(opt as any).from(clone);
    
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
            title: "Анализ от НейроСтилиста",
            text: "Мой персональный подбор стрижек и рекомендации",
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
