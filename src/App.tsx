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
} from "lucide-react";
import { CachedImage } from "./components/CachedImage";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { StylistChat } from "./components/StylistChat";
import { generateCollage } from "./utils/collage";
import { auth, db, remoteConfig } from "./firebase";
import { signInAnonymously } from "firebase/auth";
import { fetchAndActivate, getString } from "firebase/remote-config";
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
        switchInlineQuery?: (
          query: string,
          choose_chat_types?: string[],
        ) => void;
      };
    };
  }
}

import { Skeleton } from "./components/Skeleton";

// The LazyImage component generates reference images on demand via server
const globalImageCache: Record<string, string> = {};

const LazyImage = memo(({
  keyword,
  gender,
  uniqueName,
  description,
  className,
  autoLoad = false,
  results,
}: {
  keyword: string;
  gender: string;
  uniqueName: string;
  description?: string;
  className?: string;
  autoLoad?: boolean;
  results?: AnalysisResult;
}) => {
  const cacheKey = `${gender}_${keyword}`;
  const [loadedUrl, setLoadedUrl] = useState<string | null>(
    globalImageCache[cacheKey] || null,
  );
  const [isLoading, setIsLoading] = useState(
    autoLoad && !globalImageCache[cacheKey],
  );
  const [errorString, setErrorString] = useState<string | null>(null);

  const generateImage = async () => {
    if (globalImageCache[cacheKey]) {
      setLoadedUrl(globalImageCache[cacheKey]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorString(null);

    try {
      const response = await fetch("/api/generate-reference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          gender,
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      if (data.imageUrl) {
        globalImageCache[cacheKey] = data.imageUrl;
        setLoadedUrl(data.imageUrl);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (err: any) {
      console.error("Failed to load reference image", err);
      let errMsg = err.message || "Сбой загрузки";
      if (
        err.message &&
        (err.message.toLocaleLowerCase().includes("лимит") ||
          err.message.includes("429") ||
          err.message.includes("quota"))
      ) {
        errMsg = "СЕРВЕР ПЕРЕГРУЖЕН";
      } else if (errMsg.length > 50) {
        errMsg = errMsg.substring(0, 47) + "...";
      }
      setErrorString(errMsg);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (autoLoad) {
      const t = setTimeout(() => generateImage(), Math.random() * 500);
      return () => clearTimeout(t);
    }
  }, [keyword, gender, uniqueName, autoLoad]);

  if (loadedUrl) {
    return (
      <div className="relative w-full h-full group/lazy flex">
        <img
          src={loadedUrl}
          alt={uniqueName}
          className={`w-full h-full ${className || "object-cover"}`}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadImage(loadedUrl, "reference_style.jpg");
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-black/80 transition-opacity z-10 opacity-100 sm:opacity-0 group-hover/lazy:opacity-100"
          title="Сохранить референс"
        >
          <Download size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center bg-transparent text-white/90 border-r border-white/10 ${className || ""}`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4">
          <Skeleton className="w-12 h-12 rounded-full mb-2" />
          <Skeleton className="w-2/3 h-2 rounded" />
          <Skeleton className="w-1/2 h-2 rounded" />
        </div>
      ) : errorString ? (
        <div className="flex flex-col items-center gap-2 px-2 text-center">
          <AlertCircle size={20} className="text-red-500 opacity-80" />
          <span className="text-red-500 text-[10px] uppercase font-medium leading-tight">
            {errorString}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              generateImage();
            }}
            className="mt-1 text-[9px] bg-white/10 hover:bg-white/10 text-white/90 px-3 py-1.5 rounded uppercase tracking-wider transition-colors"
          >
            Повторить
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            generateImage();
          }}
          className="flex flex-col items-center gap-2 group p-4 hover:bg-white/5 rounded-xl transition-colors"
        >
          <ImageIcon className="w-8 h-8 text-white/40 group-hover:text-white/80 transition-colors" />
          <span className="text-[10px] text-white/60 font-mono uppercase tracking-wider text-center leading-tight group-hover:text-white/90">
            Показать
            <br />
            пример
          </span>
        </button>
      )}
    </div>
  );
});

interface AnalysisResult {
  warning?: string;
  gender: string;
  faceShape: string;
  hairLength?: string;
  hairDensity: string;
  hairType: string;
  skinTone?: string;
  skinDetails?: string;
  hairColor?: string;
  eyeColor?: string;
  ageRange?: string;
  facialFeatures?: string;
  facialHair?: string;
  clothingContext?: string;
  recommendations: Array<{
    name: string;
    description: string;
    stylingTips: string;
    imageKeyword: string;
  }>;
}

const FallbackImage =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80";

// Removed queue for simpler operation

const downloadImage = async (url: string, filename: string) => {
  try {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData) {
      if (tg.showAlert) {
        tg.showAlert(
          "В Telegram: нажмите на фото и удерживайте пару секунд, затем выберите «Сохранить» или «Поделиться».",
        );
      } else {
        alert(
          "В Telegram: нажмите на фото и удерживайте пару секунд, затем выберите «Сохранить».",
        );
      }
      return;
    }

    if (url.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objUrl);
      } catch (e) {
        window.open(url, "_blank");
      }
    }
  } catch (e) {
    console.error("Download failed", e);
  }
};

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

export default function App() {
  const [tryOnStyle, setTryOnStyle] = useState<any | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [loadingARStyles, setLoadingARStyles] = useState<Record<string, boolean>>({});
  const [arGeneratedImageUrl, setArGeneratedImageUrl] = useState<
    Record<string, string>
  >({});
  const [styleConsultations, setStyleConsultations] = useState<
    Record<string, string>
  >({});
  const [arError, setArError] = useState<string | null>(null);

  const [loadingVTONStyles, setLoadingVTONStyles] = useState<Record<string, boolean>>({});
  const [vtonResultUrl, setVtonResultUrl] = useState<string | null>(null);
  const [vtonError, setVtonError] = useState<string | null>(null);
  const [customHairColor, setCustomHairColor] = useState<string | null>(null);
  const [vtonStrength, setVtonStrength] = useState<number>(50);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [preferredStyle, setPreferredStyle] = useState<string>("Любой");

  const [generationsLeft, setGenerationsLeft] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [faqData, setFaqData] = useState<any[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isTelegramEnv, setIsTelegramEnv] = useState(true);

  const [showWelcome, setShowWelcome] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStyleName, setChatStyleName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!localStorage.getItem("welcomeShown")) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    // Fetch FAQ from Remote Config
    if (remoteConfig) {
      // Setup default config
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
      remoteConfig.defaultConfig = {
        faq_data: JSON.stringify([
          { q: "🆓 Что бесплатно, а что платно?", a: "Мы разделили функционал, чтобы ты мог(ла) бесплатно изучить все рекомендации и принять взвешенное решение.\n\nБесплатно всегда:\n📊 Анализ формы лица — ИИ определит твой тип лица и даст текстовые рекомендации\n📖 Гайды по стрижкам — подробные описания, какие причёски подходят именно твоей форме лица\n🖼️ Галерея референсов — фото-примеры стрижек, которые тебе рекомендованы (готовые изображения моделей, не твоё фото)\n🎚️ Шкала вмешательства ИИ — настройка при генерации (см. раздел ниже)\n📋 История всех твоих генераций — всегда доступна в профиле\n\nОплачивается звёздами Telegram:\n⭐ Генерация примерки на твоём фото — когда нейросеть рисует выбранную стрижку именно на твоём лице\n\nПри старте ты получаешь 5 бесплатных генераций, чтобы попробовать и оценить результат." },
          { q: "🎚️ Что такое «шкала вмешательства ИИ»?", a: "Это уникальная фишка НейроСтилиста, которая даёт тебе контроль над результатом. Перед каждой генерацией ты выбираешь, насколько сильно нейросеть может изменить твоё изображение.\n\n0–25% — Лёгкое вмешательство\nИИ меняет только причёску. Твоё лицо, тон кожи, освещение остаются максимально близкими к оригиналу. Идеально для реалистичного предпросмотра.\n\n25–50% — Умеренное вмешательство\nНейросеть немного адаптирует причёску под твой образ: может скорректировать тени на лице, слегка подправить переходы у шеи. Результат выглядит естественно, но чуть более «прилизанно».\n\n50–75% — Заметное вмешательство\nИИ активно перерабатывает изображение: причёска интегрируется глубже, меняется текстура волос, может слегка измениться тон кожи для гармонии. Подходит, если хочешь увидеть максимально целостный образ.\n\n75–100% — Полное преображение\nМаксимальная свобода для нейросети. Результат может выглядеть как полноценная студийная фотография в новом образе. Подходит для вдохновения и смелых экспериментов. Помни: чем выше процент, тем дальше результат от твоего исходного фото.\n\nРекомендация: для первого знакомства с ботом начни с 10–25% — так ты увидишь наиболее реалистичную примерку." },
          { q: "🎨 Результат выглядит неестественно. Почему?", a: "НейроСтилист создаёт концепт-арт, а не студийную фотографию. Это значит:\n\n• Причёска может немного отличаться от реальной (длина, текстура волос)\n• Тон кожи или тени могут слегка измениться — это особенность технологии генерации\n• Мелкие детали (переход волос к одежде, отдельные прядки) могут иметь артефакты\n\nЦель бота — дать тебе общее представление о том, как стрижка будет смотреться именно на твоём лице. Это не замена консультации с мастером, а вдохновение перед походом в салон.\n\nКак улучшить результат:\n• Попробуй загрузить другое фото (более чёткое, при хорошем свете)\n• Сгенерируй тот же стиль ещё раз — нейросеть может выдать другой вариант\n• Поэкспериментируй со шкалой вмешательства ИИ — иногда снижение процента даёт более естественный результат\n\nПомни: реальная стрижка всегда будет смотреться лучше, потому что мастер учтёт структуру твоих волос и укладку" },
          { q: "📸 Почему фото не принимается?", a: "Бот работает с нейросетями, которые анализируют геометрию лица. Если фото тёмное, размытое, снято под углом или с аксессуарами — алгоритм не сможет корректно определить форму лица и результат будет неточным.\n\nЧто делать:\n• Пересними селфи при дневном свете, глядя прямо в камеру\n• Сними очки, убери волосы от лица\n• Убедись, что фото чёткое — не используй скриншоты или сжатые изображения из мессенджеров" },
          { q: "⏳ Почему генерация занимает до 20 секунд?", a: "Твоё фото проходит сложный процесс:\n\n• Анализ лица (3–8 сек.) — ИИ определяет форму лица, пропорции, особенности\n• Генерация причёски (10–20 сек.) — нейросеть перерисовывает волосы с учётом выбранного процента вмешательства ИИ\n\nЭто не просто «наложение фильтра», а полноценная работа нескольких нейросетей. Мы сделали всё, чтобы ожидание было комфортным — добавили анимацию и статус процесса. Скорость зависит от загруженности серверов, но обычно это не больше 20 секунд." },
          { q: "💰 Как купить дополнительные генерации?", a: "Бот использует Telegram Stars — внутреннюю валюту Telegram.\n\n1. Нажми кнопку «Запустить примерку» (если генерации кончились) или «Пополнить» в профиле\n2. Выбери пакет (5, 10 или 30 генераций)\n3. Оплати через встроенную систему Telegram\n\nЕсли у тебя не хватает звёзд, пополни баланс в настройках Telegram:\nНастройки → Telegram Stars → Пополнить" },
          { q: "👤 Кто видит мои фото?", a: "Твоя приватность — наш приоритет.\n\n• Фото загружаются на сервер только для обработки\n• Мы не храним оригиналы дольше, чем это необходимо для генерации\n• Никто из команды не просматривает пользовательские фото вручную\n• Сгенерированные результаты видны только тебе в истории генераций\n\nТы можешь удалить любое фото из истории в любой момент." },
          { q: "💇‍♂️ Можно ли использовать бота с клиентами в салоне?", a: "Да! Многие мастера уже используют НейроСтилиста для консультаций:\n\n• Покажи клиенту 2–3 варианта до начала стрижки\n• Сравните «было / стало» прямо в кресле\n• Убеди сомневающегося клиента визуальным результатом\n\nДля мастеров мы готовим специальные условия — напиши в поддержку, чтобы узнать подробности." },
          { q: "🆘 Что делать, если генерация не удалась или зависла?", a: "• Проверь интернет-соединение\n• Нажми «Попробовать снова» — повторная попытка не тратит генерацию, если результат не был показан\n• Если проблема повторяется — напиши в поддержку.\n\nТо же самое происходит, если нейросеть не смогла найти лицо, генерация не списана и ты можешь безопасно загрузить новое фото." }
        ])
      };
      
      fetchAndActivate(remoteConfig)
        .then(() => {
          const faqString = getString(remoteConfig, 'faq_data');
          if (faqString) {
            try {
              setFaqData(JSON.parse(faqString));
            } catch (e) {
              console.error("Failed to parse remote config FAQ data", e);
            }
          }
        })
        .catch(console.error);
    }
  }, []);
  const [history, setHistory] = useState<
    { url: string; keyword: string; timestamp: number }[]
  >([]);

  useEffect(() => {
    // Check Telegram
    const tg = window.Telegram?.WebApp;
    if (tg && (tg as any).initData) {
      setIsTelegramEnv(true);
      tg.expand?.();
      if ((tg as any).setHeaderColor) {
        (tg as any).setHeaderColor("#0f0c1b");
      }
      if ((tg as any).setBackgroundColor) {
        (tg as any).setBackgroundColor("#050508");
      }
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser && tgUser.photo_url) {
        setUserAvatar(tgUser.photo_url);
      }
    } else {
      // setIsTelegramEnv(false);
    }

    const initUser = async () => {
      let currentUid = null;
      let tgUser = tg?.initDataUnsafe?.user;

      try {
        const userCred = await Promise.race([
          signInAnonymously(auth),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 5000),
          ),
        ]) as any;
        if (userCred && userCred.user) {
          currentUid = userCred.user.uid;
        }
      } catch (e) {
        console.warn("Auth warning (timeout expected in dev):", e);
      }

      if (!currentUid) {
         currentUid = "local-user";
      }

      setUserId(currentUid);

      if (currentUid === "local-user") {
          const localGens = localStorage.getItem("localGenerationsLeft");
          if (localGens === null) {
            localStorage.setItem("localGenerationsLeft", "5");
            setGenerationsLeft(5);
          } else {
            setGenerationsLeft(parseInt(localGens, 10));
          }
          try {
            const localHistory = JSON.parse(
              localStorage.getItem("localHistory") || "[]",
            );
            setHistory(localHistory);
          } catch (e) {}
          // Removed restriction for test
      }

      try {
        const userRef = doc(db, "users", currentUid);
        let userDoc;
        try {
          userDoc = (await Promise.race([
            getDoc(userRef),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 5000),
            ),
          ])) as import("firebase/firestore").DocumentSnapshot;
        } catch (e: any) {
          console.warn(`getDoc failed: ${e.message || e}.`);
          throw new Error("fallback_to_local");
        }

        if (!userDoc || !userDoc.exists()) {
          try {
            await Promise.race([
              setDoc(userRef, {
                generationsLeft: 5,
                createdAt: serverTimestamp(),
                history: [],
                ...(tgUser?.id ? { tgId: tgUser.id } : {}),
                ...(tgUser?.username ? { tgUsername: tgUser.username } : {}),
              }),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 5000),
              ),
            ]);
            setGenerationsLeft(5);
            fetch("/api/log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                level: "info",
                message: `👋 <b>Новый пользователь</b>\nUsername: ${tgUser?.username || "нет"}\nID: ${currentUid}`,
                userId: currentUid,
              }),
            }).catch(console.error);
          } catch (createErr: any) {
            console.warn(
              "setDoc create failed:",
              createErr?.message || createErr,
            );
            throw new Error("fallback_to_local");
          }
        } else {
          const data = userDoc.data();
          setGenerationsLeft(data?.generationsLeft ?? 0);
          setHistory(data?.history ?? []);
        }
      } catch (err: any) {
        if (err.message !== "fallback_to_local") {
          console.error("Firebase Init Error", err);
        }
        const localGens = localStorage.getItem("localGenerationsLeft");
        if (localGens === null) {
          localStorage.setItem("localGenerationsLeft", "5");
          setGenerationsLeft(5);
        } else {
          setGenerationsLeft(parseInt(localGens, 10));
        }
        try {
          const localHistory = JSON.parse(
            localStorage.getItem("localHistory") || "[]",
          );
          setHistory(localHistory);
        } catch (e) {}
        setUserId("local-user");
        setInitError(null);
      }
    };

    initUser();
  }, []);

  const consumeToken = async () => {
    if (!userId || generationsLeft === null || generationsLeft <= 0)
      return false;

    // Check if we are acting as a local user (either explicitly set or by trying the DB)
    if (userId === "local-user") {
      const next = generationsLeft - 1;
      setGenerationsLeft(next);
      localStorage.setItem("localGenerationsLeft", next.toString());
      return true;
    }

    try {
      const userRef = doc(db, "users", userId);
      // Timeout promise to avoid hanging forever if Firebase is disconnected
      await Promise.race([
        updateDoc(userRef, { generationsLeft: increment(-1) }),
        new Promise((_, reject) => setTimeout(() => reject("timeout"), 5000)),
      ]);
      setGenerationsLeft((prev) => (prev ? prev - 1 : 0));
      return true;
    } catch (err: any) {
      console.warn(
        "Failed to consume token via DB. Falling back to local storage.",
        err,
      );
      // Fallback
      const next = generationsLeft - 1;
      setGenerationsLeft(next);
      localStorage.setItem("localGenerationsLeft", next.toString());
      return true;
    }
  };

  const checkLimits = async () => {
    if (generationsLeft !== null && generationsLeft <= 0) {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.showPopup) {
        tg.showPopup(
          {
            title: "Закончились генерации",
            message: "Пополните баланс, чтобы продолжить использование.",
            buttons: [{ type: "ok", id: "ok" }],
          },
          () => {
            buyTokens();
          },
        );
      } else {
        alert("Закончились генерации. Пополните баланс.");
        buyTokens();
      }
      return false;
    }

    // Consume a token before proceeding
    const success = await consumeToken();
    if (!success) return false;
    return true;
  };

  const [isBuying, setIsBuying] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const buyTokens = () => {
    setShowBuyModal(true);
  };

  const processPayment = async (packageId: number, starsAmount: number) => {
    if (!userId) return;

    setIsBuying(true);
    try {
      const tg = window.Telegram?.WebApp;
      const tgUserId = (tg as any)?.initDataUnsafe?.user?.id;
      if (isTelegramEnv && tg && tgUserId) {
        
        // Ensure webhook is set before creating invoice
        try {
           await fetch('/api/set-telegram-webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ webAppUrl: window.location.origin })
           });
        } catch(e) {
           console.error("Failed to setup webhook", e);
        }

        const response = await fetch("/api/create-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, tgUserId, packageId }),
        });
        const data = await response.json();
        if (!response.ok || !data.invoiceUrl) {
          throw new Error(data.error || "Ошибка при создании счета");
        }

        if (tg.openInvoice) {
          tg.openInvoice(data.invoiceUrl, async (status: string) => {
            if (status === "paid") {
              if (userId === "local-user") {
                const next = (generationsLeft || 5) + packageId;
                localStorage.setItem("localGenerationsLeft", next.toString());
                setGenerationsLeft(next);
              } else {
                setGenerationsLeft((prev) => (prev || 0) + packageId);
                try {
                  const userRef = doc(db, "users", userId as string);
                  await updateDoc(userRef, {
                    generationsLeft: increment(packageId),
                    fullAccess: true
                  });
                } catch (e) {
                  console.error("Failed to commit stars to db:", e);
                }
              }
              
              fetch("/api/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  level: "info",
                  message: `💰 Оплата успешно завершена (Пакет: ${packageId}, ${starsAmount} Stars)`,
                  userId,
                }),
              }).catch(console.error);

              setShowBuyModal(false);
              tg.showAlert(`Успешно! Добавлено ${packageId} генераций.`);
            } else {
              fetch("/api/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  level: "warn",
                  message: `Оплата отменена или не прошла, статус: ${status}`,
                  userId,
                }),
              }).catch(console.error);
            }
          });
        } else {
           alert("Невозможно открыть счет. Пожалуйста, обновите Telegram.");
        }
      } else {
        alert("Оплата поддерживается только в Telegram. (Telegram User ID не найден)");
      }
    } catch (err: any) {
      console.error("Error creating invoice: ", err);
      const tg = window.Telegram?.WebApp;
      if (tg && tg.showAlert) {
        if (err.message && err.message.includes("bot owner")) {
           tg.showAlert("Оплата временно недоступна. Владелец бота еще не принял условия.");
        } else {
           tg.showAlert(err.message || "Ошибка при оплате");
        }
      } else {
        alert(
          "Ошибка создания счета: " + (err.message || "Неизвестная ошибка"),
        );
      }
    } finally {
      setIsBuying(false);
    }
  };

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

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, загрузите изображение (JPEG, PNG).");
      return;
    }

    setMimeType("image/jpeg");
    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
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
          compressedDataUrl = event.target?.result as string;
        }

        const b64 = compressedDataUrl.split(",")[1];
        setImageBase64(b64); // Show preview immediately
        setIsUploadingImage(false);
      };
      img.onerror = () => {
        setIsUploadingImage(false);
        setError("Ошибка обработки изображения.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsUploadingImage(false);
      setError("Ошибка чтения файла.");
    };
    reader.readAsDataURL(file);
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
        recommendations: [
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

    const proceed = await checkLimits();
    if (!proceed) return;

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
          selfieImage: imageBase64,
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
            updateDoc(userRef, { history: newHistory }).catch((e) =>
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
          imageBase64,
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

  if (!isTelegramEnv) {
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
      <header className="border-b border-white/10 glass-header backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 glass-button rounded-full flex items-center justify-center text-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.37)] border border-white/20">
              <Scissors size={16} className="opacity-90 sm:w-5 sm:h-5 w-4 h-4" />
            </div>
            <h1 className="font-serif font-semibold text-lg sm:text-2xl tracking-tight text-white/90 truncate max-w-[140px] sm:max-w-none">
              НейроСтилист{" "}
              <span className="text-white/60 italic opacity-80 hidden sm:inline">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-mono text-white/90">
              <Coins size={14} className="text-amber-500" />
              <span>
                <span className="hidden sm:inline">Баланс: </span>{generationsLeft !== null ? generationsLeft : "..."}
              </span>
            </div>
            <button
              onClick={buyTokens}
              disabled={isBuying}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-black font-bold text-[9px] sm:text-[11px] uppercase tracking-wider px-2 sm:px-3 py-1.5 rounded-full transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] whitespace-nowrap"
            >
              <Zap size={10} fill="currentColor" className="sm:inline hidden" />
              {isBuying ? "Загрузка..." : "Купить"}
            </button>
            <div className="hidden md:flex flex-col items-end gap-1">
              <p className="text-xs tracking-[0.2em] text-white/60 uppercase font-medium">
                ИИ-Подбор
              </p>
            </div>

            {/* Profile Menu */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${userAvatar ? "p-0" : "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"}`}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    U
                  </div>
                )}
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-2xl border border-white/10 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-xs text-white/50 uppercase tracking-widest font-medium mb-1">
                        Настройки профиля
                      </p>
                      <p className="text-sm text-white/90 truncate">
                        ID: {userId}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsFaqOpen(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-white/80 hover:text-white transition-colors mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle size={16} />
                          Вопросы и ответы (FAQ)
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setIsLightMode(!isLightMode);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-white/80 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {isLightMode ? <Sun size={16} /> : <Moon size={16} />}
                          Светлая тема
                        </span>
                        <div
                          className={`w-8 h-4 rounded-full relative transition-colors ${isLightMode ? "bg-blue-500" : "bg-white/10"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isLightMode ? "left-4.5" : "left-0.5"}`}
                          ></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Intro */}
        {!imageBase64 && (
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-white/90 mb-4 md:mb-6 leading-tight tracking-tight">
              Какая стрижка подойдет <br className="hidden sm:block" />{" "}
              <span className="text-white/60 italic">именно вам?</span>
            </h2>
            <p className="text-white/60 leading-relaxed max-w-lg mx-auto font-light text-sm sm:text-base px-2">
              Загрузите селфи, и наш умный эксперт определит форму вашего лица
              для подбора стрижек, которые подчеркнут ваши лучшие черты.
            </p>
          </div>
        )}

        {/* History Carousel */}
        {history && history.length > 0 && !imageBase64 && (
          <div className="mb-12 max-w-4xl mx-auto text-center animate-in fade-in">
            <h3 className="text-white/60 text-sm tracking-[0.1em] uppercase mb-4 font-medium flex items-center justify-center gap-2">
              <ImageIcon size={14} /> История образов
            </h3>
            <div className="flex overflow-x-auto pb-4 gap-4 px-4 snap-x hide-scrollbar sm:justify-center">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex-none snap-center relative rounded-xl overflow-hidden border border-white/10 group cursor-pointer w-[120px] h-[160px] sm:w-[150px] sm:h-[200px]"
                  onClick={() => window.open(item.url, "_blank")}
                >
                  <CachedImage
                    src={item.url}
                    alt={item.keyword}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <button
                    onClick={(e) => deleteHistoryItem(e, item)}
                    title="Удалить из истории"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all z-10"
                  >
                    <X size={12} />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-12 flex flex-col items-start">
                    <p className="text-[10px] sm:text-xs font-semibold text-white/90 truncate w-full text-left">
                      {item.keyword}
                    </p>
                    {item.timestamp && (
                      <p className="text-[8px] sm:text-[9px] text-white/60 mt-0.5">
                        {formatHistoryDate(item.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left / Top: Upload Zone */}
          <div
            className={`col-span-1 lg:col-span-5 transition-all duration-700 ${imageBase64 ? "" : "lg:col-span-8 lg:col-start-3"}`}
          >
            <div className="relative group">
              <div className="relative bg-transparent text-white/90 rounded-2xl border border-white/10 overflow-hidden shadow-sm flex flex-col">
                {/* Header of the card */}
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center glass-panel">
                  <h3 className="font-medium text-sm tracking-widest uppercase text-white/60 flex items-center gap-2">
                    <Camera size={14} /> ФОТО ПРОФИЛЯ
                  </h3>
                  {imageBase64 && !isAnalyzing && (
                    <button
                      onClick={resetApp}
                      aria-label="Удалить фото и начать заново"
                      className="text-white/60 hover:text-white/90 transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="p-2 sm:p-4 pb-6">
                  {!imageBase64 ? (
                    <div className="flex flex-col items-center w-full">
                      <div
                        className={`w-full border border-dashed rounded-xl glass-panel flex flex-col items-center justify-center min-h-[360px] md:min-h-[440px] relative ${consentError ? "border-red-500/50 bg-red-500/5" : "border-white/10 hover:border-white/20"}`}
                      >
                        {consentError && (
                          <div className="absolute top-4 left-0 right-0 flex justify-center animate-pulse">
                            <span className="bg-red-500/20 text-red-100 text-xs px-3 py-1 rounded-full border border-red-500/30 font-medium">
                              Необходимо согласие на обработку данных
                            </span>
                          </div>
                        )}
                        <div
                          className={`w-20 h-20 bg-transparent rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/10 transition-all duration-500 ${consentGiven ? "text-white/90 hover:scale-105 hover:text-white/90" : "text-white/40 grayscale"}`}
                        >
                          <Upload size={28} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-serif text-white/90 mb-2 tracking-tight text-center">
                          Загрузите селфи
                        </h4>
                        <p className="text-white/60 text-sm max-w-[280px] text-center mb-8 font-light leading-relaxed px-4">
                          Сделайте фото камерой или выберите из галереи. Лицо
                          должно быть хорошо освещено.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full px-6 max-w-[400px]">
                          <button
                            onClick={(e) => handleTelegramUploadClick(true, e)}
                            className={`flex-1 glass-button text-white/90 border py-3 sm:py-3.5 rounded-full text-[13px] sm:text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${consentGiven ? "hover:bg-white/10 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-95" : "opacity-50 border-white/10 grayscale cursor-not-allowed"}`}
                          >
                            <Camera size={16} />
                            Сделать фото
                          </button>
                          <button
                            onClick={(e) => handleTelegramUploadClick(false, e)}
                            className={`flex-1 glass-button text-white/90 border py-3 sm:py-3.5 rounded-full text-[13px] sm:text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${consentGiven ? "hover:bg-white/10 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-95" : "opacity-50 border-white/10 grayscale cursor-not-allowed"}`}
                          >
                            <ImageIcon size={16} />
                            Галерея
                          </button>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          className="absolute w-px h-px opacity-0 overflow-hidden pointer-events-none -z-10"
                          onChange={handleFileUpload}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={cameraInputRef}
                          capture="user"
                          className="absolute w-px h-px opacity-0 overflow-hidden pointer-events-none -z-10"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <div
                        className="mt-5 flex items-start gap-3 px-2 w-full max-w-[340px] cursor-pointer"
                        onClick={() => {
                          setConsentGiven(!consentGiven);
                          if (!consentGiven) setConsentError(false);
                        }}
                      >
                        <input
                          type="checkbox"
                          id="consent152"
                          checked={consentGiven}
                          onChange={(e) => {
                            // Handled by the wrapper onClick, but keep this for React controlled component warnings
                          }}
                          className="mt-0.5 w-[18px] h-[18px] rounded border-white/20 bg-black/30 text-white/90 accent-[#2AABEE] cursor-pointer flex-shrink-0 pointer-events-none"
                        />
                        <label
                          htmlFor="consent152"
                          className="text-[11px] sm:text-xs text-white/40 leading-relaxed cursor-pointer select-none hover:text-white/60 transition-colors pointer-events-none"
                        >
                          Я даю согласие на обработку моих персональных
                          (биометрических) данных в соответствии с ФЗ-152 для
                          обработки селфи нейросетью. Фото не хранится на
                          сервере.
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Preview */}
                      <div className="relative rounded-xl overflow-hidden glass-panel aspect-[3/4] flex items-center justify-center max-h-[500px] ring-1 ring-white/10">
                        <img
                          src={`data:${mimeType || "image/jpeg"};base64,${imageBase64}`}
                          alt="Ваше фото"
                          className={`max-w-full max-h-full object-contain w-full h-full transition-all duration-1000 ${isAnalyzing ? "scale-105 blur-sm opacity-50 grayscale hover:grayscale-0" : "scale-100"}`}
                        />

                        {/* Scanning Overlay */}
                        {isAnalyzing && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                            <div className="absolute inset-0 bg-white/10 opacity-20 mix-blend-overlay"></div>
                            <div className="w-full h-1 glass-button opacity-50 shadow-[0_0_20px_#fff] absolute top-[-50%] animate-[scan_2.5s_ease-in-out_infinite_alternate]"></div>
                            <div className="relative z-20 flex flex-col items-center bg-white/5 backdrop-blur-md backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                              <Sparkles
                                className="animate-pulse text-white/90 mb-4"
                                size={32}
                                strokeWidth={1.5}
                              />
                              <span className="font-serif italic text-white/90 text-xl tracking-wide">
                                Анализ геометрии...
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Error Message */}
                      {error && (
                        error.includes("Не удалось проанализировать") ? (
                          <div className={isLightMode ? "bg-orange-50 border border-orange-200 p-5 rounded-2xl text-left mt-2 shadow-md" : "bg-[#111] border border-orange-500/20 p-5 rounded-2xl text-left mt-2 shadow-lg"}>
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle className="text-orange-500" size={20} />
                              <h3 className="font-semibold text-orange-500 text-sm">Не удалось проанализировать фото</h3>
                            </div>
                            <div className={isLightMode ? "text-gray-700 space-y-3 text-sm leading-relaxed mb-5" : "text-white/80 space-y-3 text-sm leading-relaxed mb-5"}>
                             <p>Нейросеть не смогла точно определить форму твоего лица. Скорее всего, проблема в освещении или ракурсе.</p>
                             <p>Пожалуйста, попробуй ещё раз:</p>
                             <ul className={isLightMode ? "space-y-1.5 pl-1.5 text-gray-600" : "space-y-1.5 pl-1.5 text-white/70"}>
                               <li>• Сделай фото при дневном свете, лицом к окну</li>
                               <li>• Смотри прямо в камеру, не наклоняй голову</li>
                               <li>• Убери волосы от лица и сними очки</li>
                             </ul>
                             <p className={isLightMode ? "pt-2 text-xs font-medium text-gray-500" : "pt-2 text-xs font-medium text-white/60"}>📌 Твоя генерация не была списана — ты можешь загрузить новое фото бесплатно.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                               <button onClick={resetApp} className={isLightMode ? "flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 shadow-sm py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2" : "flex-1 bg-white/10 hover:bg-white/15 border border-white/10 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"}>
                                 <RefreshCw size={16} />
                                 Загрузить новое фото
                               </button>
                               <button onClick={() => setIsFaqOpen(true)} className={isLightMode ? "flex-1 bg-transparent hover:bg-gray-100 border border-transparent text-gray-700 py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2" : "flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"}>
                                 <BookOpen size={16} />
                                 Гайд по съёмке
                               </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`border p-4 rounded-xl text-sm flex items-start gap-3 mt-2 ${isLightMode ? 'bg-red-50 text-red-600 border-red-100' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            <AlertCircle
                              size={18}
                              className="shrink-0 mt-0.5 opacity-80"
                            />
                            <p className="leading-relaxed whitespace-pre-line">{error}</p>
                          </div>
                        )
                      )}

                      {/* Style Selection */}
                      {!results &&
                        !error &&
                        !isAnalyzing &&
                        !isUploadingImage && (
                          <div className="mb-4">
                            <label className="block text-white/80 text-xs font-medium uppercase tracking-widest mb-3 opacity-80 text-center sm:text-left">
                              Выберите стиль:
                            </label>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 max-h-[140px] overflow-y-auto hide-scrollbar sm:max-h-none sm:overflow-visible pr-1 sm:pr-0">
                              {[
                                "Любой",
                                "Деловой",
                                "Романтичный",
                                "Креативный",
                                "Кэжуал",
                                "Спортивный",
                                "Дерзкий",
                                "Элегантный",
                              ].map((styleOpt) => (
                                <button
                                  key={styleOpt}
                                  onClick={() => setPreferredStyle(styleOpt)}
                                  className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                                    preferredStyle === styleOpt
                                      ? "bg-white/20 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                      : "glass-button hover:bg-white/10 text-white/70 border-white/10"
                                  }`}
                                >
                                  {styleOpt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Action Button */}
                      {!results && !error && (
                        <button
                          onClick={analyzeImage}
                          disabled={isAnalyzing || isUploadingImage}
                          className={`w-full font-medium py-4 sm:py-4 px-6 flex items-center justify-center gap-3 transition-all duration-500 uppercase tracking-widest text-[11px] sm:text-xs ${
                            isAnalyzing || isUploadingImage
                              ? "bg-white/10 text-white/40 border-transparent cursor-not-allowed rounded-full"
                              : "glass-button text-white/90 hover:bg-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.37)] border border-white/20 focus:ring-4 focus:ring-blue-500/50 active:scale-[0.98]"
                          }`}
                        >
                          {isUploadingImage
                            ? "Обработка фото..."
                            : isAnalyzing
                              ? "Нейросеть в работе..."
                              : "✨ Найти лучшую стрижку"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          {isAnalyzing && !results && (
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both">
              {/* Vitals Skeleton */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="glass-panel border border-white/10 rounded-2xl p-5 md:p-6 shadow-sm overflow-hidden"
                  >
                    <Skeleton className="w-16 h-3 rounded mb-4" />
                    <Skeleton className="w-5/6 h-6 rounded" />
                  </div>
                ))}
              </div>

              {/* Recommendations Skeleton */}
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <Skeleton className="w-48 h-6 rounded" />
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="flex flex-col gap-5 lg:gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="glass-panel border border-white/10 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-stretch"
                    >
                      <div className="w-full sm:w-[180px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 flex items-center justify-center p-6 bg-white/5">
                        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                          <Skeleton className="w-12 h-12 rounded-full mb-2" />
                          <Skeleton className="w-2/3 h-2 rounded" />
                          <Skeleton className="w-1/2 h-2 rounded" />
                        </div>
                      </div>
                      <div className="p-5 md:p-6 flex-1 flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="w-3/4 h-6 rounded" />
                          <Skeleton className="w-full h-4 rounded" />
                          <Skeleton className="w-5/6 h-4 rounded" />
                        </div>
                        <div className="space-y-2 pt-2">
                          <Skeleton className="w-1/4 h-3 rounded" />
                          <Skeleton className="w-2/3 h-4 rounded" />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Skeleton className="w-32 h-10 rounded-full" />
                          <Skeleton className="w-32 h-10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {results && (
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both">
              {results.warning && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-5 py-4 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm leading-relaxed">{results.warning}</p>
                </div>
              )}

              {/* Vitals */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="glass-panel border border-white/10 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                  </div>
                  <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-[0.15em] mb-3">
                    Форма лица
                  </p>
                  <p className="font-serif text-xl sm:text-2xl text-white/90 font-medium tracking-tight">
                    {results.faceShape}
                  </p>
                </div>

                <div className="glass-panel border border-white/10 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group hover:border-white/10 transition-colors delay-100">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                      <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  </div>
                  <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-[0.15em] mb-3">
                    Густота
                  </p>
                  <p className="font-serif text-xl sm:text-2xl text-white/90 font-medium tracking-tight">
                    {results.hairDensity}
                  </p>
                </div>

                <div className="glass-panel border border-white/10 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group hover:border-white/10 transition-colors delay-200">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-[0.15em] mb-3">
                    Текстура
                  </p>
                  <p className="font-serif text-xl sm:text-2xl text-white/90 font-medium tracking-tight">
                    {results.hairType}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <h3 className="font-serif text-xl italic text-white/90 px-4">
                    Рекомендации ИИ
                  </h3>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="flex flex-col gap-5 lg:gap-6 pb-6">
                  {results.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="opacity-0 animate-fade-in-up glass-panel border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] group flex flex-col sm:flex-row items-stretch"
                      style={{ animationDelay: `${300 + idx * 150}ms` }}
                    >
                      <div className="w-full sm:w-[300px] shrink-0 relative overflow-hidden bg-transparent text-white/90 border-b sm:border-b-0 sm:border-r border-white/10">
                        <div className="w-full aspect-[4/5] relative">
                          <LazyImage
                            keyword={rec.imageKeyword}
                            gender={results?.gender || ""}
                            uniqueName={rec.name}
                            description={rec.description}
                            results={results}
                            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent sm:hidden pointer-events-none z-10"></div>
                          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/5 backdrop-blur-md backdrop-blur-md flex items-center justify-center text-white/90 text-xs font-medium border border-white/10 z-20 shadow-sm">
                            {idx + 1}
                          </div>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-center">
                        <div>
                          <h4 className="text-2xl font-serif text-white/90 font-medium tracking-tight mb-2 group-hover:text-white/90/80 transition-colors">
                            {rec.name}
                          </h4>
                          <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                            {rec.description}
                          </p>
                        </div>

                        <div className="bg-transparent text-white/90 p-4 rounded-xl border border-white/10 mt-auto group-hover:bg-white/5 transition-colors">
                          <h5 className="text-[10px] uppercase tracking-widest text-white/60 mb-2 font-medium flex items-center gap-2">
                            <Sparkles size={12} /> Совет стилиста
                          </h5>
                          <p className="text-white/90/80 text-sm font-light leading-relaxed">
                            {rec.stylingTips}
                          </p>
                        </div>

                        <button
                          onClick={() => setTryOnStyle(rec)}
                          className="mt-4 text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3.5 sm:py-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-95 w-full lg:w-auto self-start"
                        >
                          <Maximize2 size={16} /> Показать парикмахеру (гайд)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMoreRecommendations}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 text-white/90 glass-panel hover:bg-white/5 border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.37)] px-6 py-4 transition-all font-medium text-sm sm:text-base disabled:opacity-50"
                  >
                    <RefreshCw
                      size={16}
                      className={isLoadingMore ? "animate-spin" : ""}
                    />
                    {isLoadingMore
                      ? "Поиск вариантов..."
                      : "Найти другие крутые варианты"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Barber Blueprint Modal */}
      {tryOnStyle && (
        <div className="fixed inset-0 z-[100] flex sm:items-center sm:justify-center bg-black/60 sm:bg-white/10 sm:backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f0c1b] sm:glass-panel border-t sm:border border-white/10 sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] flex flex-col shadow-2xl relative">
            <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-[#0f0c1b] sm:bg-transparent sticky top-0 z-50">
              <h3 className="font-serif text-xl sm:text-2xl text-white/90 flex items-center gap-3 tracking-tight">
                <Scissors className="text-white/60" size={24} />
                Детальный гайд для парикмахера
              </h3>
              <button
                onClick={() => setTryOnStyle(null)}
                aria-label="Закрыть гайд"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto custom-scrollbar">
              {/* Technical Details */}
              <div className="lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
                <div>
                  <h4 className="text-2xl font-serif text-white/90 mb-2 tracking-tight">
                    {tryOnStyle.name}
                  </h4>
                  <p className="text-sm font-light text-white/60 leading-relaxed mb-6">
                    Покажите этот экран вашему мастеру для точного воплощения
                    задуманного образа. Эта стрижка подобрана с учетом вашей
                    геометрии лица и текущей структуры волос.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-transparent text-white/90 border border-white/10 rounded-xl p-5">
                    <h5 className="text-[10px] uppercase tracking-widest text-white/60 mb-3 font-medium flex items-center gap-2">
                      <Zap size={14} /> Ключевые зоны
                    </h5>
                    <ul className="space-y-3 text-sm font-light text-white/90/80">
                      <li className="flex gap-2">
                        <span className="text-white/60">•</span>
                        <span>
                          <strong>Структура волос:</strong> {results.hairType},{" "}
                          {results.hairDensity.toLowerCase()}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-white/60">•</span>
                        <span>
                          <strong>Верхняя зона:</strong> Оставить длину для
                          текстуры, профилировать по необходимости.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-white/60">•</span>
                        <span>
                          <strong>Бока и затылок:</strong> Плавный переход
                          (fade) или укорачивание, чтобы подчеркнуть форму лица
                          ({results.faceShape.toLowerCase()}).
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-transparent text-white/90 border border-white/10 rounded-xl p-5">
                    <h5 className="text-[10px] uppercase tracking-widest text-white/60 mb-3 font-medium flex items-center gap-2">
                      <Sparkles size={14} /> Стайлинг (для мастера)
                    </h5>
                    <p className="text-sm font-light text-white/90/80 leading-relaxed">
                      {tryOnStyle.stylingTips}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10">
                  <button
                    onClick={() => setTryOnStyle(null)}
                    className="w-full bg-white/5 text-white/90 font-medium py-4 px-6 rounded-full hover:bg-white/10 transition-colors active:scale-95 text-base"
                  >
                    ✕ Вернуться к вариантам
                  </button>
                </div>
              </div>

              {/* Visual References */}
              <div className="flex-1 lg:pl-8 lg:border-l border-white/10 order-1 lg:order-2">
                <h4 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-6 flex justify-between items-center">
                  <span>Side-by-side визуализация</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-auto">
                  {/* Original Input */}
                  <div className="relative glass-panel rounded-2xl overflow-hidden border border-white/10 group aspect-[4/5] sm:aspect-auto sm:h-[400px] lg:h-[500px] flex items-center justify-center shadow-sm bg-black/40">
                    <img
                      src={`data:${mimeType || "image/jpeg"};base64,${imageBase64}`}
                      alt="Ваша база"
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-[10px] sm:text-xs text-white uppercase tracking-wider font-medium drop-shadow-md">
                        Ваша база
                      </span>
                      <p className="text-[9px] sm:text-[10px] text-white mt-0.5 sm:mt-1 hidden sm:block drop-shadow-md">
                        Отправная точка стрижки
                      </p>
                    </div>
                  </div>

                  {/* Reference Output */}
                  <div className="relative glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-sm group aspect-[4/5] sm:aspect-auto sm:h-[400px] lg:h-[500px] flex items-center justify-center bg-black/40">
                    <LazyImage
                      keyword={tryOnStyle.imageKeyword}
                      gender={results?.gender || ""}
                      uniqueName={tryOnStyle.name}
                      description={tryOnStyle.description}
                      autoLoad={true}
                      results={results}
                      className={`absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105`}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-[10px] sm:text-xs text-white uppercase tracking-wider font-medium drop-shadow-md">
                        Целевой стиль
                      </span>
                      <p className="text-[9px] sm:text-[10px] text-white mt-0.5 sm:mt-1 hidden sm:block drop-shadow-md">
                        Референс результата
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {styleConsultations[tryOnStyle.imageKeyword] && (
                    <div
                      id="hairdresser-guide-content"
                      className="mb-4 bg-white/5 border border-white/10 rounded-2xl p-5 text-white/90 relative"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                        <h4 className="flex items-center gap-2 font-medium text-sm uppercase tracking-widest text-white/80">
                          <Sparkles size={16} /> Персональный гайд (AI)
                        </h4>
                        <button
                          onClick={exportToPDF}
                          disabled={isExportingPDF}
                          className="flex items-center justify-center gap-1.5 text-[11px] font-semibold bg-white/10 hover:bg-white/20 border border-white/10 text-white/90 px-3.5 py-2 rounded-full transition-all active:scale-[0.98] w-full sm:w-auto"
                          title="Скачать гайд в PDF формате для печати"
                        >
                          <FileDown size={14} />
                          {isExportingPDF
                            ? "Подготовка PDF..."
                            : "Экспорт в PDF"}
                        </button>
                      </div>
                      <div
                        className="text-white/90 text-sm font-light leading-relaxed space-y-4 font-sans
                                   [&>strong]:font-medium [&>strong]:text-white 
                                   [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1"
                        dangerouslySetInnerHTML={{
                          __html: styleConsultations[tryOnStyle.imageKeyword],
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() =>
                      generateARPreview(
                        tryOnStyle.imageKeyword,
                        tryOnStyle.name,
                      )
                    }
                    disabled={loadingARStyles[tryOnStyle.imageKeyword]}
                    className="w-full glass-button hover:bg-white/10 text-white/90 font-medium py-4 px-6 rounded-full transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 text-sm sm:text-base"
                  >
                    <Sparkles size={18} />
                    {loadingARStyles[tryOnStyle.imageKeyword]
                      ? "Генерация..."
                      : styleConsultations[tryOnStyle.imageKeyword]
                        ? "🔄 Обновить персональный гайд"
                        : "📝 Сгенерировать персональный гайд"}
                  </button>
                  {arError && (
                    <p className="text-xs text-orange-200/90 bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-lg text-center leading-relaxed">
                      {arError}
                    </p>
                  )}

                  {/* Virtual Try-On Section */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                    {vtonResultUrl && (
                      <div className="mb-4 bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-white/90 relative group">
                        <BeforeAfterSlider 
                          beforeImage={imageUrl || `data:${mimeType || "image/jpeg"};base64,${imageBase64}`}
                          afterImage={vtonResultUrl}
                        />
                        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shareResult(vtonResultUrl);
                            }}
                            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-black/70 shadow-xl"
                            title="Поделиться результатом"
                          >
                            <Send size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(vtonResultUrl, "ai_result.jpg");
                            }}
                            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-black/70 shadow-xl"
                            title="Сохранить результат"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                           <button 
                             onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                   const beforeSrc = imageUrl || `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
                                   const collageDataUrl = await generateCollage(beforeSrc, vtonResultUrl);
                                   
                                   // Check if we can share file
                                   if (navigator.share) {
                                      try {
                                         const res = await fetch(collageDataUrl);
                                         const blob = await res.blob();
                                         const file = new File([blob], "neurostylist_collage.jpg", { type: "image/jpeg" });
                                         await navigator.share({
                                            title: "Мой новый стиль от НейроСтилиста",
                                            files: [file]
                                         });
                                      } catch (e) {
                                         // Fallback to download
                                         downloadImage(collageDataUrl, "ai_collage.jpg");
                                      }
                                   } else {
                                      downloadImage(collageDataUrl, "ai_collage.jpg");
                                   }
                                } catch (err) {
                                   console.error("Collage error", err);
                                   alert("Не удалось создать коллаж");
                                }
                             }}
                             className="flex-1 py-3 px-4 rounded-xl bg-orange-500/20 text-orange-300 font-medium border border-orange-500/30 hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-2"
                           >
                              <Download size={16} />
                              <span>Экспорт Коллажа</span>
                           </button>
                           <button 
                             onClick={(e) => {
                                e.stopPropagation();
                                setChatStyleName(tryOnStyle?.name || tryOnStyle?.ru);
                                setIsChatOpen(true);
                             }}
                             className="flex-1 py-3 px-4 rounded-xl bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
                           >
                              <Sparkles size={16} />
                              <span>Спросить Стилиста</span>
                           </button>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pb-3 justify-center mb-3">
                      {[
                        "Блонд",
                        "Русый",
                        "Каштановый",
                        "Черный",
                        "Рыжий",
                        "Седой",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => setCustomHairColor(color)}
                          className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all border ${
                            customHairColor === color
                              ? "bg-blue-500 text-white border-blue-400"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                      {customHairColor && (
                        <button
                          onClick={() => setCustomHairColor(null)}
                          className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all border bg-red-500/20 text-red-200 border-red-500/30 hover:bg-red-500/30"
                        >
                          Сбросить
                        </button>
                      )}
                    </div>

                    {/* Slider for transformation strength */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1 text-xs text-gray-300">
                        <span>Уровень вмешательства ИИ:</span>
                        <span className="font-semibold">{vtonStrength}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={vtonStrength}
                        onChange={(e) =>
                          setVtonStrength(Number(e.target.value))
                        }
                        className="w-full accent-blue-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span className="max-w-[100px] text-left leading-tight">
                          Только цвет / Легкая укладка
                        </span>
                        <span className="max-w-[100px] text-right leading-tight">
                          Замена лица на модель (Студия)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        generateVirtualTryOn(
                          tryOnStyle.imageKeyword,
                          tryOnStyle.name,
                          tryOnStyle.description,
                          customHairColor,
                          tryOnStyle.imageUrl,
                        )
                      }
                      disabled={loadingVTONStyles[tryOnStyle.imageKeyword]}
                      style={{ color: "#ffffff" }}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-medium py-4 px-6 rounded-full transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-sm sm:text-base vton-generate-btn"
                    >
                      <Sparkles size={18} fill="currentColor" />
                      {loadingVTONStyles[tryOnStyle.imageKeyword]
                        ? "Генерация виртуальной примерки..."
                        : "📸 Виртуальная примерка (Beta)"}
                    </button>
                    {vtonError && (
                      <p className="text-xs text-orange-200/90 bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-lg text-center leading-relaxed">
                        {vtonError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
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
      )}

      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center">
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white/60" />
            </button>
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent mb-6 mt-2 flex items-center gap-2">
               <Star size={24} className="text-amber-400 fill-current" />
              Пополнить баланс
            </h2>
            <div className="flex flex-col gap-4 w-full">
              {[
                { count: 5, stars: 50 },
                { count: 10, stars: 100 },
                { count: 30, stars: 250 },
              ].map(pkg => (
                <button
                  key={pkg.count}
                  onClick={() => processPayment(pkg.count, pkg.stars)}
                  disabled={isBuying}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <div className="flex flex-col items-start gap-1">
                     <span className="font-bold text-white/90 text-lg">{pkg.count} генераций</span>
                     <span className="text-xs text-white/50">{Math.round((pkg.stars / pkg.count) * 10) / 10} ⭐️ за генерацию</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                    <span className="font-bold text-amber-500">{pkg.stars}</span>
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-[10px] text-white/40 mt-6 text-center">
              Оплата производится во внутренней валюте Telegram (Stars). Звёзды списываются с вашего баланса Telegram.
            </p>
          </div>
        </div>
      )}

      {isFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsFaqOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white/60" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <HelpCircle size={20} />
              </div>
              <h2 className="text-xl font-medium">Частые вопросы</h2>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {faqData.length > 0 ? faqData.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="font-medium text-white/90 mb-2">{item.q}</h3>
                  <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{item.a}</p>
                </div>
              )) : (
                <div className="text-center py-6 text-white/40">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  <p>Загрузка вопросов...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 pb-2 border-b border-white/5 sticky top-0 bg-[#111]/90 backdrop-blur-md z-10 flex justify-between items-center">
               <h2 className="text-lg sm:text-xl font-medium text-white flex items-center gap-2">
                <span className="text-2xl">👋</span> Привет!
               </h2>
               <button
                onClick={() => {
                  setShowWelcome(false);
                  localStorage.setItem("welcomeShown", "true");
                }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>
            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar text-white/80 space-y-5 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-white/90 text-[15px] sm:text-[16px]">Я — НейроСтилист, твой карманный эксперт по причёскам.</p>
              
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <p>Я помогу тебе:</p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2"><span className="text-blue-400">✨</span> <span>Определить идеальную стрижку под форму лица</span></li>
                  <li className="flex items-start gap-2"><span className="text-blue-400">✨</span> <span>Увидеть себя в новом образе за 15 секунд</span></li>
                  <li className="flex items-start gap-2"><span className="text-blue-400">✨</span> <span>Перестать бояться экспериментов с волосами</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white/90 mb-2 px-1 flex items-center gap-2 uppercase text-xs tracking-wider border-b border-white/10 pb-2">
                     <span className="text-base">🎁</span> Что бесплатно всегда:
                  </h3>
                  <ul className="space-y-1 px-1 text-white/70">
                    <li>• Анализ формы лица и рекомендации стилиста</li>
                    <li>• Гайды по подбору стрижки под твой тип лица</li>
                    <li>• Галерея референсов (фото-примеры стрижек)</li>
                    <li>• Шкала вмешательства ИИ при генерации</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-white/90 mb-2 px-1 flex items-center gap-2 uppercase text-xs tracking-wider border-b border-white/10 pb-2">
                    <span className="text-base">⭐</span> Что оплачивается звёздами:
                  </h3>
                  <ul className="space-y-1 px-1 text-white/70">
                    <li>• Только сама генерация примерки на твоём фото</li>
                    <li>• <i>У тебя есть 5 бесплатных генераций для старта</i></li>
                    <li>• Дополнительные пакеты: 5, 10 или 30 генераций</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#1a1a1f] p-4 rounded-2xl border border-[#2a2a35] mt-4">
                <h3 className="font-bold text-white/90 mb-3 flex items-center gap-2 text-[15px]">
                  <span className="text-xl">📸</span> Как сделать правильное фото:
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-green-400 font-medium mb-1.5 text-sm flex items-center gap-1"><span className="text-base">✅</span> Нужно:</h4>
                    <ul className="text-[13px] text-white/60 space-y-1">
                      <li>• Дневной свет или яркое освещение спереди</li>
                      <li>• Лицо строго анфас, без наклона головы</li>
                      <li>• Волосы убраны от лица (за уши/в хвост)</li>
                      <li>• Нейтральное выражение лица, без улыбки</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-400 font-medium mb-1.5 text-sm flex items-center gap-1"><span className="text-base">❌</span> Нельзя:</h4>
                    <ul className="text-[13px] text-white/60 space-y-1">
                      <li>• Солнечные очки или маска на лице</li>
                      <li>• Селфи в темноте или при тусклом свете</li>
                      <li>• Сильный поворот головы (профиль, 3/4)</li>
                      <li>• Размытое или зернистое фото</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-[13px] text-blue-200/90 leading-tight">
                    <span className="font-bold">📌 Совет:</span> попроси кого-то сфотографировать тебя на уровне глаз — это даст лучший результат, чем селфи с вытянутой руки.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-[#0a0a0f]">
               <button
                className="w-full bg-[#2AABEE] hover:bg-[#2298d6] text-white font-medium py-3.5 rounded-2xl transition-colors text-[15px] sm:text-base outline-none flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20"
                onClick={() => {
                  setShowWelcome(false);
                  localStorage.setItem("welcomeShown", "true");
                }}
              >
                <span>Готов(а)? Начать!</span>
                <span className="text-lg">💇‍♀️💇‍♂️</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isChatOpen && results && (
        <StylistChat 
           onClose={() => setIsChatOpen(false)}
           features={results}
           styleName={chatStyleName}
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
