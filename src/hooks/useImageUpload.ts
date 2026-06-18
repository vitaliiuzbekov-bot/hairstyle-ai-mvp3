import { useState, useRef } from 'react';
import { useImageProcessor } from './useImageProcessor';
import { AnalysisResult } from '../types';
import { useUI } from '../context/UIContext';

export const useImageUpload = () => {
    const { processImage, isProcessing: isCompressing, error: compressError } = useImageProcessor();
    const { addToast } = useUI();
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string>("");
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rawImageBase64, setRawImageBase64] = useState<string | null>(null);

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

        setMimeType("image/jpeg");
        setIsUploadingImage(true);

        try {
            const b64 = await processImage(file);
            // We set it as raw image base64, so ImageEditorModal can pick it up.
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

    const processFinalImage = async (finalBase64: string) => {
        setIsUploadingImage(true);
        try {
            const { smartCropFace } = await import('../services/fallbackAnalysis');
            const cropResult = await smartCropFace(finalBase64, "image/jpeg");
               
            // If it failed to crop (e.g. because of the grey background after bg removal),
            // it still returns the original image. But we shouldn't show an angry red error
            // to the user since the face was already verified in ImageEditorModal.
            if (cropResult.warning) {
                console.warn("Smart crop warning:", cropResult.warning);
            }
               
            if (cropResult.base64) {
                setImageBase64(cropResult.base64);
                if (!cropResult.warning) {
                    addToast("Фото идеально кадрировано ИИ ✨", "success");
                }
            } else {
                setImageBase64(finalBase64);
            }
        } catch(cropErr) {
            console.warn("Crop failed, using original", cropErr);
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
        rawImageBase64,
        setRawImageBase64,
        processFinalImage
    };
};
