import React, { useState, useEffect, useCallback, memo } from "react";
import localforage from "localforage";
import { Skeleton } from "./Skeleton";
import { Download, AlertCircle, Image as ImageIcon } from "lucide-react";
import { downloadImage } from "../utils/downloadImage";
import { AnalysisResult } from "../types";
import { CachedImage } from "./CachedImage";

const globalImageCache: Record<string, string> = {};

export const LazyImage = memo(({
  keyword,
  gender,
  uniqueName,
  description,
  className,
  autoLoad = false,
  results,
  onImageLoaded,
}: {
  keyword: string;
  gender: string;
  uniqueName: string;
  description?: string;
  className?: string;
  autoLoad?: boolean;
  results?: AnalysisResult;
  onImageLoaded?: (url: string) => void;
}) => {
  const cacheKey = `${gender}_${keyword}_v2_${results?.ageRange || ""}_${results?.hairlineStatus || ""}_${results?.hairDensity || ""}_${results?.hairColor || ""}`;
  const [loadedUrl, setLoadedUrl] = useState<string | null>(
    globalImageCache[cacheKey] || null,
  );

  useEffect(() => {
    // Attempt to load from localforage if not in memory cache
    if (!loadedUrl) {
      localforage.getItem<string>(`genRef_${cacheKey}`).then((cachedUrl) => {
        if (cachedUrl) {
          globalImageCache[cacheKey] = cachedUrl;
          setLoadedUrl(cachedUrl);
        }
      });
    }
  }, [cacheKey, loadedUrl]);

  useEffect(() => {
    if (loadedUrl && onImageLoaded) {
      onImageLoaded(loadedUrl);
    }
  }, [loadedUrl, onImageLoaded]);

  const [isLoading, setIsLoading] = useState(
    autoLoad && !globalImageCache[cacheKey],
  );
  const [errorString, setErrorString] = useState<string | null>(null);

  const generateImage = useCallback(async () => {
    if (globalImageCache[cacheKey]) {
      setLoadedUrl(globalImageCache[cacheKey]);
      setIsLoading(false);
      return;
    }

    try {
      const cachedUrl = await localforage.getItem<string>(`genRef_${cacheKey}`);
      if (cachedUrl) {
        globalImageCache[cacheKey] = cachedUrl;
        setLoadedUrl(cachedUrl);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Failed to check localforage:', e);
    }

    setIsLoading(true);
    setErrorString(null);

    try {
      const initData = (window as any).Telegram?.WebApp?.initData || "";
      const response = await fetch("/api/generate-reference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(initData ? { "x-telegram-init-data": initData } : {}),
        },
        body: JSON.stringify({
          keyword,
          gender,
          haircutName: uniqueName,
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
          hairlineStatus: results?.hairlineStatus,
          hairQuality: results?.hairQuality,
          description: description,
        }),
      });

      let data: any = {};
      const textResponse = await response.text();
      try {
          data = JSON.parse(textResponse);
      } catch(e) {
          throw new Error("Invalid format from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      if (data.imageUrl) {
        globalImageCache[cacheKey] = data.imageUrl;
        setLoadedUrl(data.imageUrl);
        localforage.setItem(`genRef_${cacheKey}`, data.imageUrl).catch(e => console.warn('Cache save failed', e));
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
  }, [cacheKey, keyword, gender, results, uniqueName]);

  useEffect(() => {
    if (autoLoad) {
      const t = setTimeout(() => generateImage(), Math.random() * 500);
      return () => clearTimeout(t);
    }
  }, [keyword, gender, uniqueName, autoLoad, generateImage]);

  if (loadedUrl) {
    return (
      <div className="relative w-full h-full group/lazy flex">
        <CachedImage
          src={loadedUrl || undefined as any}
          alt={uniqueName}
          className={`w-full h-full ${className || "object-cover"}`}
          style={{ display: "block", width: "100%", height: "100%" }}
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
