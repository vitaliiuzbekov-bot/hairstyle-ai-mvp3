export const applyWatermark = (imageUrl: string, text: string = "@neirostilist_bot"): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!imageUrl) return reject("No image URL provided");
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("Canvas context not available");

            ctx.drawImage(img, 0, 0);

            const fontSize = Math.max(24, Math.floor(img.width * 0.05));
            const paddingX = Math.floor(fontSize * 0.8);
            const paddingY = Math.floor(fontSize * 0.8);
            
            // Draw a subtle translucent dark badge behind text
            ctx.font = `bold ${fontSize}px sans-serif`;
            const textMetrics = ctx.measureText(text);
            const badgeWidth = textMetrics.width + paddingX * 2;
            const badgeHeight = fontSize + paddingY;
            const badgeX = img.width - badgeWidth - paddingX;
            const badgeY = img.height - badgeHeight - paddingY;

            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            
            // Draw rounded rectangle for badge
            const radius = 12;
            ctx.beginPath();
            ctx.moveTo(badgeX + radius, badgeY);
            ctx.lineTo(badgeX + badgeWidth - radius, badgeY);
            ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + radius);
            ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - radius);
            ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX + badgeWidth - radius, badgeY + badgeHeight);
            ctx.lineTo(badgeX + radius, badgeY + badgeHeight);
            ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - radius);
            ctx.lineTo(badgeX, badgeY + radius);
            ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
            ctx.closePath();
            ctx.fill();

            // Draw text
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);

            resolve(canvas.toDataURL("image/jpeg", 0.95));
        };
        img.onerror = () => {
            console.warn("Could not load image for watermarking, failing back to original", imageUrl);
            resolve(imageUrl); // fallback to original
        };
        img.src = imageUrl;
    });
};
