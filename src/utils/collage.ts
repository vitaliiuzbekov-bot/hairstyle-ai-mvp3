
const loadImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = async () => {
      try {
        const res = await fetch(url, { mode: 'cors' });
        const blob = await res.blob();
        const bUrl = URL.createObjectURL(blob);
        const img2 = new Image();
        img2.onload = () => {
          resolve(img2);
          // Wait a bit before revoking, just in case
          setTimeout(() => URL.revokeObjectURL(bUrl), 100);
        };
        img2.onerror = (e) => reject(new Error("Failed to load fallback image: " + url));
        img2.src = bUrl;
      } catch(e) {
        reject(new Error("Error loading image: " + url));
      }
    };
    img.src = url;
  });
};

export const generateCollage = async (beforeUrl: string, afterUrl: string, salonName?: string): Promise<string> => {
   try {
      const img1 = await loadImage(beforeUrl);
      const img2 = await loadImage(afterUrl);

      const canvas = document.createElement("canvas");
      
      const targetHeight = 1024;
      const targetW1 = img1.width * (targetHeight / img1.height);
      const targetW2 = img2.width * (targetHeight / img2.height);
      
      const padding = 20;
      const bannerHeight = 80;
      const totalWidth = targetW1 + targetW2 + padding * 3;
      const totalHeight = targetHeight + padding * 2 + bannerHeight;
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No Canvas context");
      
      ctx.fillStyle = "#111111";
      ctx.fillRect(0,0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const titleText = salonName ? `Стиль от салона ${salonName} (НейроСтилист)` : `До и После (НейроСтилист)`;
      ctx.fillText(titleText, canvas.width / 2, bannerHeight / 2 + padding/2);
      
      const img1Y = bannerHeight + padding;
      ctx.drawImage(img1, padding, img1Y, targetW1, targetHeight);
      ctx.drawImage(img2, padding * 2 + targetW1, img1Y, targetW2, targetHeight);
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      const badgeW = 120;
      const badgeH = 50;
      ctx.fillRect(padding + 20, img1Y + 20, badgeW, badgeH);
      ctx.fillRect(padding * 2 + targetW1 + 20, img1Y + 20, badgeW, badgeH);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ДО", padding + 20 + badgeW/2, img1Y + 20 + badgeH/2);
      ctx.fillText("ПОСЛЕ", padding * 2 + targetW1 + 20 + badgeW/2, img1Y + 20 + badgeH/2);
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "italic 24px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("https://t.me/neirostilist_bot", canvas.width - padding, canvas.height - padding/2);
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          } else {
            resolve(canvas.toDataURL("image/jpeg", 0.9));
          }
        }, "image/jpeg", 0.9);
      });
   } catch(e) {
      throw e;
   }
};
