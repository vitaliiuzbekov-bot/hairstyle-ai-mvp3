const fs = require('fs');
const file = 'src/services/api.ts';
let code = fs.readFileSync(file, 'utf8');

const analyzeStart = 'export const analyzeImageApi = async (formData: FormData, telegramInitData?: string) => {\n  const response = await fetch("/api/analyze", {';
const analyzeApiRegex = /export const analyzeImageApi = async \([\s\S]*?return data;\n\};/;

const newAnalyzeApi = `export const analyzeImageApi = async (
  formData: FormData,
  telegramInitData?: string,
  signal?: AbortSignal
) => {
  let response: Response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        ...(telegramInitData ? { "X-Telegram-Init-Data": telegramInitData } : {})
      },
      signal,
      body: formData,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    throw new Error(\`Ошибка сети: Сервер недоступен (Failed to fetch). Попытайтесь позже.\`);
  }

  let data: any = {};
  let textResponse = "";
  try {
    textResponse = await response.text();
    data = JSON.parse(textResponse);
  } catch (e) {
    if (textResponse.includes("<!doctype html>") || textResponse.includes("<!DOCTYPE html>")) {
       throw new Error(\`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error). Пожалуйста, подождите немного и повторите попытку.\`);
    }
    throw new Error(\`Ошибка сервера: HTTP \${response.status}. Ответ: \${textResponse.slice(0, 50)}\`);
  }

  if (!response.ok) {
    if (response.status === 429 && data.fallback) {
      throw { isFallback: true, message: data.error };
    }
    throw new Error(data.error || "Ошибка при анализе фото. Попробуйте еще раз.");
  }

  if (data.jobId) {
    // Polling mechanism
    while (true) {
      if (signal?.aborted) throw new Error("Aborted");
      await new Promise(r => setTimeout(r, 3000));
      try {
          const pollRes = await fetch(\`/api/analyze/job/\${data.jobId}\`);
          if (!pollRes.ok) {
             throw new Error(\`Polling Error HTTP \${pollRes.status}\`);
          }
          const pollData = await pollRes.json();
          if (pollData.status === 'completed') {
             return pollData.result;
          } else if (pollData.status === 'error') {
             throw new Error(pollData.error || "Ошибка в фоновой задаче анализа");
          }
      } catch (pollErr: any) {
          if (pollErr.name === 'AbortError') throw pollErr;
          console.warn("Poll failed, retrying...", pollErr);
          // Just retry polling on network fail (we could add a limit)
      }
    }
  }

  return data;
};`;

code = code.replace(analyzeApiRegex, newAnalyzeApi);
fs.writeFileSync(file, code);
console.log("api.ts patched");
