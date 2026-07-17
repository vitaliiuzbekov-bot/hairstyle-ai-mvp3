import { useState, useCallback } from 'react';
import { AnalysisResult } from '../types';
import { analyzeImageApi, generateArApi, generateFullApi, loadMoreApi } from '../services/api';
// import { fallbackFaceApi } from '../services/fallbackAnalysis';
import { addHistoryItem } from '../services/localHistory';
import { hapticNotification } from '../utils/haptics';

interface UseAnalysisProps {
    imageBase64: string | null;
    imageUrl: string | null;
    mimeType: string;
    preferredStyle: string;
    telegramInitData?: string;
    userId: string | null;
    initError?: string | null;
    generationsLeft: number | null;
    isDeveloper: boolean;
    checkLimits: () => Promise<boolean>;
    consumeToken: () => Promise<boolean>;
    setShowBuyModal: (show: boolean) => void;
    setHistory: React.Dispatch<React.SetStateAction<any[]>>;
    setError: (error: string | null) => void;
    addToast: (msg: string, type: "success" | "error" | "info") => void;
}


export const useAnalysis = ({
    imageBase64,
    imageUrl,
    mimeType,
    preferredStyle,
    telegramInitData,
    userId,
    initError,
    generationsLeft,
    isDeveloper,
    checkLimits,
    consumeToken,
    setShowBuyModal,
    setHistory,
    setError,
    addToast
}: UseAnalysisProps) => {
    
    // States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResultsState] = useState<AnalysisResult | null>(() => {
        try {
            const cached = localStorage.getItem("persistent_analysisResults_v2");
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });
    
    const setResults = (val: React.SetStateAction<AnalysisResult | null>) => {
        setResultsState((prev) => {
            const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
            try {
                if (nextVal) localStorage.setItem("persistent_analysisResults_v2", JSON.stringify(nextVal));
                else localStorage.removeItem("persistent_analysisResults_v2");
            } catch (e) {
                console.error("Failed to save results to localStorage", e);
            }
            return nextVal;
        });
    };
    
    const [loadingARStyles, setLoadingARStyles] = useState<Record<string, boolean>>({});
    const [arGeneratedImageUrl, setArGeneratedImageUrl] = useState<Record<string, string>>({});
    const [teaserUrlState, setTeaserUrlState] = useState<string | null>(() => {
        try {
            return localStorage.getItem("persistent_teaserUrl") || null;
        } catch {
            return null;
        }
    });

    const setTeaserUrl = (val: React.SetStateAction<string | null>) => {
        setTeaserUrlState((prev) => {
            const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
            try {
                if (nextVal) localStorage.setItem("persistent_teaserUrl", nextVal);
                else localStorage.removeItem("persistent_teaserUrl");
            } catch {}
            return nextVal;
        });
    };
    const [teaserRecName, setTeaserRecName] = useState<string | null>(null);
    const [isGeneratingTeaser, setIsGeneratingTeaser] = useState(false);
    const [styleConsultations, setStyleConsultations] = useState<Record<string, string>>({});
    const [arError, setArError] = useState<string | null>(null);
    const [loadingVTONStyles, setLoadingVTONStyles] = useState<Record<string, boolean>>({});
    const [vtonResultUrl, setVtonResultUrl] = useState<string | null>(null);
    const [isTeaserResult, setIsTeaserResult] = useState<boolean>(false);
    const [vtonError, setVtonError] = useState<string | null>(null);
    const [customHairColor, setCustomHairColor] = useState<string | null>(null);
    const [vtonStrength, setVtonStrength] = useState<number>(45);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        const handler = ((e: CustomEvent) => {
            const { imageUrl, originalUrl } = e.detail || {};
            if (imageUrl) {
                setVtonResultUrl(imageUrl);
                // History update could be done here if needed
            }
        }) as EventListener;
        window.addEventListener('showGenerationResult', handler);
        return () => window.removeEventListener('showGenerationResult', handler);
    }, []);

    const fallbackFaceApiWrapper = async (targetBase64: string | null, targetMimeType: string | null) => {
        const { fallbackFaceApi } = await import('../services/fallbackAnalysis');
        return fallbackFaceApi(targetBase64, targetMimeType || "image/jpeg", preferredStyle);
    };

    const generateTeaser = async (rec: any, resultData: AnalysisResult) => {
        setIsGeneratingTeaser(true);
        setTeaserRecName(rec.name);
        try {
            const res = await fetch("/api/reference", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...((window as any).Telegram?.WebApp?.initData ? { "x-telegram-init-data": (window as any).Telegram.WebApp.initData } : {}) },
                body: JSON.stringify({
                    keyword: rec.imageKeyword,
                    isLibrary: true,
                    haircutName: rec.name,
                    gender: resultData.gender,
                    faceShape: resultData.faceShape,
                    hairColor: resultData.hairColor,
                    hairLength: resultData.hairLength,
                    hairDensity: resultData.hairDensity,
                    hairType: resultData.hairType,
                    skinTone: resultData.skinTone,
                    skinDetails: resultData.skinDetails,
                    eyeColor: resultData.eyeColor,
                    ageRange: resultData.ageRange,
                    facialFeatures: resultData.facialFeatures,
                    facialHair: resultData.facialHair,
                    hairlineStatus: resultData.hairlineStatus
                })
            });
            const text = await res.text();
            let data: any = {};
            try { data = JSON.parse(text); } catch(e){}
            if (data.imageUrl) {
                setTeaserUrl(data.imageUrl);
            }
        } catch(e) {
            console.error("Teaser generation failed", e);
        } finally {
            setIsGeneratingTeaser(false);
        }
    };

    const analyzeImage = async () => {
        if (!imageBase64 && !imageUrl) return;

        if (initError) {
          setError(
            `Сначала необходимо устранить ошибку инициализации: ${initError}`,
          );
          return;
        }

        setIsAnalyzing(true);
        setError(null);

        // Simple client-side cache check (updated cache key to v2 to invalidate old buggy localStats cache)
        const cacheKey = imageBase64 ? `analysis_v2_${imageBase64.length}_${imageBase64.slice(-100)}_${preferredStyle}` : null;
        if (cacheKey) {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsedCache = JSON.parse(cached);
                    setResults(parsedCache);
                    setIsAnalyzing(false);
                    hapticNotification('success');
                    return;
                } catch (e) {
                    console.log("Failed to parse cache", e);
                }
            }
        }

        try {
          // --- ШАГ 1: ЛОКАЛЬНЫЙ АНАЛИЗ (CLIENT-SIDE INFERENCE) ---
          // Выполняем тяжелый процесс определения лица, пола и возраста на устройстве клиента
          let localStats: AnalysisResult | null = null;
          try {
              localStats = await fallbackFaceApiWrapper(imageBase64, mimeType);
          } catch(e) {
              console.warn("FaceAPI failed, falling back to pure server...", e);
          }
          
          const formData = new FormData();
          // ONLY upload image blob to server IF we don't have a Firebase URL
          // If imageUrl starts with blob:, we must send the blob payload
          const hasRemoteImageUrl = imageUrl && !imageUrl.startsWith('blob:');
          if (imageBase64 && !hasRemoteImageUrl) {
            const byteString = atob(imageBase64);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
            const blob = new Blob([ab], { type: mimeType || "image/jpeg" });
            formData.append("image", blob, "upload.jpg");
          }
          if (hasRemoteImageUrl) formData.append("imageUrl", imageUrl);
          if (mimeType) formData.append("mimeType", mimeType);
          if (userId) formData.append("userId", userId);
          if (preferredStyle) formData.append("preferredStyle", encodeURIComponent(preferredStyle));
          
          if (localStats) {
              formData.append("skipVision", "false");
              formData.append("faceApiGender", localStats.gender);
              formData.append("faceApiShape", localStats.faceShape);
              formData.append("faceApiAge", localStats.ageRange);
              if (localStats.skinTone) formData.append("localSkinTone", localStats.skinTone);
              if (localStats.hairColor) formData.append("localHairColor", localStats.hairColor);
          }

          let parsedResults: AnalysisResult;
          // We always rely on the powerful server-side AI (Gemini/YandexGPT) for accurate analysis.
          // Local stats (face-api) are too inaccurate for gender/age and were causing major issues.
          parsedResults = await analyzeImageApi(formData, telegramInitData) as AnalysisResult;

          // Only inject initial library styles if this is a fresh analysis.
          // Otherwise, we keep the previously generated or assigned styles.
          if (!localStats) {
            try {
              const { FEMALE_LIBRARY, MALE_LIBRARY } = await import('../data/haircutLibrary');
              const lib = parsedResults.gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
              const allStyles = Object.values(lib).flat();
              
              let filteredStyles = allStyles;
              if (preferredStyle === "Спортивный") {
                  filteredStyles = allStyles.filter(s => s.category === 'short' || s.category === 'creative');
              } else if (preferredStyle === "Деловой") {
                  filteredStyles = allStyles.filter(s => s.category === 'short' || s.category === 'medium');
              } else if (preferredStyle === "Романтичный") {
                  filteredStyles = allStyles.filter(s => s.category === 'medium' || s.category === 'long');
              }

              if (filteredStyles.length < 3) filteredStyles = allStyles;

              const shuffled = filteredStyles.sort(() => 0.5 - Math.random());
              const picked = shuffled.slice(0, 3).map(s => ({
                name: s.name,
                description: s.description,
                stylingTips: s.stylingTips,
                imageKeyword: s.name
              }));
              parsedResults.recommendations = picked;
            } catch(e) {
              console.warn("Failed to inject library styles", e);
            }
          }

          setResults(parsedResults);
          hapticNotification('success');
          
          if (cacheKey) {
              sessionStorage.setItem(cacheKey, JSON.stringify(parsedResults));
          }
          
          // Auto-generate teaser if applicable
          if (parsedResults && parsedResults.recommendations && parsedResults.recommendations.length > 0) {
            if ((generationsLeft === null || generationsLeft <= 0) && !teaserUrlState) {
              generateTeaser(parsedResults.recommendations[0], parsedResults);
            }
          }
        } catch (err: any) {
          console.error("AI Analysis Error:", err);
          hapticNotification('error');
          
          const errMsg = err?.message || "";
          if (errMsg.includes("Нейросеть сейчас испытывает") || errMsg.includes("Сервер перегружен")) {
             setError(`⚠️ Сервисы перегружены

Сервер временно недоступен или перезапускается. Пожалуйста, подождите 30 секунд и попробуйте загрузить фото снова.`);
          } else {
             setError(
               `⚠️ Не удалось проанализировать фото\n\nНейросеть не смогла точно определить форму твоего лица. Скорее всего, проблема в освещении или ракурсе.\n\nПожалуйста, попробуй ещё раз:\n• Сделай фото при дневном свете, лицом к окну\n• Смотри прямо в камеру, не наклоняй голову\n• Убери волосы от лица и сними очки\n\n📌 Твоя генерация не была списана — ты можешь загрузить новое фото бесплатно.\n\n(Детали: ${errMsg.slice(0, 100)})`
             );
          }
        } finally {
          setIsAnalyzing(false);
        }
    };

    const generateARPreview = async (styleKeyword: string, styleName: string) => {
        if (!imageBase64 && !imageUrl) return;

        setLoadingARStyles((prev) => ({ ...prev, [styleKeyword]: true }));
        setArError(null);

        try {
          const data = await generateArApi(styleKeyword, styleName, results, telegramInitData);

          if (data.consultationHtml) {
            setStyleConsultations((prev) => ({
              ...prev,
              [styleKeyword]: data.consultationHtml,
            }));
          }

          if (data.warning) {
            setArError(data.warning);
          }

          if (!data.consultationHtml) {
            throw new Error("Не удалось загрузить данные из ответа сервера.");
          }
          hapticNotification('success');
        } catch (err: any) {
          console.error("AR Generation Error:", err);
          hapticNotification('error');
          // We still map what we can locally if network fails entirely
          setStyleConsultations((prev) => ({
            ...prev,
            [styleKeyword]: `<div class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-2 text-sm text-red-200">Сбой генерации гайда. Используйте визуальный референс для мастера.</div>`,
          }));
          const msg = err?.message || "Ошибка генерации примерки. Попробуйте снова чуть позже.";
          addToast(msg, "error");
        } finally {
          setLoadingARStyles((prev) => ({ ...prev, [styleKeyword]: false }));
        }
    };

    const generateVirtualTryOn = async (
        styleKeyword: string,
        styleName: string,
        styleDescription: string,
        selectedColor: string | null = null,
        targetImageUrl: string | null = null,
    ) => {
        if (!imageBase64) return;

        if (!isDeveloper && generationsLeft !== null && generationsLeft <= 0) {
           setShowBuyModal(true);
           return;
        }

        const proceed = await checkLimits();
        if (!proceed) return;

        setIsTeaserResult(false);
        setLoadingVTONStyles((prev) => ({ ...prev, [styleKeyword]: true }));
        setVtonError(null);
        setVtonResultUrl(null);

        // Create AbortController to cancel long-running requests if needed
        const controller = new AbortController();
        const signal = controller.signal;
        (window as any).currentVtonController = controller;

        try {
          const formData = new FormData();
          formData.append("userId", userId || "local-user");
          const tg = (window as any).Telegram?.WebApp as any;
          if (tg?.initDataUnsafe?.user?.id) {
            formData.append("tgUserId", String(tg.initDataUnsafe.user.id));
          }
          const hasRemoteImageUrl = imageUrl && !imageUrl.startsWith('blob:');
          if (hasRemoteImageUrl) {
            formData.append("selfieImage", imageUrl);
          }
          if (imageBase64 && !hasRemoteImageUrl) {
            const byteString = atob(imageBase64);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
            formData.append("image", new Blob([ab], { type: mimeType || "image/jpeg" }), "upload.jpg");
          }
          formData.append("keyword", encodeURIComponent(styleKeyword));
          formData.append("description", encodeURIComponent(styleDescription));
          if (selectedColor) formData.append("customHairColor", encodeURIComponent(selectedColor));
          formData.append("vtonStrength", String(vtonStrength));
          if (results?.gender) formData.append("gender", results.gender);
          if (results?.faceShape) formData.append("faceShape", results.faceShape);
          if (results?.hairLength) formData.append("hairLength", results.hairLength);
          if (results?.hairDensity) formData.append("hairDensity", results.hairDensity);
          if (results?.hairType) formData.append("hairType", results.hairType);
          if (results?.skinTone) formData.append("skinTone", results.skinTone);
          if (results?.skinDetails) formData.append("skinDetails", results.skinDetails);
          if (results?.hairColor) formData.append("hairColor", results.hairColor);
          if (results?.eyeColor) formData.append("eyeColor", results.eyeColor);
          if (results?.ageRange) formData.append("ageRange", results.ageRange);
          if (results?.facialFeatures) formData.append("facialFeatures", results.facialFeatures);
          if (results?.facialHair) formData.append("facialHair", results.facialHair);
          if (results?.clothingContext) formData.append("clothingContext", results.clothingContext);
          if (targetImageUrl) formData.append("targetImageUrl", targetImageUrl);
          if (results?.hairlineStatus) formData.append("hairlineStatus", results.hairlineStatus);
          if (results?.hairQuality) formData.append("hairQuality", results.hairQuality);

          // Add idempotency key to prevent double charging on retry / concurrent clicks
          const idempotencyKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          formData.append("idempotencyKey", idempotencyKey);

          console.log('[useAnalysis] Начало генерации');
          console.log('[useAnalysis] Starting generateFullApi (which polls internally)');
          const data = await generateFullApi(formData, telegramInitData, signal);
          console.log('[useAnalysis] Результат получен:', data);
          
          if (data.referenceImage) {
            setArGeneratedImageUrl((prev) => ({
              ...prev,
              [styleKeyword]: data.referenceImage,
            }));
          }

          if (data.isAsync) {
             consumeToken();
             addToast("Фото обрабатывается. Мы пришлем результат в Telegram!", "info");
             hapticNotification('success');
             return;
          }
          
          if (data.originalUrl && data.imageUrl) {
            localStorage.setItem('lastResult', JSON.stringify({ 
              imageUrl: data.imageUrl, 
              originalUrl: data.originalUrl 
            }));
            localStorage.setItem('lastGeneratedImage', data.imageUrl);
            localStorage.setItem('lastOriginalImage', imageBase64);
          }

          if (data.imageUrl) {
            let watermarkedUrl = data.imageUrl;
            try {
              // Dynamically import to avoid top level import issues if needed, or import at top
              const { applyWatermark } = await import('../utils/watermark');
              watermarkedUrl = await applyWatermark(data.imageUrl, "t.me/neirostilist_bot");
            } catch (e) {
              console.error("Failed to apply watermark", e);
            }

            setVtonResultUrl(watermarkedUrl);
            consumeToken(); // Optimistic deduction on successful UI render
            addToast("Примерка завершена! Посмотрите результат в Истории.", "success");
            hapticNotification('success');
            
            const newItem = {
              url: watermarkedUrl,
              originalUrl: data.imageUrl,
              keyword: styleKeyword || "Стиль",
              timestamp: Date.now(),
            };
            
            // local IndexedDB async save
            addHistoryItem(newItem).then((newHistory) => {
              setHistory(newHistory.slice(0, 50));
            }).catch(e => console.warn("local history add failed", e));
          } else {
            throw new Error("Не удалось загрузить данные из ответа сервера.");
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            console.log("VTON request was aborted by user");
            return;
          }
          console.error("VTON Error:", err);
          hapticNotification('error');
          const msg = err?.message || "Ошибка виртуальной примерки. Попробуйте снова чуть позже.";
          addToast(msg, "error");
        } finally {
          if ((window as any).currentVtonController === controller) {
            delete (window as any).currentVtonController;
          }
          setLoadingVTONStyles((prev) => ({ ...prev, [styleKeyword]: false }));
        }
    };

    const loadMoreRecommendations = useCallback(async (mode: 'library' | 'ai' = 'ai') => {
        if ((!imageBase64 && !imageUrl) || !results) return;

        if (mode === 'ai') {
          if (!isDeveloper && generationsLeft !== null && generationsLeft <= 0) {
            setShowBuyModal(true);
            return;
          }
          const proceed = await checkLimits();
          if (!proceed) return;
          // Optimistically reduce local count so they can't spam it
          await consumeToken();
        }

        setIsLoadingMore(true);
        setError(null);

        const existingNames = results.recommendations.map((r) => r.name);

        try {
          if (mode === 'library') {
             // pull from static library
             const { FEMALE_LIBRARY, MALE_LIBRARY } = await import('../data/haircutLibrary');
             const lib = results.gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
             // flatten
             const allStyles = Object.values(lib).flat();
             const available = allStyles.filter(s => !existingNames.includes(s.name));
             if (available.length === 0) {
               throw new Error("В библиотеке больше нет новых стилей для вашего типа.");
             }
             // pick 3 random
             const shuffled = available.sort(() => 0.5 - Math.random());
             const picked = shuffled.slice(0, 3).map(s => ({
                name: s.name,
                description: s.description,
                stylingTips: s.stylingTips,
                imageKeyword: (s as any).imageKeyword || s.name
             }));
             setResults((prev) =>
               prev
                 ? {
                     ...prev,
                     recommendations: [
                       ...prev.recommendations,
                       ...picked,
                     ],
                   }
                 : prev,
             );
          } else {
            const data = await loadMoreApi(userId, existingNames, results, preferredStyle, telegramInitData);

            if (data.recommendations) {
              setResults((prev) =>
                prev
                  ? {
                      ...prev,
                      recommendations: [
                        ...prev.recommendations,
                        ...data.recommendations,
                      ],
                    }
                  : prev,
              );
            } else {
              throw new Error("Модель не вернула результат.");
            }
          }
        } catch (err: any) {
          console.error("AI Load More Error:", err);
          setError(err?.message || "Ошибка при генерации новых вариантов.");
        } finally {
          setIsLoadingMore(false);
        }
    }, [imageBase64, imageUrl, results, userId, preferredStyle, telegramInitData, setError, checkLimits, consumeToken, setShowBuyModal, generationsLeft, isDeveloper]);
    
    return {
        isAnalyzing,
        results,
        setResults,
        loadingARStyles,
        arGeneratedImageUrl,
        setArGeneratedImageUrl,
        teaserUrl: teaserUrlState,
        teaserRecName,
        isGeneratingTeaser,
        styleConsultations,
        arError,
        setArError,
        loadingVTONStyles,
        vtonResultUrl,
        setVtonResultUrl,
        isTeaserResult,
        vtonError,
        setVtonError,
        customHairColor,
        setCustomHairColor,
        vtonStrength,
        setVtonStrength,
        isLoadingMore,
        analyzeImage,
        generateARPreview,
        generateVirtualTryOn,
        loadMoreRecommendations
    };
}
