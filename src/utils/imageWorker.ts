export type ProcessImageRequest = {
  dataUrl: string;
  maxDim: number;
  quality: number;
  mimeType: string;
};

export type ProcessImageResponse = {
  base64: string;
  error?: string;
};

self.onmessage = async (e: MessageEvent<ProcessImageRequest>) => {
  const { dataUrl, maxDim, quality, mimeType } = e.data;

  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    let { width, height } = bitmap;
    if (width > height) {
      if (width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      }
    } else {
      if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D context");
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    
    // We export to blob
    const outBlob = await offscreen.convertToBlob({ type: mimeType, quality });
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const b64 = result.split(",")[1];
      self.postMessage({ base64: b64 });
    };
    reader.onerror = () => {
      self.postMessage({ error: "Failed to read blob" });
    };

    reader.readAsDataURL(outBlob);
  } catch (err: any) {
    self.postMessage({ error: err.message || "Failed to process image in worker" });
  }
};
