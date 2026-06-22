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

        const doFallback = () => {
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
             if (ctx) {
               ctx.drawImage(img, 0, 0, width, height);
               canvas.toBlob((blob) => {
                 if (blob) {
                   const readerBlob = new FileReader();
                   readerBlob.onloadend = () => {
                     const compressedDataUrl = readerBlob.result as string;
                     setIsProcessing(false);
                     resolve(compressedDataUrl.split(",")[1]);
                   };
                   readerBlob.readAsDataURL(blob);
                 } else {
                   setIsProcessing(false);
                   resolve(dataUrl.split(",")[1]); // fallback
                 }
               }, "image/jpeg", 0.75);
             } else {
               setIsProcessing(false);
               resolve(dataUrl.split(",")[1]);
             }
          };
          img.onerror = () => {
            setIsProcessing(false);
            const errStr = "Ошибка обработки изображения";
            setError(errStr);
            reject(new Error(errStr));
          };
          img.src = dataUrl;
        };
        
        try {
          const worker = new ImageWorker();
          worker.onmessage = (msg) => {
            if (msg.data.error) {
              console.warn("Worker error, running fallback. Reason:", msg.data.error);
              doFallback();
            } else {
              setIsProcessing(false);
              resolve(msg.data.base64);
            }
            worker.terminate();
          };
          worker.onerror = (err) => {
            console.warn("Worker onerror, running fallback. Error:", err);
            worker.terminate();
            doFallback();
          };

          worker.postMessage({
            dataUrl,
            maxDim: 800,
            quality: 0.75,
            mimeType: "image/jpeg"
          });
        } catch (err) {
          // Fallback if worker fails to initialize
          console.warn("Worker Init failed, running fallback. Error:", err);
          doFallback();
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
