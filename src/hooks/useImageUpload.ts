import { useState, useRef } from 'react';
import { useImageProcessor } from './useImageProcessor';
import { AnalysisResult } from '../types';
import { useUI } from '../context/UIContext';
import { storage } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export const useImageUpload = () => {
    const { processImage, isProcessing: isCompressing, error: compressError } = useImageProcessor();
    const { addToast } = useUI();
    const [imageBase64, setImageBase64State] = useState<string | null>(() => {
        try {
            return localStorage.getItem("persistent_imageBase64") || null;
        } catch {
            return null;
        }
    });
    
    const setImageBase64 = (val: React.SetStateAction<string | null>) => {
        setImageBase64State((prev) => {
            const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
            try {
                if (nextVal) localStorage.setItem("persistent_imageBase64", nextVal);
                else localStorage.removeItem("persistent_imageBase64");
            } catch (e) {
                console.error("Failed to save image to localStorage", e);
            }
            return nextVal;
        });
    };

    const [imageUrl, setImageUrlState] = useState<string | null>(() => {
        try {
            return localStorage.getItem("persistent_imageUrl") || null;
        } catch {
            return null;
        }
    });

    const setImageUrl = (val: React.SetStateAction<string | null>) => {
        setImageUrlState((prev) => {
            const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
            try {
                if (nextVal) localStorage.setItem("persistent_imageUrl", nextVal);
                else localStorage.removeItem("persistent_imageUrl");
            } catch {}
            return nextVal;
        });
    };

    const [mimeType, setMimeTypeState] = useState<string>(() => {
        try {
            return localStorage.getItem("persistent_mimeType") || "image/jpeg";
        } catch {
            return "image/jpeg";
        }
    });

    const setMimeType = (val: React.SetStateAction<string>) => {
        setMimeTypeState((prev) => {
            const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
            try {
                if (nextVal) localStorage.setItem("persistent_mimeType", nextVal);
                else localStorage.removeItem("persistent_mimeType");
            } catch {}
            return nextVal;
        });
    };

    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rawImageBase64State, setRawImageBase64State] = useState<string | null>(() => {
        try {
            return localStorage.getItem("persistent_rawImageBase64") || null;
        } catch {
            return null;
        }
    });

    const setRawImageBase64 = (val: React.SetStateAction<string | null>) => {
        setRawImageBase64State((prev) => {
            const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
            try {
                if (nextVal) localStorage.setItem("persistent_rawImageBase64", nextVal);
                else localStorage.removeItem("persistent_rawImageBase64");
            } catch (e) {
                console.error("Failed to save raw image to localStorage", e);
            }
            return nextVal;
        });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        resetAnalysisState: () => void
    ) => {
        const file = e.target.files?.[0];
        const targetInput = e.target;

        if (!file) {
            if (targetInput) targetInput.value = '';
            return;
        }

        setError(null);
        resetAnalysisState();
        setImageUrl(null);
        setRawImageBase64(null);

        if (!file.type.startsWith("image/")) {
            addToast("Пожалуйста, загрузите изображение (JPEG, PNG).", "error");
            setError("Пожалуйста, загрузите изображение (JPEG, PNG).");
            return;
        }
        
        // 25 MB limit
        if (file.size > 25 * 1024 * 1024) {
             addToast("Размер изображения не должен превышать 25 МБ.", "error");
             setError("Слишком большой файл. Лимит: 25 МБ.");
             return;
        }

        // Fast path UI update with local Blob URL
        const localPreviewUrl = URL.createObjectURL(file);
        setImageUrl(localPreviewUrl);

        setMimeType("image/jpeg");
        setIsUploadingImage(true);

        try {
            const b64 = await processImage(file);
            setRawImageBase64(b64);
        } catch (err: any) {
            const msg = compressError || err.message || "Ошибка обработки";
            addToast(msg, "error");
            setError(msg);
        } finally {
            setIsUploadingImage(false);
            if (targetInput) targetInput.value = '';
        }
    };

    const uploadToFirebase = async (base64Str: string) => {
        try {
            const tg = (window as any).Telegram?.WebApp as any;
            const uid = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : "anonymous";
            const filename = `upload_${Date.now()}_${Math.floor(Math.random()*1000)}.jpg`;
            const storageRef = ref(storage, `uploads/${uid}/${filename}`);
            
            const uploadPromise = async () => {
                await uploadString(storageRef, base64Str, 'base64', { contentType: 'image/jpeg' });
                return await getDownloadURL(storageRef);
            };

            // 15 seconds timeout for Firebase upload
            return await Promise.race([
                uploadPromise(),
                new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000))
            ]);
        } catch (e) {
            console.warn("Failed to upload to Firebase or timed out:", e);
            return null; // Fallback to base64 if Firebase fails
        }
    };

    const processFinalImage = async (finalBase64: string) => {
        setIsUploadingImage(true);
        // Persist final base64 immediately so we don't lose it if killed
        setImageBase64(finalBase64);
        try {
            // Import and crop with timeout
            const cropResult = await Promise.race([
                (async () => {
                    const { smartCropFace } = await import('../services/fallbackAnalysis');
                    return await smartCropFace(finalBase64, "image/jpeg");
                })(),
                new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Timeout importing or cropping face")), 12000))
            ]);
               
            if (cropResult && cropResult.warning) {
                console.warn("Smart crop warning:", cropResult.warning);
            }
               
            let targetBase64 = (cropResult && cropResult.base64) ? cropResult.base64 : finalBase64;
            
            setImageBase64(targetBase64);
            
            const uploadedUrl = await uploadToFirebase(targetBase64);
            
            if (uploadedUrl) {
                setImageUrl(uploadedUrl);
                // Keep imageBase64 for local inference, we will omit it from FormData in useAnalysis if imageUrl is present
                // setImageBase64(null); 
            } else {
                // If firebase fails, generate local object URL from cropped base64 to avoid passing mega strings
                try {
                    const byteString = atob(targetBase64.split(',')[1] || targetBase64);
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                    const blob = new Blob([ab], {type: 'image/jpeg'});
                    setImageUrl(URL.createObjectURL(blob));
                    setImageBase64(targetBase64); // We MUST keep base64 to send to backend since blob URL cannot be sent
                } catch(e) {
                    setImageBase64(targetBase64);
                }
            }

            if (cropResult && cropResult.base64 && !cropResult.warning) {
                addToast("Фото подготовлено и готово к загрузке ИИ ✨", "success");
            }
        } catch(cropErr) {
            console.warn("Crop failed or Upload failed, using original", cropErr);
            setImageBase64(finalBase64);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const resetImageState = () => {
        setImageBase64(null);
        setRawImageBase64(null);
        setImageUrl(null);
        setError(null);
        setMimeType("");
    };

    return {
        imageBase64,
        setImageBase64,
        imageUrl,
        setImageUrl,
        mimeType,
        isUploadingImage,
        error,
        setError,
        fileInputRef,
        cameraInputRef,
        handleFileUpload,
        resetImageState,
        isCompressing,
        rawImageBase64: rawImageBase64State,
        setRawImageBase64,
        processFinalImage
    };
};
