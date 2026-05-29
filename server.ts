import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import "dotenv/config";

let cachedIamToken: string | null = null;
let iamTokenExpiry: number = 0;

async function getYandexIamToken(serviceAccountKeyJSON: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedIamToken && iamTokenExpiry > now + 120) {
    return cachedIamToken;
  }

  let key;
  try {
    key = JSON.parse(serviceAccountKeyJSON);
  } catch (e: any) {
    throw new Error("Не удалось распарсить YANDEX_SERVICE_ACCOUNT_KEY");
  }
  
  if (!key.service_account_id || !key.private_key || !key.id) {
    throw new Error("YANDEX_SERVICE_ACCOUNT_KEY не содержит необходимых полей");
  }

  const payload = {
    aud: "https://iam.api.cloud.yandex.net/iam/v1/tokens",
    iss: key.service_account_id,
    iat: now,
    exp: now + 3600
  };

  const jwtToken = jwt.sign(payload, key.private_key, {
    algorithm: 'PS256',
    keyid: key.id
  });

  const res = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt: jwtToken })
  });

  if (!res.ok) {
    throw new Error(`Failed to get IAM token: ${await res.text()}`);
  }

  const data = await res.json();
  cachedIamToken = data.iamToken;
  iamTokenExpiry = now + 3600;

  return cachedIamToken;
}

function extractFolderId(rawFolderId: string): string {
  let cleaned = rawFolderId.trim().replace(/^["']|["']$/g, '');
  if (cleaned.includes('/folders/')) {
    const parts = cleaned.split('/folders/');
    cleaned = parts[parts.length - 1];
  } else if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    const lastPart = parts.filter(Boolean).pop();
    if (lastPart) {
      cleaned = lastPart;
    }
  }
  return cleaned.split('?')[0].split('#')[0].trim();
}

async function callYandexGPT(systemText: string, userText: string): Promise<string> {
    const folderId = process.env.YANDEX_FOLDER_ID;
    const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
    if (!folderId || !saKey) {
        throw new Error("YANDEX_FOLDER_ID или YANDEX_SERVICE_ACCOUNT_KEY не установлены");
    }
    const cleanFolderId = extractFolderId(folderId);
    const iamToken = await getYandexIamToken(saKey);
    
    const payload = {
      modelUri: `gpt://${cleanFolderId}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.3,
        maxTokens: 2000
      },
      messages: [
        { role: "system", text: systemText },
        { role: "user", text: userText }
      ]
    };

    const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${iamToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`YandexGPT API Error HTTP ${res.status}: ${err}`);
    }
    
    const data = await res.json();
    return data.result.alternatives[0].message.text;
}

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware for parsing JSON with a larger limit for images
  app.use(express.json({ limit: "50mb" }));

  // Rate Limiter to prevent bankruptcy from GenAI usage overhead
  const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1000, 
    message: { 
      error: "Суточный бесплатный лимит запросов исчерпан. Пожалуйста, попробуйте позже.",
      fallback: true
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/analyze", apiLimiter);
  app.use("/api/generate-ar", apiLimiter);
  app.use("/api/load-more", apiLimiter);

  // API Routes
  
  async function fetchImageAsBase64(url: string | null, fallbackBase64: string | null): Promise<string | null> {
    if (fallbackBase64) return fallbackBase64; // Prioritize local base64 to avoid unnecessary network calls
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

  // callYandexGPT removed

  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, imageUrl, mimeType } = req.body;
      const targetBase64 = await fetchImageAsBase64(imageUrl, imageBase64);
      if (!targetBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "FAL_KEY is missing for image analysis." });
      }

      console.time("fal.ai");
      console.log("Analyzing geometry via fal.ai llava-next...");
      
      const falRes = await fetch("https://fal.run/fal-ai/any-llm/vision", {
        method: "POST",
        headers: {
          "Authorization": `Key ${falKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image_url: `data:image/jpeg;base64,${targetBase64.replace(/^data:image\/\w+;base64,/, "")}`,
          prompt: "You are an expert trichologist and physiognomist. Analyze this person's face and hair with ultimate precision. Provide a very detailed clinical description: 1) EXACT gender. 2) Precise face shape. 3) EXACT hair length in cm (e.g. skin fade / bald, buzz cut 1cm, short 5cm, medium 15cm, long 30+cm). 4) EXACT hair density at the scalp (scalp visibility, sparse, medium, thick). 5) Hair texture (straight, wavy, curly). 6) Skin tone and facial hair style. If the person has very short hair or is balding, STATE IT EXPLICITLY. Be brutally honest, do not hallucinate thick hair if it is thin/short."
        })
      });

      if (!falRes.ok) {
        throw new Error(`FAL.ai Error: ${await falRes.text()}`);
      }
      
      const falData = await falRes.json();
      console.timeEnd("fal.ai");
      const visualDescription = falData.output;

      console.time("YandexGPT");
      console.log("Generating recommendations via YandexGPT...");

      const systemText = `Ты строгий парикмахер-стилист. Твоя задача — проанализировать описание внешности клиента и подобрать стрижки. 
Output EXCLUSIVELY a JSON object (no markdown, no backticks, strictly parseable JSON).

Сначала выдели характеристики в соответствии со следующими правилами:
- gender ("male" или "female")
- faceShape (например, "Овальная", "Квадратная" - НА РУССКОМ)
- hairLength (ОБЯЗАТЕЛЬНО: "Лысый", "Ежик/Очень короткие", "Короткие", "Средние", "Длинные" - НА РУССКОМ)
- hairDensity (ОБЯЗАТЕЛЬНО: "Редкие/Тонкие", "Средние", "Густые" - НА РУССКОМ)
- hairType ("Прямые", "Волнистые", "Кудрявые" - НА РУССКОМ)
- skinTone (на английском)
- skinDetails (на английском)
- hairColor (на английском)
- eyeColor (на английском)
- ageRange (на английском, e.g., "20-30")
- facialFeatures (на английском)
- facialHair (на английском)

АБСОЛЮТНОЕ ПРАВИЛО ПОДБОРА СТРИЖЕК:
1. КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать длинные, средние стрижки или классические объемные прически (например, помпадур, квифф, андеркат с длинным верхом), ЕСЛИ у клиента "Лысый", "Ежик/Очень короткие" или "Короткие" волосы, либо если есть залысины. Для коротких волос предлагай ТОЛЬКО фейд, базз-кат, кроп с коротким верхом или полное бритье.
2. КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать объемные густые стрижки, если у клиента "Редкие/Тонкие" волосы или залысины.
3. Мы осуществляем ПРИМЕРКУ (VTON). Программа НЕ МОЖЕТ ДОРИСОВАТЬ ВОЛОСЫ. Стрижка должна быть выполнима путем ОБРЕЗАНИЯ текущих волос. 

Предложи РОВНО 3 АБСОЛЮТНО РАЗНЫХ, реалистичных стрижки, идеально подходящих под текущую длину и густоту, в массиве 'recommendations':
[
  {
    "name": "Название стрижки на русском",
    "description": "Честное объяснение, почему она подходит с учетом реальной густоты и длины...",
    "stylingTips": "Советы по укладке...",
    "imageKeyword": "Haircut name, hair density (english)"
  }
]
КРИТИЧНО: 'imageKeyword' ДОЛЖЕН описывать стрижку на АНГЛИЙСКОМ языке и учитывать густоту/тип волос (например, "buzz cut, thin receding hair" или "short textured crop, sparse hair"). Это поле пойдет в нейросеть для генерации изображений.

Return ONLY the raw JSON string matching this schema:
{
  "gender": "",
  "faceShape": "",
  "hairLength": "",
  "hairDensity": "",
  "hairType": "",
  "skinTone": "",
  "skinDetails": "",
  "hairColor": "",
  "eyeColor": "",
  "ageRange": "",
  "facialFeatures": "",
  "facialHair": "",
  "recommendations": []
}`;

      let textOutput = await callYandexGPT(systemText, `Visual description: ${visualDescription}`);
      console.timeEnd("YandexGPT");
      
      const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         textOutput = jsonMatch[0];
      } else {
         textOutput = textOutput.replace(/```(json)?\s*/g, "").replace(/```\s*$/g, "").trim();
      }

      const parsedResults = JSON.parse(textOutput);
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

      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/generate-reference", async (req, res) => {
    try {
      const { gender, keyword, faceShape, hairLength, hairDensity, hairType, skinTone, skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair } = req.body;
      if (!keyword) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      let descriptor = 'модель';
      const g = (gender || '').toLowerCase().trim();
      if (g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy')) {
        descriptor = 'красивый молодой мужчина';
      } else if (g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl')) {
        descriptor = 'прекрасная молодая женщина';
      }

      const features = [];
      if (ageRange && ageRange.length > 2) features.push(`возраст примерно ${ageRange} лет`);
      if (faceShape && faceShape.length > 2) features.push(`форма лица ${faceShape}`);
      if (hairLength && hairLength.length > 2) features.push(`оригинальная длина волос - ${hairLength}`);
      if (skinTone && skinTone.length > 2) features.push(`тон кожи ${skinTone}`);
      if (skinDetails && !skinDetails.toLowerCase().includes('clear') && skinDetails.length > 2) features.push(`детали кожи: ${skinDetails}`);
      if (eyeColor && eyeColor.length > 2) features.push(`цвет глаз ${eyeColor}`);
      if (facialFeatures && facialFeatures.length > 2) features.push(`особенности лица: ${facialFeatures}`);
      
      const detailedFeatures = features.length > 0 ? `, ${features.join(', ')}` : '';
      
      let prompt = `Студийный портрет крупным планом, лицо по центру, взгляд прямо, АБСОЛЮТНО НЕЙТРАЛЬНОЕ ЛИЦО БЕЗ УЛЫБКИ (serious expression, strict neutral, NO SMILE), ${descriptor}. Стрижка: "${keyword}". `;
      if (detailedFeatures) prompt += `Внешность: ${detailedFeatures}. `;
      if (hairColor) prompt += `Цвет: ${hairColor}. `;
      if (hairType) prompt += `Тип: ${hairType}. `;
      
      // We need to parse facialHair from request body. I'll get it from req.body.
      let fh = (req.body.facialHair || '').toLowerCase();
      if (fh && (fh.includes('clean') || fh.includes('shave'))) {
          prompt += `КРИТИЧНО: Гладко выбритое лицо (clean shaven), строго НИКАКОЙ БОРОДЫ (no beard). Закрытая одежда под горло. `;
      } else if (fh) {
          prompt += `Растительность на лице: ${fh}. Обычная закрытая одежда. `;
      } else {
          prompt += `Гладко выбритое лицо, закрытая повседневная одежда. `;
      }

      prompt += `Простой светлый однотонный фон, никаких улыбок, профессиональный модельный снимок (ID photo style).`;
      
      prompt = prompt.substring(0, 480).trim();

      let finalImageUrl = "";
      let lastError = "";

      const yandexServiceAccountKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
      const yandexFolderId = process.env.YANDEX_FOLDER_ID;

      if (yandexServiceAccountKey && yandexFolderId) {
        console.log("Generating reference via YandexART...");
        try {
          const cleanFolderId = extractFolderId(yandexFolderId);
          const iamToken = await getYandexIamToken(yandexServiceAccountKey);

          // 1. Start Async Generation
          const reqBody = {
            modelUri: `art://${cleanFolderId}/yandex-art/latest`,
            generationOptions: {
              seed: Math.floor(Math.random() * 10000000).toString(),
              aspectRatio: { widthRatio: "1", heightRatio: "1" }
            },
            messages: [
              { weight: 1, text: prompt }
            ]
          };

          const initRes = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${iamToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
          });

          if (!initRes.ok) {
            const errText = await initRes.text();
            throw new Error(`YandexART Init Error: ${errText}`);
          }

          const initData = await initRes.json();
          const operationId = initData.id;
          
          if (!operationId) {
            throw new Error('No operation ID returned by YandexART');
          }

          // 2. Poll for Completion using Operation Service
          const pollUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;
          let attempts = 0;
          const maxAttempts = 12; // 12 * 2500ms = 30 seconds
          
          while (attempts < maxAttempts && !finalImageUrl) {
            await new Promise(resolve => setTimeout(resolve, 2500)); // Delay between polling
            
            const pollRes = await fetch(pollUrl, {
              headers: {
                'Authorization': `Bearer ${iamToken}`
              }
            });

            if (!pollRes.ok) {
              console.error(`Polling Error HTTP ${pollRes.status}`);
              attempts++;
              continue;
            }

            const pollData = await pollRes.json();
            
            if (pollData.done) {
              if (pollData.response && pollData.response.image) {
                  finalImageUrl = `data:image/jpeg;base64,${pollData.response.image}`;
              } else if (pollData.error) {
                  throw new Error(`YandexART Gen Error: ${pollData.error.message || JSON.stringify(pollData.error)}`);
              }
            }
            attempts++;
          }
          
          if (!finalImageUrl) {
            throw new Error('YandexART generation timed out after 30 seconds');
          }

        } catch (error: any) {
             lastError += `[YandexART: ${error.message}]`;
             console.error("YandexART Failed:", error);
        }
      } else {
         lastError += "[Яндекс Облако не настроено, отсутствуют YANDEX_SERVICE_ACCOUNT_KEY или YANDEX_FOLDER_ID]";
      }

      // Fallback
      if (!finalImageUrl) {
          console.error(`Не удалось сгенерировать изображение в Yandex Cloud: ${lastError}. Используем fallback-изображение.`);
          finalImageUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
      }

      res.json({ imageUrl: finalImageUrl, debugError: lastError });
    } catch (err: any) {
      console.error("Reference gen error:", err);
      res.status(500).json({ error: err.message || "Ошибка генерации референса" });
    }
  });

  app.post("/api/generate-full", async (req, res) => {
    try {
      const { 
        gender, keyword, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair,
        selfieImage, // Required for Step 2
        cachedReferenceImage // Optional: Skip Step 1 if provided
      } = req.body;
      
      if (!keyword || !selfieImage) {
        return res.status(400).json({ error: "Missing parameters: keyword and selfieImage are required." });
      }

      /* 
        ========================================================================
        STEP 1 & 2: Generate Virtual Try-On (FAL.ai Inpainting/I2I + FaceSwap)
        ========================================================================
      */
      let finalImageUrl = "";
      let lastError = "";
      
      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "Отсутствует FAL_KEY в переменных окружения." });
      }

      let swappedImageUrl = "";
      const selfieImageFull = selfieImage.startsWith('data:') ? selfieImage : `data:image/jpeg;base64,${selfieImage}`;

      let descriptor = 'человек';
      const g = (gender || '').toLowerCase().trim();
      if (g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy')) {
        descriptor = 'мужчина';
      } else if (g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl')) {
        descriptor = 'женщина';
      }

      let prompt = `Портрет крупным планом, ${descriptor}. НОВАЯ СТРИЖКА (NEW HAIRCUT): "${keyword}". `;
      if (hairColor) prompt += `Цвет волос: ${hairColor}. `;
      if (hairType) prompt += `Тип волос: ${hairType}. `;
      
      let fh = (facialHair || '').toLowerCase();
      if (fh && (fh.includes('clean') || fh.includes('shave'))) {
          prompt += `Гладко выбритое лицо (clean shaven). `;
      } else if (fh) {
          prompt += `Растительность на лице: ${fh}. `;
      }

      prompt += `КРИТИЧЕСКИ ВАЖНО: СОХРАНИТЬ ТОЧНО ТЕ ЖЕ ОДЕЖДУ (KEEP EXACTLY ORIGINAL CLOTHES), ФОН (KEEP EXACTLY ORIGINAL BACKGROUND), ТЕЛОСЛОЖЕНИЕ, ПОЗУ. ИЗМЕНИТЬ ТОЛЬКО ВОЛОСЫ НА ГОЛОВЕ.`;

      prompt = prompt.substring(0, 480).trim();

      try {
        console.log("Generating reference via FAL.AI (Flux I2I)...");
        const fluxRes = await fetch("https://fal.run/fal-ai/flux/dev/image-to-image", {
          method: "POST",
          headers: {
            "Authorization": `Key ${falKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image_url: selfieImageFull,
            prompt: prompt,
            strength: 0.50, 
            num_inference_steps: 30
          })
        });

        if (!fluxRes.ok) {
           const errData = await fluxRes.text();
           throw new Error(`FAL Flux I2I Error HTTP ${fluxRes.status}: ${errData}`);
        }
        
        const fluxData = await fluxRes.json();
        const generatedUrl = fluxData.images?.[0]?.url || fluxData.image?.url || fluxData.image_url || fluxData.url;
        
        if (generatedUrl) {
            finalImageUrl = generatedUrl;
        } else {
            throw new Error(`No image generated by Flux I2I. Payload: ${JSON.stringify(fluxData)}`);
        }
      } catch (e: any) {
        throw e; // Pass error out
      }

      try {
        console.log("Starting Virtual Try-On FaceSwap via FAL.AI...");
        const falRes = await fetch("https://fal.run/fal-ai/face-swap", {
          method: "POST",
          headers: {
            "Authorization": `Key ${falKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            base_image_url: finalImageUrl,
            swap_image_url: selfieImageFull
          })
        });

        if (!falRes.ok) {
          const errText = await falRes.text();
          throw new Error(`FAL.AI FaceSwap Error: HTTP ${falRes.status} - ${errText}`);
        }

        const falData = await falRes.json();

        const swapUrl = falData.image?.url || falData.image_url || falData.url;
        if (swapUrl) {
           swappedImageUrl = swapUrl;
        } else {
             throw new Error(`Unexpected FAL.AI FaceSwap output format: ${JSON.stringify(falData)}`);
        }
        } catch (error: any) {
          console.error("FAL VTON failed:", error);
          return res.status(500).json({ 
            error: "Step 2 (FAL.AI Virtual Try-On) failed: " + error.message,
            referenceImage: finalImageUrl 
          });
        }

      // Final success
      res.json({ 
        imageUrl: swappedImageUrl,            // Final processed image (face swapped)
        referenceImage: finalImageUrl,        // Original generation
        debugError: lastError 
      });

    } catch (err: any) {
      console.error("Full pipeline error:", err);
      res.status(500).json({ error: err.message || "Pipeline error" });
    }
  });

  app.post("/api/generate-ar", async (req, res) => {
    try {
      const { styleKeyword, styleName, features } = req.body;
      if (!styleKeyword || !styleName) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      console.log("Generating final AR text via YandexGPT using cached features...");
      
      let pureFeatures1 = { ...(features || {}) };
      delete pureFeatures1.recommendations;
      const faceDescription = features ? JSON.stringify(pureFeatures1) : "Нет данных о лице (ошибка)";
      
      const systemInstruction = `Ты профессиональный парикмахер. Проанализируй эти особенности лица человека.
Подробно объясни, как стрижка "${styleKeyword}" (${styleName}) будет смотреться на этом конкретном человеке. Напиши 3 пункта: 
- "Персональный анализ": Почему это подойдет или какие нужны адаптации под форму лица.
- "Как просить мастера": Конкретные инструкции для барбера/парикмахера.
- "Уход и укладка": Какие средства использовать каждый день.
Форматируй текст СТРОГО с помощью HTML-тегов (<p>, <strong>, <br>, <ul>, <li>).
НЕ используй синтаксис markdown (никаких \`\`\`html или \`\`\`). Верни ТОЛЬКО готовый HTML код.`;

      let consultationHtml = await callYandexGPT(systemInstruction, `Физические особенности клиента: ${faceDescription}`);
      
      consultationHtml = consultationHtml.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();

      return res.json({ 
        consultationHtml,
        warning: ""
      });
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || "Ошибка генерации примерки";
      if (typeof errorMsg === "string" && errorMsg.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(errorMsg);
          errorMsg = parsed.error?.message || errorMsg;
        } catch(e) {}
      }
      if (typeof errorMsg === "object") errorMsg = JSON.stringify(errorMsg);

      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("429") ||
          errorMsg.includes("quota") ||
          errorMsg.includes("RESOURCE_EXHAUSTED") ||
          errorMsg.includes("limit: 0"))
      ) {
        errorMsg =
          "Лимит запросов к серверам ИИ временно исчерпан. Пожалуйста, попробуйте сгенерировать гайд немного позже, когда лимиты восстановятся.";
      } else if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("503") ||
          errorMsg.includes("high demand") ||
          errorMsg.includes("UNAVAILABLE") ||
          errorMsg.includes("overloaded"))
      ) {
        errorMsg = "Сервер перегружен (503). Повторите попытку.";
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/load-more", async (req, res) => {
    try {
      const { existingNames, features } = req.body;

      console.log("Generating more recommendations via YandexGPT using cached features...");

      let pureFeatures2 = { ...(features || {}) };
      delete pureFeatures2.recommendations;
      const faceDescription = features ? JSON.stringify(pureFeatures2) : "Нет данных о лице (ошибка)";

      const systemInstruction = `Ты строгий парикмахер-стилист. Выведи ТОЛЬКО валидный JSON (без markdown и других символов).
Внимательно изучи описание внешности клиента (ТЕКУЩАЯ ДЛИНА И ГУСТОТА):
"${faceDescription}"

ШАГ 1. Учитывая ПОЛ, текущую ДЛИНУ волос и ГУСТОТУ из описания.
ШАГ 2. Предложи 3 НОВЫЕ СОВЕРШЕННО РАЗНЫЕ стрижки.

АБСОЛЮТНОЕ ПРАВИЛО 1: Описание строго на русском языке.
АБСОЛЮТНОЕ ПРАВИЛО 2: КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать длинные, средние или классические объемные стрижки, если у клиента короткие волосы, базз-кат, ежик или залысины. Стрижка должна быть выполнима путем обрезания текущих волос.
АБСОЛЮТНОЕ ПРАВИЛО 3: КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать объемные густые стрижки, если у клиента тонкие/редкие волосы.
АБСОЛЮТНОЕ ПРАВИЛО 4: Исключить следующие стрижки, они уже были предложены: ${existingNames}.
АБСОЛЮТНОЕ ПРАВИЛО 5: В поле imageKeyword ОБЯЗАТЕЛЬНО укажи густоту волос на английском языке (например: buzz cut, thin sparse hair).

Верни массив "recommendations":
{
  "recommendations": [
    {
      "name": "Название",
      "description": "Описание",
      "stylingTips": "Укладка",
      "imageKeyword": "Haircut name, hair density (english)"
    }
  ]
}`;

      let textOutput = await callYandexGPT(systemInstruction, "Сгенерируй 3 стрижки в формате JSON");

      const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         textOutput = jsonMatch[0];
      } else {
         textOutput = textOutput.replace(/```(json)?\s*/g, "").replace(/```\s*$/g, "").trim();
      }

      const parsedResults = JSON.parse(textOutput);
      res.json(parsedResults);
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || "Ошибка генерации новых вариантов";
      if (typeof errorMsg === "string" && errorMsg.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(errorMsg);
          errorMsg = parsed.error?.message || errorMsg;
        } catch(e) {}
      }
      if (typeof errorMsg === "object") errorMsg = JSON.stringify(errorMsg);
      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("429") ||
          errorMsg.includes("quota") ||
          errorMsg.includes("RESOURCE_EXHAUSTED"))
      ) {
        return res.status(200).json({
          recommendations: [
            {
              name: "Гарсон (Garcon)",
              description: "Короткая французская стрижка с легким объемом на макушке.",
              stylingTips: "Используйте мусс для объема перед сушкой.",
              imageKeyword: "Garcon haircut"
            },
            {
              name: "Каре на ножке",
              description: "Стильный вариант боба с открытым затылком.",
              stylingTips: "Слегка вытягивайте утюжком для гладкости.",
              imageKeyword: "A-line bob"
            }
          ]
        });
      } else if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("503") ||
          errorMsg.includes("high demand") ||
          errorMsg.includes("UNAVAILABLE") ||
          errorMsg.includes("overloaded"))
      ) {
        errorMsg = "Сервер перегружен (503). Повторите попытку.";
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/create-invoice", async (req, res) => {
    try {
      const { userId } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        return res
          .status(500)
          .json({ error: "Telegram Bot Token is not configured" });
      }

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Генерации нейростилиста",
            description: "Пакет 10 генераций",
            payload: JSON.stringify({ userId, package: 10 }),
            provider_token: "", // Empty for Telegram Stars
            currency: "XTR",
            prices: [{ label: "10 генераций", amount: 50 }], // 50 Stars
          }),
        },
      );

      const data = await response.json();
      if (data.ok) {
        res.json({ invoiceUrl: data.result });
      } else {
        res
          .status(400)
          .json({ error: data.description || "Failed to create invoice" });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Add fallback for dev mode to serve index.html
    const fs = await import("fs");
    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
