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
          img.crossOrigin = "anonymous";
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });
      };

      const [beforeImg, afterImg] = await Promise.all([
        loadImg(beforeImageSrc),
        loadImg(afterImageSrc)
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context not supported");

      // Draw poster frame to ensure canvas has content immediately
      ctx.drawImage(beforeImg, 0, 0, width, height);

      // We use WebM. Try to use H264 if we want iOS support?
      let mimeType = 'video/webm; codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm; codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      // On Safari iOS, WebM video via MediaRecorder sometimes works in newer versions, or we fallback to mp4 if supported.
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4'; 
      }

      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps
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
        // Clear
        ctx.clearRect(0, 0, width, height);

        // Calculate progress 0 to 1
        const progress = frame / totalFrames;
        
        // Easing (Smooth step)
        // const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        // Just use sine easing
        const ease = -(Math.cos(Math.PI * progress) - 1) / 2;

        // Draw after image (bottom)
        ctx.drawImage(afterImg, 0, 0, width, height);

        // Draw before image (top, masked by sliding slider)
        // Slider moves from left (0) to right (width), but let's animate 
        // showing before -> after (so before shrinks to left)
        const sliderX = width * (1 - ease); 

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, sliderX, height);
        ctx.clip();
        ctx.drawImage(beforeImg, 0, 0, width, height);
        ctx.restore();

        // Draw slider line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sliderX - 2, 0, 4, height);

        // Draw slider circle
        ctx.beginPath();
        ctx.arc(sliderX, height / 2, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw icon in circle
        ctx.fillStyle = '#000000';
        // Left arrow
        ctx.beginPath();
        ctx.moveTo(sliderX - 4, height / 2);
        ctx.lineTo(sliderX - 1, height / 2 - 4);
        ctx.lineTo(sliderX - 1, height / 2 + 4);
        ctx.fill();
        // Right arrow
        ctx.beginPath();
        ctx.moveTo(sliderX + 4, height / 2);
        ctx.lineTo(sliderX + 1, height / 2 - 4);
        ctx.lineTo(sliderX + 1, height / 2 + 4);
        ctx.fill();

        frame++;

        if (frame <= totalFrames) {
          // Sync with captureStream fps
          setTimeout(renderFrame, 1000 / fps);
        } else {
          // Stop recording
          recorder.stop();
        }
      };

      // Start rendering loop shortly after
      setTimeout(renderFrame, 100);

    } catch (e) {
      reject(e);
    }
  });
};
