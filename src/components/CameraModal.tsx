import React from "react";
import { X, RefreshCw } from "lucide-react";
import { useScrollLock } from "../hooks/useScrollLock";

interface CameraModalProps {
  isCameraModalOpen: boolean;
  customVideoRef: React.RefObject<HTMLVideoElement>;
  facingMode: string;
  stopCamera: () => void;
  capturePhoto: () => void;
  startCameraLocal: (mode: string) => void;
}

import { useModalBackButton } from "../hooks/useTelegramBackButton";
export const CameraModal: React.FC<CameraModalProps> = ({
  isCameraModalOpen,
  customVideoRef,
  facingMode,
  stopCamera,
  capturePhoto,
  startCameraLocal,
}) => {
  useScrollLock(isCameraModalOpen);

  if (!isCameraModalOpen) return null;

  return (
    <div className="fixed-viewport z-50 bg-black flex flex-col items-center justify-center">
      <video
        ref={customVideoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
      />

      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex justify-end bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={stopCamera}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="w-12 h-12 sm:w-14 sm:h-14">
          {/* Spacer for centering logic if button removed, or leave flip logic */}
        </div>

        <button
          onClick={capturePhoto}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/40 bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full"></div>
        </button>

        <button
          onClick={() =>
            startCameraLocal(facingMode === "user" ? "environment" : "user")
          }
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-all"
        >
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};
