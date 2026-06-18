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
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";
    clone.style.padding = "20px";

    // We must change text colors inside the clone since they are white in the UI
    const textElements = clone.querySelectorAll("*");
    textElements.forEach((el) => {
      (el as HTMLElement).style.color = "#000000";

      // Add basic inline styles for markdown elements that lose Tailwind class support in iframe
      if (el.tagName.toLowerCase() === "ul") {
        (el as HTMLElement).style.listStyleType = "disc";
        (el as HTMLElement).style.paddingLeft = "20px";
        (el as HTMLElement).style.marginBottom = "10px";
      }
      if (el.tagName.toLowerCase() === "li") {
        (el as HTMLElement).style.marginBottom = "4px";
      }
      if (el.tagName.toLowerCase() === "strong") {
        (el as HTMLElement).style.fontWeight = "600";
      }
      if (el.tagName.toLowerCase() === "p") {
        (el as HTMLElement).style.marginBottom = "10px";
      }
    });

    // Remove the export button from the clone to avoid showing it in the PDF
    const buttonToRemove = clone.querySelector("button");
    if (buttonToRemove) buttonToRemove.remove();

    // Ensure the clone has proper base styling
    clone.style.width = "800px";
    clone.style.maxWidth = "100%";
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";
    clone.style.padding = "40px";
    clone.style.fontSize = "16px";
    clone.style.lineHeight = "1.6";
    clone.style.fontFamily = "system-ui, -apple-system, sans-serif";

    const htmlContent = clone.outerHTML;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 15,
      filename: filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const worker = html2pdf().set(opt as any).from(htmlContent);
    
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
