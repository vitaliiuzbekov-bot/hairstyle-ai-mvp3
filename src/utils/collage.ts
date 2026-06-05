export const generateCollage = async (beforeUrl: string, afterUrl: string): Promise<string> => {
   return new Promise((resolve, reject) => {
      const img1 = new Image();
      const img2 = new Image();
      img1.crossOrigin = "anonymous";
      img2.crossOrigin = "anonymous";

      img1.onload = () => {
         img2.onload = () => {
            const canvas = document.createElement("canvas");
            
            // Set standard target height
            const targetHeight = 1024;
            // Scale both images to target height
            const targetW1 = img1.width * (targetHeight / img1.height);
            const targetW2 = img2.width * (targetHeight / img2.height);

            // Left padding, middle padding, right padding, text area height
            // We want it to look good on instagram
            // Maybe a classic 1x1 or 4x5 post if possible. 
            // We will just do a simple side-by-side with nice borders.
            const padding = 20;
            const bannerHeight = 80; // For title
            const totalWidth = targetW1 + targetW2 + padding * 3;
            const totalHeight = targetHeight + padding * 2 + bannerHeight;

            canvas.width = totalWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("No Canvas context");
            
            // background
            ctx.fillStyle = "#111111"; // dark background
            ctx.fillRect(0,0, canvas.width, canvas.height);
            
            // title
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 40px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("До и После (НейроСтилист)", canvas.width / 2, bannerHeight / 2 + padding/2);

            // Draw first image
            const img1Y = bannerHeight + padding;
            ctx.drawImage(img1, padding, img1Y, targetW1, targetHeight);
            
            // Draw second image
            ctx.drawImage(img2, padding * 2 + targetW1, img1Y, targetW2, targetHeight);
            
            // Add DOM badges
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

            resolve(canvas.toDataURL("image/jpeg", 0.9));
         };
         img2.onerror = reject;
         img2.src = afterUrl;
      };
      img1.onerror = reject;
      img1.src = beforeUrl;
   });
};
