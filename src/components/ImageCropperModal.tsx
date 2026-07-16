import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

interface ImageCropperModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
  isLightMode: boolean;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  onClose,
  onCropComplete,
  isLightMode,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    // resize to max 1024x1024 if needed
    let finalWidth = canvas.width;
    let finalHeight = canvas.height;
    const max_size = 1024;

    if (finalWidth > finalHeight && finalWidth > max_size) {
      finalHeight = Math.round(finalHeight * (max_size / finalWidth));
      finalWidth = max_size;
    } else if (finalHeight > max_size) {
      finalWidth = Math.round(finalWidth * (max_size / finalHeight));
      finalHeight = max_size;
    }

    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = finalWidth;
    resizedCanvas.height = finalHeight;
    const resizedCtx = resizedCanvas.getContext("2d");
    if (resizedCtx) {
      resizedCtx.drawImage(canvas, 0, 0, finalWidth, finalHeight);
      return new Promise<string>((resolve) => {
        resizedCanvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          } else {
            resolve(imageSrc);
          }
        }, "image/webp", 0.85);
      });
    }

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        } else {
          resolve(imageSrc);
        }
      }, "image/webp", 0.85);
    });
  };

  const handleConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
      // Fallback
      onCropComplete(imageSrc);
    }
  };

  return createPortal(
    <div
      className={`fixed-viewport z-[120] flex flex-col ${isLightMode ? "bg-white" : "bg-[#0f0c1b]"}`}
    >
      <div
        className={`p-4 flex justify-between items-center border-b ${isLightMode ? "border-gray-200" : "border-white/10"}`}
      >
        <h3
          className={`font-serif text-lg ${isLightMode ? "text-gray-900" : "text-white"}`}
        >
          Кадрирование референса
        </h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${isLightMode ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/10 text-white/50"}`}
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1 bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={3 / 4}
          onCropChange={setCrop}
          onCropComplete={onCropChange}
          onZoomChange={setZoom}
          restrictPosition={true}
        />
      </div>

      <div className={`p-6 pb-12 sm:pb-6 ${isLightMode ? "bg-white" : "bg-[#0f0c1b]"}`}>
        <div className="flex items-center gap-4 mb-6">
          <span
            className={`text-sm ${isLightMode ? "text-gray-600" : "text-white/60"}`}
          >
            Масштаб
          </span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Check size={20} />
          Применить
        </button>
      </div>
    </div>,
    document.body,
  );
};
