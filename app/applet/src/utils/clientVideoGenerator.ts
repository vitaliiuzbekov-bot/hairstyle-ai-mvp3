import { getBestSupportedVideoCodec } from './videoCodecDetector';

export interface RenderVideoOptions {
  beforeImageUrl: string;
  afterImageUrl: string;
  durationMs?: number; // По умолчанию 3000ms
  fps?: number; // По умолчанию 30 fps
}

export async function generateBeforeAfterVideo({
  beforeImageUrl,
  afterImageUrl,
  durationMs = 3500,
  fps = 30
}: RenderVideoOptions): Promise<{ videoBlob: Blob; extension: 'mp4' | 'webm'; mimeType: string }> {
  // 1. Предзагрузка изображений
  const [imgBefore, imgAfter] = await Promise.all([
    loadImage(beforeImageUrl),
    loadImage(afterImageUrl)
  ]);

  // 2. Настройка Canvas
  const width = 720;
  const height = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Не удалось получить Canvas2D context');

  // 3. Выбор кодека
  const { mimeType, extension } = getBestSupportedVideoCodec();
  
  // 4. Подготовка Stream и Recorder
  const stream = (canvas as any).captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2_500_000 // 2.5 Mbps для хорошего качества на мобильных
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop();
      reject(new Error('Превышен таймаут генерации видео на клиенте'));
    }, 15000);

    recorder.onstop = () => {
      clearTimeout(timeoutId);
      const finalBlob = new Blob(chunks, { type: mimeType });
      resolve({ videoBlob: finalBlob, extension, mimeType });
    };

    recorder.start();

    // 5. Анимационный цикл (Cross-Fade + Hold)
    const startTime = performance.now();

    function renderFrame(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Рассчитываем opacity для перехода (0..1: Before, 0.3..0.7: Transition, 0.7..1: After)
      let alphaAfter = 0;
      if (progress < 0.3) {
        alphaAfter = 0;
      } else if (progress > 0.7) {
        alphaAfter = 1;
      } else {
        alphaAfter = (progress - 0.3) / 0.4; // Плавная интерполяция
      }

      // Отрисовка Фото ДО
      ctx!.globalAlpha = 1.0;
      drawCoverImage(ctx!, imgBefore, width, height);

      // Отрисовка Фото ПОСЛЕ поверх с прозрачностью
      if (alphaAfter > 0) {
        ctx!.globalAlpha = alphaAfter;
        drawCoverImage(ctx!, imgAfter, width, height);
      }

      if (progress < 1) {
        requestAnimationFrame(renderFrame);
      } else {
        // Небольшая задержка перед остановкой для фиксации последнего кадра
        setTimeout(() => recorder.stop(), 200);
      }
    }

    requestAnimationFrame(renderFrame);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!url.startsWith('data:') && !url.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Не удалось загрузить изображение: ${url.substring(0, 50)}...`));
    img.src = url;
  });
}

function drawCoverImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let renderW = w;
  let renderH = h;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    renderW = h * imgRatio;
    offsetX = (w - renderW) / 2;
  } else {
    renderH = w / imgRatio;
    offsetY = (h - renderH) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}
