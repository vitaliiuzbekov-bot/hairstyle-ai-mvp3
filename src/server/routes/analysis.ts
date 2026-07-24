import crypto from "crypto";
import { Request, Response, Router } from "express";
import { logToTelegram } from "../services/logger";
import { callLLM } from "../services/llm";
import { safeParseJSON } from "../utils/json";
import { geminiQueue, withRetry } from "../utils/queues";
import { createRateLimiter } from "../utils/rateLimiter";
import { MALE_LIBRARY, FEMALE_LIBRARY } from "../../data/haircutLibrary";

export const analysisRouter = Router();

const analyzeJobMap = new Map<string, { status: 'processing' | 'completed' | 'error', result?: any, error?: string }>();

analysisRouter.get("/analyze-job/:jobId", (req, res) => {
  const { jobId } = req.params;
  if (!analyzeJobMap.has(jobId)) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(analyzeJobMap.get(jobId));
});

// Max 5 analysis requests per 10 minutes per user
const analyzeLimiter = createRateLimiter(10 * 60 * 1000, 5);

async function fetchImageAsBase64(url: string | null, fallbackBase64: string | null): Promise<string | null> {
  if (fallbackBase64) return fallbackBase64;
  if (!url) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    const fetchRes = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (fetchRes.ok) {
      const buffer = await fetchRes.arrayBuffer();
      return Buffer.from(buffer).toString('base64');
    }
  } catch (e) {
    console.error("Failed to fetch image from URL:", e);
  }
  return null;
}

analysisRouter.post("/analyze", analyzeLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageUrl, mimeType, faceApiGender, faceApiShape, faceApiAge } = req.body;
    let imageBase64 = req.body.imageBase64;
    let preferredStyle = req.body.preferredStyle;
    
    if (preferredStyle) {
      preferredStyle = decodeURIComponent(preferredStyle);
    }
    
    // Support multipart/form-data upload via multer
    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
    }

    const targetBase64 = await fetchImageAsBase64(imageUrl, imageBase64);
    if (!targetBase64) {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    const { getCacheKey, getCachedValue, setCachedValue } = await import("../services/cache");
    const cacheKeyParams = {
      route: "analyze-v2",
      imageHash: getCacheKey(targetBase64),
      preferredStyle: preferredStyle || "Любой",
      faceApiGender, faceApiShape, faceApiAge
    };
    const cacheKey = "v2_" + getCacheKey(cacheKeyParams);
    
    const cachedAnalysis = await getCachedValue<any>(cacheKey);
    if (cachedAnalysis) {
        console.log("Returned FULL analysis from cache!");
        res.json(cachedAnalysis);
        return;
    }

    

    let visualDescription = "";

    // If we have precise local Face-API data, we can use it directly and skip full vision,
    // OR we can still use Vision strictly for analyzing HAIR parameters while forcing the rest.
    console.time("Yandex Vision (Analysis)");
    console.log("Analyzing geometry via Yandex Vision / Gemini...");
    
    // If the frontend did a local analysis, it can optionally pass the local detected colors to avoid Vision entirely
    const skipVision = req.body.skipVision === true || req.body.skipVision === 'true';
    const preDetectedFacts = faceApiGender ? `[HINTS FROM LOCAL AI (MAY BE INACCURATE): Suggested Gender: ${faceApiGender === 'male' ? 'MALE' : 'FEMALE'}. Age is approx ${faceApiAge}. Face shape: ${faceApiShape}. ${req.body.localSkinTone ? `Skin tone: ${req.body.localSkinTone}.` : ''} ${req.body.localHairColor ? `Hair color: ${req.body.localHairColor}.` : ''}]` : "";
    
    if (skipVision && preDetectedFacts) {
        console.log("Skipping Vision API, using frontend provided parameters only.");
        visualDescription = preDetectedFacts 
          + "\nAssume short to medium hair length, medium density by default unless otherwise specified. Generate creative recommendations matching the hints.";
    } else {
        const visionPrompt = `You are an expert trichologist, physiognomist and master hair stylist. Analyze this person's face and hair with ultimate precision from the photo. Provide a very detailed clinical description: 
${preDetectedFacts} 

1) EXACT gender and estimated age. CRITICAL: If a gender is suggested in the hints, you MUST use that exact gender, even if the person has long hair or features you might otherwise misinterpret. Do NOT guess the gender differently from the hint.
2) Precise face shape.
3) EXACT hair length in cm and category (bald, buzz, short, medium, long). 
4) EXACT hair density (thick, medium, thin, sparse, balding) and exact status of the hairline (is there a receding hairline, temporal thinning, bald spots?). 
5) Hair texture (straight, wavy, curly, coily). 
6) Current true hair color. CRITICAL: Closely examine the roots and overall tone! Brown hair can look yellowish under lighting glare, do NOT mistake light brown / chestnut hair for blonde due to lighting.
7) Skin tone and facial hair style (beard, mustache, clean shaven). 
8) ONLY a concise description of clothing (exact color, type) and background (color/setting). Evaluate hair quality objectively. Be brutally honest.`;

        let base64PrefixRemoved = targetBase64.replace(/\s+/g, "");
        if (targetBase64.startsWith("data:")) {
            base64PrefixRemoved = targetBase64.replace(/^data:[\w-]+\/[\w-]+;base64,/, "");
        }
        
        try {
            const geminiApiKey = process.env.GEMINI_API_KEY;
            
            if (geminiApiKey) {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ 
                    apiKey: geminiApiKey, 
                    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
                });
                
                const contentsPayload = [
                  { text: visionPrompt },
                  { inlineData: { mimeType: req.body.mimeType || "image/jpeg", data: base64PrefixRemoved } }
                ];

                const response = await geminiQueue.add(() => withRetry(async () => {
                   let lastError;
                   const modelsToTry = ['gemini-2.5-flash'];
                   
                   for (const modelName of modelsToTry) {
                       try {
                           console.log(`Trying Vision Analysis with model: ${modelName}...`);
                           return await ai.models.generateContent({
                             model: modelName,
                             contents: { parts: contentsPayload }
                           });
                       } catch (err: any) {
                           lastError = err;
                           const msg = err.message || String(err);
                           console.warn(`Model ${modelName} failed with: ${msg}`);
                           if (!msg.includes("503") && !msg.includes("429") && !msg.includes("high demand") && !msg.includes("UNAVAILABLE")) {
                               throw err;
                           }
                       }
                   }
                   throw lastError;
                }));
                visualDescription = preDetectedFacts + "\n" + (response?.text?.trim() || "");
            } else {
                throw new Error("GEMINI_API_KEY не установлен. Нейросеть не может проанализировать изображение.");
            }
        } catch (e: any) {
            console.error("Gemini Vision failed, entering fallback mode:", e.message); logToTelegram("⚠️ *Gemini Vision:* Ошибка региона (Render). Рекомендуется выбрать регион US (Oregon/Ohio) при деплое, чтобы избежать блокировок Gemini Free Tier. Перешел на резервный базовый анализ.").catch(console.error);
            // DO NOT THROW EXCEPTIONS! We can still process using preDetectedFacts
            visualDescription = preDetectedFacts + "\nВНИМАНИЕ: Детальный визуальный анализ временно недоступен из-за перегрузки серверов ИИ. Используйте только базовые параметры из описания выше для подбора подходящих причесок. По умолчанию считайте длину волос средней/короткой, густоту нормальной, текстуру прямой.";
        }
    }
    console.timeEnd("Yandex Vision (Analysis)");

    console.time("YandexGPT");
    console.log("Generating recommendations via YandexGPT...");

    const systemText = `Ты эксперт-физиогномист и трихолог. Твоя задача — проанализировать детальное клиническое описание внешности клиента и вернуть его в структурированном виде.
Output EXCLUSIVELY a JSON object (no markdown, no backticks, strictly parseable JSON).

Сначала выдели характеристики в соответствии со следующими правилами:
- gender ("male" или "female", строго соответствуй полу из описания! Если в описании указано MALE или FEMALE, используй это.)
- faceShape (например, "Овальная", "Квадратная" - НА РУССКОМ)
- hairLength (ОБЯЗАТЕЛЬНО проанализируй длину из описания и выбери одну из: "Лысый", "Ежик/Очень короткие", "Короткие", "Средние", "Длинные" - НА РУССКОМ)
- hairDensity (ОБЯЗАТЕЛЬНО: "Редкие/Тонкие", "Средние", "Густые" - НА РУССКОМ)
- hairType ("Прямые", "Волнистые", "Кудрявые" - НА РУССКОМ)
- hairlineStatus (ОБЯЗАТЕЛЬНО: Подробная оценка лобной линии и наличия залысин на русском языке, например: "Ровная плотная линия без залысин", "Глубокие височные залысины (тип M/II по Норвуду)", "Заметное поредение в теменной зоне с залысинами", или "Редкие волосы на макушке")
- hairQuality (ОБЯЗАТЕЛЬНО: Оценка структуры, здоровья и толщины волос на русском языке, например: "Ослабленные, тонкие и сухие волосы с признаками истончения", "Густые, жесткие, здоровые волосы с плотной структурой", или "Слегка истонченные мягкие волосы средней густоты")
- skinTone (на английском)
- skinDetails (на английском)
- hairColor (на английском, переведи дословно. ВНИМАНИЕ: Если в описании hair color указан brown или chestnut, НЕ переводи и не классифицируй это как blonde!)
- eyeColor (на английском)
- ageRange (на английском, например "40-45" или "50-60" или "elderly grandmother 70-75", СТРОГО определи реальный возраст из фото!)
- facialFeatures (на английском)
- facialHair (на английском)
- clothingContext (на английском - точная одежда и фон)

Твой ответ должен быть СТРОГО в формате валидного JSON объекта.
Return ONLY the raw JSON string matching this schema:
{
  "gender": "",
  "faceShape": "",
  "hairLength": "",
  "hairDensity": "",
  "hairType": "",
  "hairlineStatus": "",
  "hairQuality": "",
  "skinTone": "",
  "skinDetails": "",
  "hairColor": "",
  "eyeColor": "",
  "ageRange": "",
  "facialFeatures": "",
  "facialHair": "",
  "clothingContext": ""
}`;

    let textOutput = await callLLM(systemText, `Visual description: ${visualDescription}`);
    console.timeEnd("YandexGPT");
    
    const parsedResults = safeParseJSON(textOutput);
    
    // 🔥 INJECT 3 RANDOM LIBRARY RECOMMENDATIONS TO SAVE AI COSTS 🔥
    const lib = parsedResults.gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
    const shuffled = [...lib].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3);
    parsedResults.recommendations = picked.map(item => ({
      name: item.name,
      description: item.description,
      stylingTips: item.stylingTips,
      imageKeyword: (item as any).imageKeyword || item.name // Ensure imageKeyword exists or fall back to name
    }));
    
    // Save to cache for 7 days
    await setCachedValue(cacheKey, parsedResults, 7 * 24 * 60 * 60);

    logToTelegram(`🔍 <b>Анализ лица (${req.body.userId || 'unknown'})</b>\nУспешно.`).catch(console.error);
    
    res.json(parsedResults);
  } catch (err: any) {
    console.error(err);
    let errorMsg = err.message || "Ошибка при анализе фото";
    if (typeof errorMsg === "string" && errorMsg.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(errorMsg);
        errorMsg = parsed.error?.message || errorMsg;
      } catch(e) {}
    }
    if (typeof errorMsg === "object") errorMsg = JSON.stringify(errorMsg);
    logToTelegram(`❌ <b>Ошибка Анализа Лица (${req.body.userId || 'unknown'})</b>\n<code>${errorMsg}</code>`).catch(console.error);
    if (!res.headersSent) res.status(500).json({ error: errorMsg });
  }
});