import { useCallback } from 'react';

interface UsePhotoHandlersProps {
  consentGiven: boolean;
  setConsentError: (val: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  startCameraLocal: (facingMode: 'user' | 'environment') => void;
  handleFileUploadWrapper: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const usePhotoHandlers = ({
  consentGiven,
  setConsentError,
  fileInputRef,
  cameraInputRef,
  startCameraLocal,
  handleFileUploadWrapper
}: UsePhotoHandlersProps) => {

  const triggerFileInput = useCallback((e?: React.MouseEvent) => {
    if (!consentGiven) {
      if (e) {
        e.stopPropagation();
        setConsentError(true);
        if (navigator.vibrate) navigator.vibrate(200);
      }
      return;
    }
    setConsentError(false);
    fileInputRef.current?.click();
  }, [consentGiven, setConsentError, fileInputRef]);

  const triggerCameraInput = useCallback((e?: React.MouseEvent) => {
    if (!consentGiven) {
      if (e) {
        e.stopPropagation();
        setConsentError(true);
        if (navigator.vibrate) navigator.vibrate(200);
      }
      return;
    }
    setConsentError(false);
    cameraInputRef.current?.click();
  }, [consentGiven, setConsentError, cameraInputRef]);

  const handlePhotoCapture = useCallback((file: File) => {
    const fakeEvent = {
        target: { files: [file], value: '' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileUploadWrapper(fakeEvent);
  }, [handleFileUploadWrapper]);

  const handleTelegramUploadClick = useCallback((
    isCamera: boolean,
    e?: React.MouseEvent,
  ) => {
    if (!consentGiven) {
      if (e) {
        e.stopPropagation();
        setConsentError(true);
        try {
          if (navigator.vibrate) navigator.vibrate(200);
        } catch (err) {}
      }
      return;
    }
    setConsentError(false);

    if (isCamera) {
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        startCameraLocal("user");
      } else {
        console.warn(
          "navigator.mediaDevices is unavailable, using standard file input fallback.",
        );
        triggerCameraInput();
      }
    } else {
      triggerFileInput();
    }
  }, [consentGiven, setConsentError, startCameraLocal, triggerCameraInput, triggerFileInput]);

  return {
    triggerFileInput,
    triggerCameraInput,
    handlePhotoCapture,
    handleTelegramUploadClick
  };
};
