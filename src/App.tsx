import { useImageProcessor } from "./hooks/useImageProcessor";
import React, { useState, useRef, useEffect, memo } from "react";
import {
  Camera,
  Upload,
  Scissors,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  ChevronRight,
  X,
  Maximize2,
  Zap,
  Coins,
  Download,
  Send,
  FileDown,
  Moon,
  Sun,
  HelpCircle,
  Star,
  BookOpen,
  ShoppingBag,
  User,
  Store,
  Gift,
  Share2,
} from "lucide-react";
import { CachedImage } from "./components/CachedImage";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { StylistChat } from "./components/StylistChat";
import { generateCollage } from "./utils/collage";
import { auth, db, remoteConfig } from "./firebase";
import { signInAnonymously } from "firebase/auth";
import { fetchAndActivate, getString } from "firebase/remote-config";

const COLOR_BRANDS: Record<string, {name: string, shade: string}[]> = {
  "Блонд": [{name: "L'Oreal Professionnel", shade: "Majirel 10.1"}, {name: "Wella Koleston", shade: "10/16"}],
  "Русый": [{name: "Matrix Socolor", shade: "7A"}, {name: "Redken Shades EQ", shade: "07N"}],
  "Каштановый": [{name: "L'Oreal Professionnel", shade: "Majirel 5.0"}, {name: "Wella Koleston", shade: "5/0"}],
  "Черный": [{name: "Wella Koleston", shade: "2/0"}, {name: "Matrix Socolor", shade: "1A"}],
  "Рыжий": [{name: "Matrix Socolor", shade: "7C"}, {name: "L'Oreal Professionnel", shade: "Majirel 7.4"}],
  "Седой": [{name: "L'Oreal Professionnel", shade: "Silver"}, {name: "Redken Shades EQ", shade: "09T"}]
};
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./firebase";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand?: () => void;
        initData?: string;
        initDataUnsafe?: any;
        openInvoice?: (url: string, callback: (status: string) => void) => void;
        showPopup?: (params: any, callback: (buttonId: string) => void) => void;
        showAlert?: (message: string) => void;
        openTelegramLink?: (url: string) => void;
        switchInlineQuery?: (
          query: string,
          choose_chat_types?: string[],
        ) => void;
      };
    };
  }
}

import { Skeleton } from "./components/Skeleton";
import { Header } from "./components/Header";
import { FaqModal } from "./components/FaqModal";
import { WelcomeModal } from "./components/WelcomeModal";
import { DailyRewardModal } from "./components/DailyRewardModal";
import { BuyModal } from "./components/BuyModal";
import { HistoryCarousel } from "./components/HistoryCarousel";
import { UploadZone } from "./components/UploadZone";
import { AnalysisResults } from "./components/AnalysisResults";
import { BarberBlueprintModal } from "./components/BarberBlueprintModal";
import { CameraModal } from "./components/CameraModal";
import { LazyImage } from "./components/LazyImage";
import { downloadImage } from "./utils/downloadImage";
import { AnalysisResult } from "./types";

const FallbackImage =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80";

// Removed queue for simpler operation


const shareResult = (url: string) => {
  const tg = window.Telegram?.WebApp;
  if (tg && tg.switchInlineQuery) {
    tg.switchInlineQuery(url, ["users", "groups", "channels"]);
  } else if (navigator.share) {
    navigator
      .share({
        title: "Мой новый стиль",
        text: "Посмотри на мой новый стиль от НейроСтилиста!",
        url: url,
      })
      .catch(console.error);
  } else {
    alert(
      "Поделиться можно только в приложении Telegram или браузере с поддержкой Web Share API.",
    );
  }
};

import { useTokenManager } from "./hooks/useTokenManager";
export default function App() {

  const [isLightMode, setIsLightMode] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [faqData, setFaqData] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userRole, setUserRole] = useState<'client' | 'master' | 'salon'>('client');
  const [salonName, setSalonName] = useState('');
  const [showSalonNameInput, setShowSalonNameInput] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStyleName, setChatStyleName] = useState('');

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");
    if (!welcomeShown) {
      setShowWelcome(true);
    } else {
      const storedRole = localStorage.getItem("userRole") as 'client' | 'master' | 'salon';
      if (storedRole) {
        setUserRole(storedRole);
      }
      const storedSalonName = localStorage.getItem("salonName");
      if (storedSalonName) {
        setSalonName(storedSalonName);
      }
    }
  }, []);

  const { processImage, isProcessing: isCompressing, error: compressError } = useImageProcessor();
  const [tryOnStyle, setTryOnStyle] = useState<any | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [loadingARStyles, setLoadingARStyles] = useState<Record<string, boolean>>({});
  const [arGeneratedImageUrl, setArGeneratedImageUrl] = useState<
    Record<string, string>
  >({});
  
  // Teaser image state
  const [teaserUrl, setTeaserUrl] = useState<string | null>(null);
  const [teaserRecName, setTeaserRecName] = useState<string | null>(null);
  const [isGeneratingTeaser, setIsGeneratingTeaser] = useState(false);
  const [styleConsultations, setStyleConsultations] = useState<
    Record<string, string>
  >({});
  const [arError, setArError] = useState<string | null>(null);

  const [loadingVTONStyles, setLoadingVTONStyles] = useState<Record<string, boolean>>({});
  const [vtonResultUrl, setVtonResultUrl] = useState<string | null>(null);
  const [isTeaserResult, setIsTeaserResult] = useState<boolean>(false);
  const [vtonError, setVtonError] = useState<string | null>(null);
  const [customHairColor, setCustomHairColor] = useState<string | null>(null);
  const [vtonStrength, setVtonStrength] = useState<number>(50);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [preferredStyle, setPreferredStyle] = useState<string>("Любой");
  const {
    generationsLeft,
    setGenerationsLeft,
    history,
    setHistory,
    userId,
    initError,
    consumeToken,
    buyTokens,
    checkLimits,
    processPayment,
    isBuying,
    showBuyModal,
    setShowBuyModal,
    isTelegramEnv
  } = useTokenManager();

  const deleteHistoryItem = async (
    e: React.MouseEvent,
    itemToDelete: { url: string; keyword: string; timestamp: number },
  ) => {
    e.stopPropagation();

    // Optimistic UI update
    const newHistory = history.filter(
      (item) =>
        item.timestamp !== itemToDelete.timestamp ||
        item.url !== itemToDelete.url,
    );
    setHistory(newHistory);
    localStorage.setItem("localHistory", JSON.stringify(newHistory));

    // Save to firestore if logged in
    if (userId && userId !== "local-user") {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { history: newHistory });
      } catch (err) {
        console.warn("Failed to save history on deletion", err);
      }
    }
  };

  const formatHistoryDate = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const exportToPDF = async () => {
    const guideElement = document.getElementById("hairdresser-guide-content");
    if (!guideElement) return;

    setIsExportingPDF(true);
    try {
      // Create a clone of the element to style it correctly for PDF
      const clone = guideElement.cloneNode(true) as HTMLElement;
      clone.style.background = "#ffffff";
      clone.style.color = "#000000";
      clone.style.padding = "20px";

      // We must change text colors inside the clone since they are white in the UI
      const textElements = clone.querySelectorAll("*");
      textElements.forEach((el) => {
        (el as HTMLElement).style.color = "#000000";

        // Add basic inline styles for markdown elements that lose Tailwind class support in iframe
        if (el.tagName.toLowerCase() === "ul") {
          (el as HTMLElement).style.listStyleType = "disc";
          (el as HTMLElement).style.paddingLeft = "20px";
          (el as HTMLElement).style.marginBottom = "10px";
        }
        if (el.tagName.toLowerCase() === "li") {
          (el as HTMLElement).style.marginBottom = "4px";
        }
        if (el.tagName.toLowerCase() === "strong") {
          (el as HTMLElement).style.fontWeight = "600";
        }
        if (el.tagName.toLowerCase() === "p") {
          (el as HTMLElement).style.marginBottom = "10px";
        }
      });

      // Remove the export button from the clone to avoid showing it in the PDF
      const buttonToRemove = clone.querySelector("button");
      if (buttonToRemove) buttonToRemove.remove();

      // Ensure the clone has proper base styling
      clone.style.width = "800px";
      clone.style.maxWidth = "100%";
      clone.style.background = "#ffffff";
      clone.style.color = "#000000";
      clone.style.padding = "40px";
      clone.style.fontSize = "16px";
      clone.style.lineHeight = "1.6";
      clone.style.fontFamily = "system-ui, -apple-system, sans-serif";

      const htmlContent = clone.outerHTML;

      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 15,
        filename: "neurostylist-guide.pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt as any).from(htmlContent).save();
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Ошибка при экспорте в PDF.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResults(null);
    setArGeneratedImageUrl({});
    setTryOnStyle(null);
    setImageUrl(null);

    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, загрузите изображение (JPEG, PNG).");
      return;
    }

    setMimeType("image/jpeg");
    setIsUploadingImage(true);
    
    try {
        const b64 = await processImage(file);
        setImageBase64(b64);
        setIsUploadingImage(false);
        setImageUrl(null);
    } catch(err: any) {
        setIsUploadingImage(false);
        setError(compressError || err.message || "Ошибка обработки");
    }
  };

  const resetApp = () => {
    setImageBase64(null);
    setImageUrl(null);
    setResults(null);
    setMimeType("");
    setError(null);
    setArError(null);
    setArGeneratedImageUrl({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  const triggerFileInput = (e?: React.MouseEvent) => {
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
  };

  const triggerCameraInput = (e?: React.MouseEvent) => {
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
  };

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setCameraFacingMode] = useState<"user" | "environment">(
    "user",
  );
  const customVideoRef = useRef<HTMLVideoElement>(null);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const startCameraLocal = async (
    mode: "user" | "environment" = facingMode,
  ) => {
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
      alert(`Ошибка камеры: ${err.message || "устройство не найдено"}. Пожалуйста, используйте загрузку из галереи.`);
    }
  };

  const capturePhoto = () => {
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
          canvas.height,
        );
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera_photo.jpg", {
                type: "image/jpeg",
              });
              const fakeEvent = {
                target: { files: [file] },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleFileUpload(fakeEvent);
              stopCamera();
            }
          },
          "image/jpeg",
          0.9,
        );
      }
    }
  };

  useEffect(() => {
    // cleanup camera on unmount
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleTelegramUploadClick = (
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
      // Synchronous check to preserve user interaction token for fallback file input trigger
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
  };

  const fallbackFaceApi = async () => {
    try {
      if (!imageBase64) return null;
      const modelsUrl =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
      await Promise.all([
        (window as any).faceapi.nets.ssdMobilenetv1.loadFromUri(modelsUrl),
        (window as any).faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrl),
        (window as any).faceapi.nets.faceExpressionNet.loadFromUri(modelsUrl),
        (window as any).faceapi.nets.ageGenderNet.loadFromUri(modelsUrl),
      ]);

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () =>
          reject(new Error("Image load error in fallbackFaceApi"));
        img.src = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
        if (img.complete) resolve(undefined);
      });

      const detections = await (window as any).faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      if (!detections) {
        throw new Error("Лицо не найдено локальным алгоритмом");
      }

      return {
        warning:
          "Мы выполнили для вас базовый подбор стрижек (локальный экспресс-анализ). Для наиболее точного результата попробуйте загрузить фото позже, когда восстановится лимит серверов ИИ.",
        gender: detections.gender === "male" ? "male" : "female",
        faceShape: "Овальная",
        hairDensity: "Средние",
        hairType: "Прямые",
        ageRange: `${Math.round(detections.age - 5)}-${Math.round(detections.age + 5)}`,
        recommendations: detections.gender === "male" ? [
          {
            name: "Андеркат (Undercut)",
            description: "Короткие виски и затылок, удлиненная челка.",
            stylingTips: "Используйте помаду для волос или воск для фиксации челки.",
            imageKeyword: "Classic Undercut Men",
          },
          {
            name: "Кроп (Textured Crop)",
            description: "Текстурированная короткая стрижка с плавным переходом.",
            stylingTips: "Матовая глина поможет подчеркнуть текстуру.",
            imageKeyword: "Textured Crop Fade Men",
          },
          {
            name: "Классическая канадка (Pompadour)",
            description: "Объемная теменная зона с плавным переходом к вискам.",
            stylingTips: "Используйте мусс для объема у корней при сушке феном.",
            imageKeyword: "Classic Pompadour Men",
          },
        ] : [
          {
            name: "Стрижка Боб (Bob Cut)",
            description:
              "Классическая длина, которая идет почти всем типам лица.",
            stylingTips:
              "Слегка подкручивайте концы круглой щеткой для объема.",
            imageKeyword: "Classic Bob Haircut",
          },
          {
            name: "Пикси (Pixie Cut)",
            description:
              "Смелая короткая стрижка, прекрасно открывает черты лица.",
            stylingTips:
              "Используйте текстурирующую пасту для создания небрежного вида.",
            imageKeyword: "Textured Pixie Cut",
          },
          {
            name: "Длинные слои (Long Layers)",
            description:
              "Универсальный способ добавить объем и движение, сохраняя длину.",
            stylingTips:
              "Легкий спрей с морской солью поможет создать пляжные волны.",
            imageKeyword: "Long Layered Waves",
          },
        ],
      } as AnalysisResult;
    } catch (e) {
      console.error("Local face-api fallback failed", e);
      return null;
    }
  };

  const generateTeaser = async (rec: any, resultData: AnalysisResult) => {
    setIsGeneratingTeaser(true);
    setTeaserRecName(rec.name);
    try {
      const response = await fetch("/api/generate-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "local-user",
          selfieImage: imageUrl || imageBase64,
          keyword: rec.imageKeyword,
          description: rec.description,
          vtonStrength: 50,
          gender: resultData.gender,
          faceShape: resultData.faceShape,
          hairLength: resultData.hairLength,
          hairDensity: resultData.hairDensity,
          hairType: resultData.hairType,
          skinTone: resultData.skinTone,
          skinDetails: resultData.skinDetails,
          hairColor: resultData.hairColor,
          eyeColor: resultData.eyeColor,
          ageRange: resultData.ageRange,
          facialFeatures: resultData.facialFeatures,
          facialHair: resultData.facialHair,
          clothingContext: resultData.clothingContext,
        }),
      });
      const data = await response.json();
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

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          imageUrl,
          mimeType,
          userId,
          preferredStyle,
        }),
      });

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch (e) {}

        if (response.status === 429 && errData.fallback) {
          const fallbackResult = await fallbackFaceApi();
          if (fallbackResult) {
            setResults(fallbackResult);
            setIsAnalyzing(false);
            return;
          }
        }
        throw new Error(errData.error || "Ошибка при анализе фото от сервера.");
      }

      const parsedResults = (await response.json()) as AnalysisResult;
      setResults(parsedResults);
      
      // Auto-generate teaser if applicable
      if (parsedResults.recommendations && parsedResults.recommendations.length > 0) {
        if ((generationsLeft === null || generationsLeft <= 0) && !teaserUrl) {
          generateTeaser(parsedResults.recommendations[0], parsedResults);
        }
      }
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      setError(
        "⚠️ Не удалось проанализировать фото\n\nНейросеть не смогла точно определить форму твоего лица. Скорее всего, проблема в освещении или ракурсе.\n\nПожалуйста, попробуй ещё раз:\n• Сделай фото при дневном свете, лицом к окну\n• Смотри прямо в камеру, не наклоняй голову\n• Убери волосы от лица и сними очки\n\n📌 Твоя генерация не была списана — ты можешь загрузить новое фото бесплатно."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateARPreview = async (styleKeyword: string, styleName: string) => {
    if (!imageBase64 && !imageUrl) return;

    setLoadingARStyles((prev) => ({ ...prev, [styleKeyword]: true }));
    setArError(null);

    try {
      const response = await fetch("/api/generate-ar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          imageUrl,
          mimeType,
          styleKeyword,
          styleName,
          gender: results?.gender || "unknown",
          features: results,
        }),
      });

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch (e) {}
        throw new Error(
          errData.error || "Ошибка от сервера при генерации примерки.",
        );
      }

      const data = await response.json();

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
    } catch (err: any) {
      console.error("AR Generation Error:", err);
      // We still map what we can locally if network fails entirely
      setStyleConsultations((prev) => ({
        ...prev,
        [styleKeyword]: `<div class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-2 text-sm text-red-200">Сбой генерации гайда. Используйте визуальный референс для мастера.</div>`,
      }));
      setArError(
        err?.message ||
          "Ошибка генерации примерки. Попробуйте снова чуть позже.",
      );
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

    if (generationsLeft !== null && generationsLeft <= 0) {
       setShowBuyModal(true);
       return;
    }

    const proceed = await checkLimits();
    if (!proceed) return;

    setIsTeaserResult(false);
    setLoadingVTONStyles((prev) => ({ ...prev, [styleKeyword]: true }));
    setVtonError(null);
    setVtonResultUrl(null);

    try {
      const response = await fetch("/api/generate-full", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          selfieImage: imageUrl || imageBase64,
          keyword: styleKeyword,
          description: styleDescription,
          customHairColor: selectedColor,
          vtonStrength: vtonStrength,
          gender: results?.gender,
          faceShape: results?.faceShape,
          hairLength: results?.hairLength,
          hairDensity: results?.hairDensity,
          hairType: results?.hairType,
          skinTone: results?.skinTone,
          skinDetails: results?.skinDetails,
          hairColor: results?.hairColor,
          eyeColor: results?.eyeColor,
          ageRange: results?.ageRange,
          facialFeatures: results?.facialFeatures,
          facialHair: results?.facialHair,
          clothingContext: results?.clothingContext,
          targetImageUrl: targetImageUrl
        }),
      });

      let data: any = {};
      let textResponse = "";
      try {
        textResponse = await response.text();
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error(
          `Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`,
        );
      }

      if (data.referenceImage) {
        setArGeneratedImageUrl((prev) => ({
          ...prev,
          [styleKeyword]: data.referenceImage,
        }));
      }

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при виртуальной примерке.");
      }

      if (data.imageUrl) {
        setVtonResultUrl(data.imageUrl);
        
        const newItem = {
          url: data.imageUrl,
          keyword: styleKeyword || "Стиль",
          timestamp: Date.now(),
        };
        setHistory((prev) => {
          const newHistory = [newItem, ...prev].slice(0, 50);
          // Save to local storage for local users
          localStorage.setItem("localHistory", JSON.stringify(newHistory));

          // Save to firestore if logged in
          if (userId && userId !== "local-user") {
            const userRef = doc(db, "users", userId);
            updateDoc(userRef, { history: newHistory, scheduledNotificationAt: Date.now() + 28 * 24 * 60 * 60 * 1000 }).catch((e) =>
              console.warn("Failed to save history", e),
            );
          }
          return newHistory;
        });
      } else {
        throw new Error("Не удалось загрузить данные из ответа сервера.");
      }
    } catch (err: any) {
      console.error("VTON Error:", err);
      setVtonError(
        err?.message ||
          "Ошибка виртуальной примерки. Попробуйте снова чуть позже.",
      );
    } finally {
      setLoadingVTONStyles((prev) => ({ ...prev, [styleKeyword]: false }));
    }
  };

  const loadMoreRecommendations = async () => {
    if ((!imageBase64 && !imageUrl) || !results) return;

    setIsLoadingMore(true);
    setError(null);

    const existingNames = results.recommendations.map((r) => r.name).join(", ");

    try {
      const response = await fetch("/api/load-more", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          imageBase64: imageUrl ? undefined : imageBase64,
          imageUrl,
          mimeType: mimeType || "image/jpeg",
          existingNames,
          features: results,
          preferredStyle,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || "Ошибка при генерации новых вариантов от сервера.",
        );
      }

      const data = await response.json();

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
    } catch (err: any) {
      console.error("AI Load More Error:", err);
      setError(err?.message || "Ошибка при генерации новых вариантов.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (false && !isTelegramEnv) {
    return (
      <div className="min-h-screen bg-[#050508] text-white/90 flex flex-col items-center justify-center p-6 text-center font-sans tracking-wide">
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6 text-blue-400">
          <Zap size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold mb-4 tracking-tight">
          Откройте через Telegram
        </h1>
        <p className="text-white/60 mb-8 max-w-sm leading-relaxed font-light">
          Бот Нейростилиста теперь доступен эксклюзивно внутри Telegram. Это
          необходимо для обеспечения безопасности данных и доступа к функциям
          оплаты.
        </p>
        <a
          href="https://t.me/neirostilist_bot"
          target="_blank"
          rel="noreferrer"
          className="px-8 py-4 bg-white text-black hover:bg-white/90 rounded-full font-medium transition-colors text-sm uppercase tracking-wider"
        >
          Перейти в Telegram
        </a>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#050508] text-white/90 font-sans selection:bg-blue-500/30 ${isLightMode ? "light-mode" : ""}`}
    >
      {/* Header */}
      <Header
        generationsLeft={generationsLeft}
        isBuying={isBuying}
        buyTokens={buyTokens}
        userId={userId}
        userAvatar={userAvatar}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        setIsFaqOpen={setIsFaqOpen}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Intro */}
        {!imageBase64 && (
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl mb-4 md:mb-6 leading-tight tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
              Какая стрижка подойдет <br className="hidden sm:block" />{" "}
              <span className={`italic ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>именно вам?</span>
            </h2>
            <p className={`leading-relaxed max-w-lg mx-auto font-light text-sm sm:text-base px-2 ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
              Загрузите селфи, и наш умный эксперт определит форму вашего лица
              для подбора стрижек, которые подчеркнут ваши лучшие черты.
            </p>
          </div>
        )}

        {/* History Carousel */}
        <HistoryCarousel 
          history={history} 
          imageBase64={imageBase64} 
          deleteHistoryItem={deleteHistoryItem} 
          formatHistoryDate={formatHistoryDate} 
          isLightMode={isLightMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left / Top: Upload Zone */}
          <UploadZone
            imageBase64={imageBase64}
            imageUrl={imageUrl}
            mimeType={mimeType}
            isAnalyzing={isAnalyzing}
            isUploadingImage={isUploadingImage}
            error={error}
            results={results}
            consentGiven={consentGiven}
            setConsentGiven={setConsentGiven}
            consentError={consentError}
            setConsentError={setConsentError}
            fileInputRef={fileInputRef}
            cameraInputRef={cameraInputRef}
            handleFileUpload={handleFileUpload}
            handleTelegramUploadClick={handleTelegramUploadClick}
            resetApp={resetApp}
            setIsFaqOpen={setIsFaqOpen}
            preferredStyle={preferredStyle}
            setPreferredStyle={setPreferredStyle}
            analyzeImage={analyzeImage}
            isLightMode={isLightMode}
          />

          {/* Right: Results */}
          <AnalysisResults
            isAnalyzing={isAnalyzing}
            results={results}
            generationsLeft={generationsLeft}
            teaserUrl={teaserUrl}
            isGeneratingTeaser={isGeneratingTeaser}
            setShowBuyModal={setShowBuyModal}
            setTryOnStyle={setTryOnStyle}
            loadMoreRecommendations={loadMoreRecommendations}
            isLoadingMore={isLoadingMore}
            isLightMode={isLightMode}
          />
        </div>
      </main>

            <BarberBlueprintModal
        tryOnStyle={tryOnStyle}
        setTryOnStyle={setTryOnStyle}
        results={results}
        imageUrl={imageUrl}
        mimeType={mimeType}
        imageBase64={imageBase64}
        styleConsultations={styleConsultations}
        loadingARStyles={loadingARStyles}
        arError={arError}
        vtonResultUrl={vtonResultUrl}
        isTeaserResult={isTeaserResult}
        processPayment={processPayment}
        customHairColor={customHairColor}
        setCustomHairColor={setCustomHairColor}
        vtonStrength={vtonStrength}
        setVtonStrength={setVtonStrength}
        generateARPreview={generateARPreview}
        exportToPDF={exportToPDF}
        isExportingPDF={isExportingPDF}
        userRole={userRole}
        salonName={salonName}
        setChatStyleName={setChatStyleName}
        setIsChatOpen={setIsChatOpen}
        loadingVTONStyles={loadingVTONStyles}
        generateVirtualTryOn={generateVirtualTryOn}
        vtonError={vtonError}
        isLightMode={isLightMode}
      />

      <CameraModal
        isCameraModalOpen={isCameraModalOpen}
        customVideoRef={customVideoRef}
        facingMode={facingMode}
        stopCamera={stopCamera}
        capturePhoto={capturePhoto}
        startCameraLocal={startCameraLocal}
      />

      <BuyModal
        showBuyModal={showBuyModal}
        setShowBuyModal={setShowBuyModal}
        isBuying={isBuying}
        userRole={userRole}
        userId={userId}
        processPayment={processPayment}
        isLightMode={isLightMode}
      />

      <FaqModal isFaqOpen={isFaqOpen} setIsFaqOpen={setIsFaqOpen} faqData={faqData} isLightMode={isLightMode} />

      <WelcomeModal
        showWelcome={showWelcome}
        setShowWelcome={setShowWelcome}
        setUserRole={setUserRole}
        salonName={salonName}
        setSalonName={setSalonName}
        showSalonNameInput={showSalonNameInput}
        setShowSalonNameInput={setShowSalonNameInput}
        isLightMode={isLightMode}
      />

      <DailyRewardModal isLightMode={isLightMode} />

      {isChatOpen && results && (
        <StylistChat 
           onClose={() => setIsChatOpen(false)}
           features={results}
           styleName={chatStyleName}
           isLightMode={isLightMode}
        />
      )}

      <style>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
