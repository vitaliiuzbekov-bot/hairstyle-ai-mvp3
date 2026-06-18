import { AnalysisResult } from '../types';

export const analyzeImageApi = async (formData: FormData, telegramInitData?: string) => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {})
    },
    body: formData,
  });

  if (!response.ok) {
    let errData: any = {};
    try {
      errData = await response.json();
    } catch (e) {}
    
    if (response.status === 429 && errData.fallback) {
      throw { isFallback: true, message: errData.error };
    }

    throw new Error(errData.error || "Ошибка при анализе фото. Попробуйте еще раз.");
  }

  return response.json();
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

  if (!response.ok) {
    let errData: any = {};
    try {
      errData = await response.json();
    } catch (e) {}
    throw new Error(errData.error || "Ошибка от сервера при генерации примерки.");
  }
  return response.json();
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

  if (!response.ok) {
    let errData: any = {};
    try {
      errData = await response.json();
    } catch (e) {}
    throw new Error(errData.error || "Ошибка при генерации новых вариантов от сервера.");
  }
  return response.json();
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
      `Ошибка сервера: HTTP ${response.status}. Ответ: ${textResponse.slice(0, 50)}`,
    );
  }

  if (!response.ok) {
    throw new Error(data.error || "Ошибка от сервера при генерации детального отчета.");
  }

  return data;
};
