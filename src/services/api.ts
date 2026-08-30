import { AnalysisResult } from '../types';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<Response> {
  const isDev = localStorage.getItem("isDeveloperMode") === "true";
  options.credentials = 'include';
  if (isDev) {
    options.headers = { ...options.headers, "X-Developer-Mode": "true" };
  }

  let finalUrl = url;
  // Добавляем анти-кэш только для GET-запросов
  if (!options?.method || options.method.toUpperCase() === 'GET') {
      const separator = url.includes('?') ? '&' : '?';
      // Приклеиваем уникальную метку времени к URL
      finalUrl = `${url}${separator}_t=${Date.now()}`;
      options = { ...options, cache: 'no-store' };
  }

  try {
    const response = await fetch(finalUrl, options);
    // Do not retry 4xx errors, only 5xx or network errors
    if (!response.ok && response.status >= 500 && retries > 0) {
      console.warn(`Server error ${response.status}. Retrying in ${backoff}ms...`);
      await new Promise(r => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    if (retries > 0) {
      console.warn(`Network error. Retrying in ${backoff}ms...`);
      await new Promise(r => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: `[fetchWithRetry] Network error (${finalUrl}): ${err.message}`,
          userId: localStorage.getItem('userId') || 'unknown'
        })
    }).catch(() => {});
    throw err;
  }
}


export const analyzeImageApi = async (
  formData: FormData,
  telegramInitData?: string,
  signal?: AbortSignal
) => {
  let response: Response;
  try {
    response = await fetchWithRetry("/api/analyze", {
      method: "POST",
      headers: {
        ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {})
      },
      signal,
      body: formData,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    throw new Error(`Ошибка сети: Сервер недоступен (Failed to fetch). Попытайтесь позже.`);
  }

  let data: any = {};
  let textResponse = "";
  try {
    textResponse = await response.text();
    data = JSON.parse(textResponse);
  } catch (e) {
    if (textResponse.trim().toLowerCase().startsWith("<!doctype html>")) {
       throw new Error(`Ошибка сессии (Cookie Proxy). Пожалуйста, обновите страницу (потяните вниз) или откройте приложение заново. Код: ${response.status}`);
    }
    throw new Error(`Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`);
  }

  if (!response.ok) {
    if (response.status === 429 && data.fallback) {
      throw { isFallback: true, message: data.error };
    }
    throw new Error(typeof data.error === "object" ? JSON.stringify(data.error) : data.error || "Ошибка при анализе фото. Попробуйте еще раз.");
  }

  return data;
};

export const generateArApi = async (
  styleKeyword: string, 
  styleName: string, 
  results: AnalysisResult | null,
  telegramInitData?: string
) => {
  const response = await fetchWithRetry("/api/generate-ar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {})
    },
    body: JSON.stringify({
      styleKeyword,
      styleName,
      gender: results?.gender || "unknown",
      features: results,
    }),
  });

  let data: any = {};
  let textResponse = "";
  try {
    textResponse = await response.text();
    data = JSON.parse(textResponse);
  } catch (e) {
    if (textResponse.includes("<!doctype html>") || textResponse.includes("<!DOCTYPE html>")) {
       throw new Error(`Ошибка сессии (Cookie Proxy). Пожалуйста, обновите страницу (потяните вниз) или откройте приложение заново. Код: ${response.status}`);
    }
    throw new Error(`Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`);
  }

  if (!response.ok) {
    throw new Error(typeof data.error === "object" ? JSON.stringify(data.error) : data.error || "Ошибка от сервера при генерации примерки.");
  }
  return data;
};

export const loadMoreApi = async (
  userId: string,
  existingNames: string[],
  results: AnalysisResult | null,
  preferredStyle: string,
  telegramInitData?: string
) => {
  const isDev = localStorage.getItem("isDeveloperMode") === "true";
  const response = await fetchWithRetry("/api/load-more", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {}),
      ...(isDev ? { "x-developer-mode": "true" } : {})
    },
    body: JSON.stringify({
      userId,
      existingNames,
      features: results,
      preferredStyle,
    }),
  });

  let data: any = {};
  let textResponse = "";
  try {
    textResponse = await response.text();
    data = JSON.parse(textResponse);
  } catch (e) {
    if (textResponse.includes("<!doctype html>") || textResponse.includes("<!DOCTYPE html>")) {
       throw new Error(`Ошибка сессии (Cookie Proxy). Пожалуйста, обновите страницу (потяните вниз) или откройте приложение заново. Код: ${response.status}`);
    }
    throw new Error(`Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`);
  }

  if (!response.ok) {
    throw new Error(typeof data.error === "object" ? JSON.stringify(data.error) : data.error || "Ошибка при генерации новых вариантов от сервера.");
  }
  return data;
};

export const generateFullApi = async (
  formData: FormData,
  telegramInitData?: string,
  signal?: AbortSignal
) => {
  const isDev = localStorage.getItem("isDeveloperMode") === "true";
  if (isDev) {
    formData.append("isDeveloper", "true");
  }
  let response: Response;
  try {
    response = await fetchWithRetry("/api/generate-full/start", {
      method: "POST",
      headers: {
        ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {}),
        ...(isDev ? { "x-developer-mode": "true" } : {})
      },
      signal,
      body: formData,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    throw new Error(`Ошибка сети: Сервер недоступен (Failed to fetch). Попытайтесь позже.`);
  }

  let data: any = {};
  let textResponse = "";
  try {
    textResponse = await response.text();
    data = JSON.parse(textResponse);
  } catch (e) {
    if (textResponse.includes("<!doctype html>") || textResponse.includes("<!DOCTYPE html>")) {
       throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error, HTTP ${response.status}). Пожалуйста, подождите немного и повторите попытку.`);
    }
    throw new Error(
      `Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`
    );
  }

  if (!response.ok) {
    throw new Error(typeof data.error === "object" ? JSON.stringify(data.error) : data.error || "Ошибка от сервера при инициализации генерации.");
  }
  
  console.log('[api] Generation response:', data);
  console.log('[api] JobId from response:', data.jobId);

  if (data.imageUrl) {
    return data;
  }
  
  if (data.status === 'completed' && data.result) {
    return data.result;
  }

  const jobId = data.jobId;
  if (!jobId) {
    throw new Error("Не удалось получить результат генерации от сервера.");
  }

  // Bounded polling for job status
  let attempts = 0;
  const maxAttempts = 75; // 30 * 4 = 120 seconds
  while (attempts < maxAttempts) {
    if (signal?.aborted) {
        const err = new Error("AbortError");
        err.name = "AbortError";
        throw err;
    }
    await new Promise(r => setTimeout(r, 4000));
    try {
      const pollRes = await fetch(`/api/job/${jobId}`, { signal });
      if (pollRes.ok) {
        const pollData = await pollRes.json();
        if (pollData.status === "done") {
          return {
            imageUrl: pollData.imageUrl,
            originalUrl: pollData.originalUrl,
            referenceImage: pollData.referenceImage
          };
        } else if (pollData.status === "error") {
          throw new Error(pollData.error || "Ошибка во время генерации.");
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError" || e.message === "AbortError") throw e;
      console.warn("Polling error:", e);
    }
    attempts++;
  }

  return { isAsync: true, jobId };
};


