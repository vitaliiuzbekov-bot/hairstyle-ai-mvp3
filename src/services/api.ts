import { AnalysisResult } from '../types';

export const analyzeImageApi = async (formData: FormData, telegramInitData?: string) => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {})
    },
    body: formData,
  });

  let data: any = {};
  let textResponse = "";
  try {
    textResponse = await response.text();
    data = JSON.parse(textResponse);
  } catch (e) {
    if (textResponse.includes("<!doctype html>") || textResponse.includes("<!DOCTYPE html>")) {
       throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error). Пожалуйста, подождите немного и повторите попытку.`);
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
  const response = await fetch("/api/generate-ar", {
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
       throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error). Пожалуйста, подождите немного и повторите попытку.`);
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
  const response = await fetch("/api/load-more", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {})
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
       throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error). Пожалуйста, подождите немного и повторите попытку.`);
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
  let response: Response;
  try {
    response = await fetch("/api/generate-full", {
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
    if (textResponse.includes("<!doctype html>") || textResponse.includes("<!DOCTYPE html>")) {
       throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error). Пожалуйста, подождите немного и повторите попытку.`);
    }
    throw new Error(
      `Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`
    );
  }

  if (!response.ok) {
    throw new Error(data.error || "Ошибка от сервера при генерации детального отчета.");
  }

  if (data.jobId) {
    // Polling mechanism
    while (true) {
      if (signal?.aborted) throw new Error("Aborted");
      await new Promise(r => setTimeout(r, 3000));
      try {
          const pollRes = await fetch(`/api/job/${data.jobId}`);
          if (!pollRes.ok) {
             throw new Error(`Polling Error HTTP ${pollRes.status}`);
          }
          const pollData = await pollRes.json();
          if (pollData.status === 'completed') {
             return pollData.result;
          } else if (pollData.status === 'error') {
             throw new Error(pollData.error || "Ошибка в фоновой задаче");
          }
      } catch (pollErr: any) {
          if (pollErr.name === 'AbortError') throw pollErr;
          console.warn("Poll failed, retrying...", pollErr);
          // Just retry polling on network fail (we could add a limit)
      }
    }
  }

  return data;
};
