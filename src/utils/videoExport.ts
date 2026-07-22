export const generateBeforeAfterVideo = async (
  beforeImageSrc: string,
  afterImageSrc: string,
  width: number = 720,
  height: number = 960,
  durationMs: number = 3000,
  fps: number = 30
): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const loadImg = (src: string) => {
        return new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          if (!src.startsWith('data:') && !src.startsWith('blob:')) {
            img.crossOrigin = "anonymous";
          }
          img.onload = () => res(img);
          img.onerror = () => rej(new Error("Не удалось загрузить изображение: " + src.substring(0, 50)));
          img.src = src;
        });
      };

      const [beforeImg, afterImg] = await Promise.all([
        loadImg(beforeImageSrc),
        loadImg(afterImageSrc)
      ]);

      const canvas = document.createElement('canvas');
      if (typeof canvas.captureStream !== 'function') {
        throw new Error("Ваше устройство не поддерживает сохранение видео. Попробуйте на компьютере или используйте 'Коллаж'.");
      }
      
      // Use the generated AFTER image as the source of truth for the canvas dimensions
      // This prevents squishing of the AI result.
      const targetWidth = Math.floor(afterImg.width / 2) * 2;
      const targetHeight = Math.floor(afterImg.height / 2) * 2;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context not supported");

      // Helper for object-cover drawing
      const drawImageCover = (img: HTMLImageElement) => {
        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;
        let renderW, renderH, renderX, renderY;
        
        if (imgRatio > targetRatio) {
            renderH = targetHeight;
            renderW = img.width * (targetHeight / img.height);
            renderX = (targetWidth - renderW) / 2;
            renderY = 0;
        } else {
            renderW = targetWidth;
            renderH = img.height * (targetWidth / img.width);
            renderX = 0;
            renderY = (targetHeight - renderH) / 2;
        }
        ctx.drawImage(img, renderX, renderY, renderW, renderH);
      };

      // Draw poster frame to ensure canvas has content immediately
      drawImageCover(beforeImg);

      let mimeType = 'video/webm; codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm; codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4'; 
      }

      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
        resolve(blob);
      };
      recorder.start();

      const totalFrames = (durationMs / 1000) * fps;
      let frame = 0;
      
      const renderFrame = () => {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        
        const animationDurationMs = 1500;
        const animationFrames = (animationDurationMs / 1000) * fps;
        const progress = Math.min(frame / animationFrames, 1);
        
        const ease = -(Math.cos(Math.PI * progress) - 1) / 2;

        // Draw after image (bottom) using cover
        drawImageCover(afterImg);

        // Draw before image (top, masked) using cover
        const sliderX = targetWidth * (1 - ease); 
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, sliderX, targetHeight);
        ctx.clip();
        drawImageCover(beforeImg);
        ctx.restore();

        // Draw slider line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sliderX - 2, 0, 4, targetHeight);
        
        // Draw slider circle
        ctx.beginPath();
        ctx.arc(sliderX, targetHeight / 2, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw icon in circle
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(sliderX - 4, targetHeight / 2);
        ctx.lineTo(sliderX - 1, targetHeight / 2 - 4);
        ctx.lineTo(sliderX - 1, targetHeight / 2 + 4);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sliderX + 4, targetHeight / 2);
        ctx.lineTo(sliderX + 1, targetHeight / 2 - 4);
        ctx.lineTo(sliderX + 1, targetHeight / 2 + 4);
        ctx.fill();

        frame++;
        if (frame <= totalFrames) {
          setTimeout(renderFrame, 1000 / fps);
        } else {
          recorder.stop();
        }
      };

      setTimeout(renderFrame, 100);
    } catch (e) {
      reject(e);
    }
  });
};

export const resolveUrlToDataUri = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    if (url.startsWith('blob:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read blob URL"));
            reader.readAsDataURL(blob);
        });
    }
    return url;
};
