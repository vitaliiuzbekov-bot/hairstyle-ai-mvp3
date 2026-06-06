import { useRef, useCallback, useState } from "react";
import ImageWorker from "../utils/imageWorker?worker";

export const useImageProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        try {
          const worker = new ImageWorker();
          worker.onmessage = (msg) => {
            setIsProcessing(false);
            if (msg.data.error) {
              setError(msg.data.error);
              reject(new Error(msg.data.error));
            } else {
              resolve(msg.data.base64);
            }
            worker.terminate();
          };
          worker.onerror = (err) => {
            setIsProcessing(false);
            setError("Ошибка веб-воркера");
            reject(err);
            worker.terminate();
          };

          worker.postMessage({
            dataUrl,
            maxDim: 800,
            quality: 0.82,
            mimeType: "image/jpeg"
          });
        } catch (err) {
          // Fallback if worker fails to initialize
          const img = new Image();
          img.onload = () => {
             const MAX_DIM = 800;
             let { width, height } = img;
             if (width > height) {
               if (width > MAX_DIM) {
                 height = Math.round((height * MAX_DIM) / width);
                 width = MAX_DIM;
               }
             } else {
               if (height > MAX_DIM) {
                 width = Math.round((width * MAX_DIM) / height);
                 height = MAX_DIM;
               }
             }

             const canvas = document.createElement("canvas");
             canvas.width = width;
             canvas.height = height;
             const ctx = canvas.getContext("2d");
             let compressedDataUrl = "";
             if (ctx) {
               ctx.drawImage(img, 0, 0, width, height);
               compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
             } else {
               compressedDataUrl = dataUrl;
             }
             
             setIsProcessing(false);
             resolve(compressedDataUrl.split(",")[1]);
          };
          img.onerror = () => {
            setIsProcessing(false);
            reject(new Error("Ошибка обработки изображения"));
          };
          img.src = dataUrl;
        }
      };
      reader.onerror = () => {
        setIsProcessing(false);
        setError("Ошибка чтения файла");
        reject(new Error("Ошибка чтения файла"));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  return { processImage, isProcessing, error };
};
