import { AnalysisResult } from '../types';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<Response> {
  const isDev = localStorage.getItem("isDeveloperMode") === "true";
  if (isDev) {
    options.headers = { ...options.headers, "X-Developer-Mode": "true" };
  }
  try {
    const response = await fetch(url, options);
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
       throw new Error(`Сбой сети: Сервер перегружен или вернул HTML-страницу (Код ${response.status}). Возможно, вы загружаете слишком большое фото (>15МБ). Попробуйте еще раз.`);
    }
    throw new Error(`Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`);
  }

  if (!response.ok) {
    if (response.status === 429 && data.fallback) {
      throw { isFallback: true, message: data.error };
    }
    throw new Error(data.error || "Ошибка при анализе фото. Попробуйте еще раз.");
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
       throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error, HTTP ${response.status}). Пожалуйста, подождите немного и повторите попытку.`);
    }
    throw new Error(`Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`);
  }

  if (!response.ok) {
    throw new Error(data.error || "Ошибка от сервера при генерации примерки.");
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
       throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error, HTTP ${response.status}). Пожалуйста, подождите немного и повторите попытку.`);
    }
    throw new Error(`Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`);
  }

  if (!response.ok) {
    throw new Error(data.error || "Ошибка при генерации новых вариантов от сервера.");
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
    response = await fetchWithRetry("/api/generate-full", {
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
    throw new Error(data.error || "Ошибка от сервера при генерации детального отчета.");
  }

  return data;
};
