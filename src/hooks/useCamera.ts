import { useState, useRef, useCallback, useEffect } from "react";

interface UseCameraResult {
  isCameraModalOpen: boolean;
  cameraStream: MediaStream | null;
  facingMode: "user" | "environment";
  customVideoRef: React.RefObject<HTMLVideoElement>;
  startCameraLocal: (mode?: "user" | "environment") => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => void;
}

export const useCamera = (onPhotoCapture: (file: File) => void): UseCameraResult => {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const customVideoRef = useRef<HTMLVideoElement>(null);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  }, [cameraStream]);

  const startCameraLocal = useCallback(
    async (mode: "user" | "environment" = facingMode) => {
      try {
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
        }
        setIsCameraModalOpen(true);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
        });
        setCameraStream(stream);
        if (customVideoRef.current) {
          customVideoRef.current.srcObject = stream;
        }
        setCameraFacingMode(mode);
      } catch (err: any) {
        console.error("Camera error:", err);
        setIsCameraModalOpen(false);
        alert(
          `Ошибка камеры: ${err.message || "устройство не найдено"}. Пожалуйста, используйте загрузку из галереи.`
        );
      }
    },
    [cameraStream, facingMode]
  );

  const capturePhoto = useCallback(() => {
    if (customVideoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = customVideoRef.current.videoWidth;
      canvas.height = customVideoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(
          customVideoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera_photo.jpg", {
                type: "image/jpeg",
              });
              onPhotoCapture(file);
              stopCamera();
            }
          },
          "image/jpeg",
          0.9
        );
      }
    }
  }, [facingMode, onPhotoCapture, stopCamera]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  return {
    isCameraModalOpen,
    cameraStream,
    facingMode,
    customVideoRef,
    startCameraLocal,
    stopCamera,
    capturePhoto,
  };
};
