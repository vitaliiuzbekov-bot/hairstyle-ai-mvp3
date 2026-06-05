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
  
  // Cut query strings & hashes first
  cleaned = cleaned.split('?')[0].split('#')[0].trim();
  
  // Extract the ID after /folders/ or folders/ if present
  if (cleaned.includes('/folders/')) {
    const parts = cleaned.split('/folders/');
    const folderPart = parts[parts.length - 1]; // e.g. "b1gels913826k38vrotg/overview" or "b1gels913826k38vrotg"
    cleaned = folderPart.split('/')[0];
  } else if (cleaned.includes('folders/')) {
    const parts = cleaned.split('folders/');
    const folderPart = parts[parts.length - 1];
    cleaned = folderPart.split('/')[0];
  } else if (cleaned.includes('/')) {
    const parts = cleaned.split('/').filter(Boolean);
    const folderIdCandidate = parts.find(p => p.startsWith('b1') && p.length >= 10);
    if (folderIdCandidate) {
      cleaned = folderIdCandidate;
    } else {
      cleaned = parts[parts.length - 1] || cleaned;
    }
  }
  
  return cleaned.trim();
}

async function callYandexGPTChat(systemText: string, messages: {role: string, text: string}[]): Promise<string> {
    const folderId = process.env.YANDEX_FOLDER_ID;
    const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
    if (!folderId || !saKey) {
        throw new Error("YANDEX_FOLDER_ID или YANDEX_SERVICE_ACCOUNT_KEY не установлены");
    }
    const cleanFolderId = extractFolderId(folderId);
    
    if (cleanFolderId === "MY_FOLDER_ID" || cleanFolderId.toLowerCase().includes("folder_id") || cleanFolderId.length < 5) {
        throw new Error(`[ОШИБКА НАСТРОЙКИ СЕРВЕРА] В переменных окружения вашего сервера (на Render.com) в ключе YANDEX_FOLDER_ID все еще указан стандартный шаблон или плейсхолдер "${cleanFolderId}". Пожалуйста, зайдите в настройки (Environment) на Render.com и замените "MY_FOLDER_ID" на реальный Идентификатор каталога (например, b1gqp...).`);
    }

    const iamToken = await getYandexIamToken(saKey);
    
    const payload = {
      modelUri: `gpt://${cleanFolderId}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.85,
        maxTokens: 2000
      },
      messages: [
        { role: "system", text: systemText },
        ...messages
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
        throw new Error(`Ответ YandexGPT: ${err}`);
    }

    const data = await res.json();
    return data.result.alternatives[0].message.text;
}

async function callYandexGPT(systemText: string, userText: string): Promise<string> {
    const folderId = process.env.YANDEX_FOLDER_ID;
    const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
    if (!folderId || !saKey) {
        throw new Error("YANDEX_FOLDER_ID или YANDEX_SERVICE_ACCOUNT_KEY не установлены");
    }
    const cleanFolderId = extractFolderId(folderId);
    
    if (cleanFolderId === "MY_FOLDER_ID" || cleanFolderId.toLowerCase().includes("folder_id") || cleanFolderId.length < 5) {
        throw new Error(`[ОШИБКА НАСТРОЙКИ СЕРВЕРА] В переменных окружения вашего сервера (на Render.com) в ключе YANDEX_FOLDER_ID все еще указан стандартный шаблон или плейсхолдер "${cleanFolderId}". Пожалуйста, зайдите в настройки (Environment) на Render.com и замените "MY_FOLDER_ID" на реальный Идентификатор каталога (например, b1gqp...).`);
    }

    const iamToken = await getYandexIamToken(saKey);
    
    const payload = {
      modelUri: `gpt://${cleanFolderId}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.85,
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
        let diagnostic = "";
        if (err.includes("model_uri") || err.includes("modelUri") || res.status === 400) {
            const masked = cleanFolderId.length > 5 
               ? `${cleanFolderId.slice(0, 4)}...${cleanFolderId.slice(-4)}` 
               : cleanFolderId;
            diagnostic = `\n(Диагностика: Модель YandexGPT отклонила запрос с ошибкой "invalid model_uri". Проверьте, что в переменных окружения вашего сервера (например, на Render.com) Идентификатор каталога (YANDEX_FOLDER_ID) указан абсолютно правильно. Значение, используемое сейчас сервером: "${masked}" [длина: ${cleanFolderId.length}].)`;
        }
        throw new Error(`YandexGPT API Error HTTP ${res.status}: ${err}${diagnostic}`);
    }
    
    const data = await res.json();
    return data.result.alternatives[0].message.text;
}

export async function logToTelegram(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!botToken || !adminChatId) return;

  try {
    const text = `🕒 ${new Date().toISOString()}\n\n${message}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: adminChatId,
        text,
        parse_mode: "HTML"
      })
    });
  } catch (e) {
    console.error("Failed to send log to Telegram", e);
  }
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

  app.post("/api/log", async (req, res) => {
    try {
      const { level = 'info', message, userId } = req.body;
      const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
      await logToTelegram(`<b>[Client ${emoji}]</b> ${userId ? `User: <code>${userId}</code>\n` : ''}${message}`);
      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to log" });
    }
  });

    app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, imageUrl, mimeType, preferredStyle } = req.body;
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
          prompt: "You are an expert trichologist, physiognomist and master hair stylist. Analyze this person's face and hair with ultimate precision from the photo. Provide a very detailed clinical description: 1) EXACT gender and estimated age. 2) Precise face shape. 3) EXACT hair length in cm and category (bald, buzz, short, medium, long). 4) EXACT hair density (thick, medium, thin, sparse, balding) and exact status of the hairline (is there a receding hairline, temporal thinning, bald spots?). 5) Hair texture (straight, wavy, curly, coily). 6) Current hair color. 7) Skin tone and facial hair style (beard, mustache, clean shaven). 8) ONLY a concise description of clothing (exact color, type) and background (color/setting). Evaluate hair quality objectively. Be brutally honest."
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

      const systemText = `Ты топовый и очень креативный парикмахер-стилист. Твоя задача — проанализировать детальное клиническое описание внешности клиента и предложить 3 СОВЕРШЕННО РАЗНЫХ И НЕСТАНДАРТНЫХ варианта стрижки. 
Output EXCLUSIVELY a JSON object (no markdown, no backticks, strictly parseable JSON).

Сначала выдели характеристики в соответствии со следующими правилами:
- gender ("male" или "female")
- faceShape (например, "Овальная", "Квадратная" - НА РУССКОМ)
- hairLength (ОБЯЗАТЕЛЬНО проанализируй длину из описания и выбери одну из: "Лысый", "Ежик/Очень короткие", "Короткие", "Средние", "Длинные" - НА РУССКОМ)
- hairDensity (ОБЯЗАТЕЛЬНО: "Редкие/Тонкие", "Средние", "Густые" - НА РУССКОМ. Если есть залысины, укажи это)
- hairType ("Прямые", "Волнистые", "Кудрявые" - НА РУССКОМ)
- skinTone (на английском)
- skinDetails (на английском)
- hairColor (на английском)
- eyeColor (на английском)
- ageRange (на английском, e.g., "20-30")
- facialFeatures (на английском)
- facialHair (на английском)
- clothingContext (на английском - точная одежда и фон)

ЖЕСТКАЯ ТАБЛИЦА ФИЗИЧЕСКИХ ОГРАНИЧЕНИЙ ДЛИНЫ ВОЛОС (МЫ ПРИМЕРЯЕМ НА ФОТО, НЕЛЬЗЯ УДЛИНЯТЬ ВОЛОСЫ ПРИМЕРКОЙ! Стрижка ДОЛЖНА быть КОРОЧЕ или РАВНОЙ текущей длине волос оригинала):
1. Если у клиента "Лысый": советовать ТОЛЬКО "Полное бритье головы" (Clean head shave) или "Гладкая лысина".
2. Если у клиента "Ежик/Очень короткие" (до 2 см): предлагай только ультракороткие стрижки (Базз-кат, Милитари фейд, Ультракороткий кроп, Френч кроп).
3. Если у клиента "Короткие" (от 2 до 7 см): предлагайте самые разнообразные варианты (Текстурированный кроп, Фейд с зачесом, Андеркат, Квифф, Цезарь и др.).
4. Если у клиента "Средние" (от 7 до 15 см): предлагайте любые средние или короткие стрижки.
5. Если у клиента "Длинные" (более 15 см): можно советовать любые стрижки.

ДОПОЛНИТЕЛЬНЫЕ КРИТИЧЕСКИЕ ПРАВИЛА:
1. Обрати абсолютное внимание на первоначальный анализ внешности: залысины, редкие волосы, высокий лоб. Адаптируй результат под них категорически! Если волосы "Редкие/Тонкие" - предлагай стрижки, скрывающие залысины (текстурированные, кроп, короткие). СТРОГО ОБЯЗАТЕЛЬНО включать слова 'thin hair' или 'receding hairline' в 'imageKeyword'.
2. Ожидаемый стиль стрижки: ${preferredStyle !== undefined && preferredStyle !== 'Любой' ? preferredStyle : 'На твое усмотрение'}. ЭТО КРИТИЧЕСКИ ВАЖНО. Все 3 стрижки ДОЛЖНЫ 100% соответствовать этому стилю. Подбери три совершенно уникальных, не похожих друг на друга прически именно в этом стиле. Учитывай КОЛИЧЕСТВО И КАЧЕСТВО ВОЛОС (густоту, залысины) при выборе — стрижка должна быть реалистично выполнима на текущих волосах. Делай их максимально разнообразными внутри выбранного стиля. Никаких клише!
3. Каждый запрос должен возвращать НОВЫЕ варианты в рамках стиля, не повторяйся со стандартным "Фейдом".
4. ОЧЕНЬ ВАЖНО: 'imageKeyword' ДОЛЖЕН содержать точное английское название стрижки, длину волос (например, 'short hair') и густоту (например, 'thin hair', 'thick hair').

ВНИМАНИЕ: ТЫ ОБЯЗАН ВЕРНУТЬ РОВНО ТРИ (3) ВАРИАНТА СТРИЖКИ. СТРОГО 3 ВАРИАНТА, НЕ МЕНЬШЕ И НЕ БОЛЬШЕ.

Твой ответ должен быть СТРОГО в формате валидного JSON объекта:
{
  "warning": "Предупредите мягко, если запрос недостижим" (или пустая строка),
  "recommendations": [
    {
      "name": "Название стрижки на русском (уникальное!)",
      "description": "Точное объяснение, почему она скрывает недостатки и подчеркивает достоинства клиента...",
      "stylingTips": "Специфичные советы по укладке для его типа волос...",
      "imageKeyword": "Exact english haircut name, hair length, hair density/status"
    },
    { ...второй вариант... },
    { ...третий вариант... }
  ]
}
КРИТИЧНО: 'imageKeyword' ДОЛЖЕН тонко описывать стрижку на АНГЛИЙСКОМ языке.
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
  "clothingContext": "",
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

      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/generate-reference", async (req, res) => {
    try {
      const { 
        gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext
      } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      let descriptorRu = 'человек';
      const g = (gender || '').toLowerCase().trim();
      if (g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy')) {
        descriptorRu = 'молодой мужчина';
      } else if (g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl')) {
        descriptorRu = 'молодая женщина';
      }

      let lengthRu = '';
      if (hairLength) {
        const hl = hairLength.toLowerCase();
        if (hl.includes('bald') || hl.includes('лыс') || hl.includes('брит') || hl.includes('buzz')) lengthRu = 'очень короткая стрижка';
        else if (hl.includes('short') || hl.includes('коротк') || hl.includes('5')) lengthRu = 'короткие волосы';
        else if (hl.includes('medium') || hl.includes('средн') || hl.includes('15')) lengthRu = 'волосы средней длины';
        else if (hl.includes('long') || hl.includes('длин')) lengthRu = 'длинные волосы';
      }

      let prompt = `Профессиональная портретная фотография из глянцевого журнала. Крупный план, главный акцент на прическе. Название стрижки/прически (строго): "${keyword}". `;
      
      if (description) {
         prompt += `Стиль стрижки: ${description.substring(0, 80)}. `;
      }
      
      prompt += `Модель: ${descriptorRu}. `;

      if (ageRange) {
        prompt += `Возраст: ${ageRange}. `;
      }
      if (faceShape) {
        prompt += `Форма лица: ${faceShape}. `;
      }
      
      if (hairDensity && (hairDensity.includes("thin") || hairDensity.includes("sparse") || hairDensity.includes("редк") || hairDensity.includes("balding"))) {
         prompt += `Особенность: тонкие/редкие волосы. `;
      } else {
         prompt += `Естественная густота волос. `;
      }
      
      const translateColorRu = (val: string) => {
        val = val.toLowerCase();
        if (val.includes("dark brown") || val.includes("тёмно-каштанов")) return "тёмно-каштановый";
        if (val.includes("light brown") || val.includes("светло-рус")) return "светло-русый";
        if (val.includes("блонд") || val.includes("светл") || val.includes("blond")) return "светлый блонд";
        if (val.includes("рус") || val.includes("ash")) return "русый";
        if (val.includes("каштан") || val.includes("шатен") || val.includes("brown") || val.includes("brunet")) return "каштановый";
        if (val.includes("черн") || val.includes("black")) return "черный цвет";
        if (val.includes("рыж") || val.includes("медн") || val.includes("red") || val.includes("copper") || val.includes("ginger")) return "рыжий цвет";
        if (val.includes("сед") || val.includes("пепел") || val.includes("grey") || val.includes("gray") || val.includes("white")) return "седой/пепельный цвет";
        return val;
      };

      const isCustomColorRequestedRef = customHairColor && customHairColor !== "Любой";
      if (isCustomColorRequestedRef) {
          prompt += `КРИТИЧЕСКИ ВАЖНО: Цвет волос строго ${translateColorRu(customHairColor).toUpperCase()}. `;
      } else if (hairColor) {
          prompt += `Цвет волос: ${translateColorRu(hairColor)}. `;
      }
      if (hairType) prompt += `Тип волос: ${hairType}. `;
      
      let fh = (facialHair || '').toLowerCase();
      if (fh && (fh.includes('clean') || fh.includes('shave') || fh.includes('без'))) {
          prompt += `Без бороды и усов. Обычная одежда. `;
      } else if (fh) {
          prompt += `Особенности: ${fh}. Обычная одежда. `;
      } else {
          prompt += `Без бороды и усов. Повседневная одежда. `;
      }

      prompt += `Светлый однотонный фон, нейтральное освещение.`;
      
      prompt = prompt.substring(0, 480).trim();

      let finalImageUrl = "";
      let lastError = "";

      const yandexServiceAccountKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
      const yandexFolderId = process.env.YANDEX_FOLDER_ID;

      if (yandexServiceAccountKey && yandexFolderId) {
        console.log("Generating reference via YandexART... prompt:", prompt);
        try {
            const cleanFolderId = extractFolderId(yandexFolderId);
            if (cleanFolderId === "MY_FOLDER_ID" || cleanFolderId.toLowerCase().includes("folder_id") || cleanFolderId.length < 5) {
                throw new Error(`[ОШИБКА НАСТРОЙКИ СЕРВЕРА] В YANDEX_FOLDER_ID указан плейсхолдер "${cleanFolderId}". Пожалуйста, пропишите реальный Идентификатор каталога на Render.com.`);
            }
            const iamToken = await getYandexIamToken(yandexServiceAccountKey);

          // 1. Start Async Generation
          const reqBody = {
            modelUri: `art://${cleanFolderId}/yandex-art/latest`,
            generationOptions: {
              seed: Math.floor(Math.random() * 10000000).toString(),
              aspectRatio: { widthRatio: "3", heightRatio: "4" }
            },
            messages: [
              { weight: 1, text: prompt }
            ]
          };

          let initRes = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${iamToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
          });

          if (!initRes.ok) {
            let errText = await initRes.text();
            
            // Retry with a safer, simplified prompt if we hit safety filters (often code 3)
            if (errText.includes("не могу сгенерировать") || errText.includes("другую тему") || errText.includes("code\":3")) {
              console.log("YandexART rejected the prompt. Retrying with a simplified, safe prompt...");
              const safePrompt = `Мужская или женская стрижка ${keyword}, портретное фото, нейтральный фон`;
              reqBody.messages[0].text = safePrompt.substring(0, 480).trim();
              
              initRes = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${iamToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
              });
              
              if (!initRes.ok) {
                errText = await initRes.text();
              }
            }
            
            if (!initRes.ok) {
              let diagnostic = "";
              if (errText.includes("model_uri") || errText.includes("modelUri") || initRes.status === 400) {
                  const masked = cleanFolderId.length > 5 
                     ? `${cleanFolderId.slice(0, 4)}...${cleanFolderId.slice(-4)}` 
                     : cleanFolderId;
                  diagnostic = `\n(Диагностика: YandexART отклонил запрос. Проверьте правильность YANDEX_FOLDER_ID на вашем сервере. Значение на сервере: "${masked}")`;
              }
              throw new Error(`YandexART Init Error: ${errText}${diagnostic}`);
            }
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
          console.error(`Не удалось сгенерировать изображение: ${lastError}. Используем fallback-изображение.`);
          finalImageUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80';
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
        gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        selfieImage, // Required for Step 2
        vtonStrength, // Number from 50 to 100
        targetImageUrl // Optional, generated reference image URL
      } = req.body;
      
      if (!keyword || !selfieImage) {
        return res.status(400).json({ error: "Missing parameters: keyword and selfieImage are required." });
      }

      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "Отсутствует FAL_KEY в переменных окружения." });
      }

      let finalImageUrl = "";
      let lastError = "";
      let swappedImageUrl = "";
      const selfieImageFull = selfieImage.startsWith('data:') ? selfieImage : `data:image/jpeg;base64,${selfieImage}`;

      const translateColor = (val: string) => {
        val = val.toLowerCase();
        if (val.includes("тёмно-каштан") || val.includes("темно-каштан")) return "dark brown";
        if (val.includes("блонд") || val.includes("светл")) return "BRIGHT PLATINUM BLONDE";
        if (val.includes("рус")) return "light brown";
        if (val.includes("каштан") || val.includes("шатен")) return "brown (brunette)";
        if (val.includes("черн") || val.includes("тёмн") || val.includes("темн")) return "deep dark black";
        if (val.includes("рыж") || val.includes("медн")) return "vivid intense copper red / ginger";
        if (val.includes("сед") || val.includes("пепел")) return "PURE WHITE / BRIGHT SILVER GREY";
        if (val.includes("розов")) return "vibrant pastel pink";
        if (val.includes("син") || val.includes("голуб")) return "vivid blue";
        if (val.includes("зелен") || val.includes("зелён")) return "vivid green";
        if (val.includes("фиолет")) return "vivid purple";
        if (val.includes("красн")) return "vivid red";
        return val;
      };

      // 0 means only change hair color, preserve original hairstyle exactly.
      // 1-74 means change shape keeping background.
      // 75-100 means studio shot (use reference image)
      const requestedStrength = Math.min(Math.max(typeof vtonStrength === 'number' ? vtonStrength : 50, 0), 100);
      
      let isStudioShot = requestedStrength >= 75;
      const isCustomColorRequested = customHairColor && customHairColor !== "Любой";
      const targetHairColor = isCustomColorRequested ? customHairColor : hairColor;
      const finalColor = targetHairColor && targetHairColor !== "Любой" ? translateColor(targetHairColor).toLowerCase() : "";
      
      let baseImageForFlux = selfieImageFull;
      let fluxStrength = 0.40;
      
      if (!isStudioShot) {
          baseImageForFlux = selfieImageFull;
          if (requestedStrength === 0) {
              fluxStrength = isCustomColorRequested ? 0.60 : 0.15; 
          } else {
              if (isCustomColorRequested) {
                  fluxStrength = 0.60 + (requestedStrength / 74) * 0.25; // 0.60 to 0.85
              } else {
                  fluxStrength = 0.35 + (requestedStrength / 74) * 0.40; // 0.35 to 0.75
              }
          }
      } else {
          if (targetImageUrl) {
              baseImageForFlux = targetImageUrl.startsWith('http') || targetImageUrl.startsWith('data:') 
                  ? targetImageUrl 
                  : `data:image/jpeg;base64,${targetImageUrl}`;
              
              if (isCustomColorRequested) {
                  fluxStrength = 0.80 + ((requestedStrength - 75) / 25) * 0.15; // 0.80 to 0.95
              } else {
                  fluxStrength = requestedStrength === 75 ? 0.05 : 0.40 + ((requestedStrength - 75) / 25) * 0.40; // 0.40 to 0.80
              }
          } else {
              baseImageForFlux = selfieImageFull;
              fluxStrength = isCustomColorRequested 
                  ? 0.80 + ((requestedStrength - 75) / 25) * 0.15
                  : 0.50 + ((requestedStrength - 75) / 25) * 0.30; // 0.50 to 0.80
          }
      }

      let descriptorEng = 'person';
      const g = (gender || '').toLowerCase().trim();
      if (g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy')) {
        descriptorEng = 'handsome young man';
      } else if (g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl')) {
        descriptorEng = 'beautiful young woman';
      }

      // Extract english keyword from something like "Пляжные волны (Beach Waves)"
      let englishKeyword = keyword;
      const bracketMatch = keyword.match(/\(([^)]+)\)/);
      if (bracketMatch && bracketMatch[1]) {
         englishKeyword = bracketMatch[1];
      }

      let promptEng = "";
      
      let extraColorPrompt = "";
      if (isCustomColorRequested && finalColor) {
         extraColorPrompt = ` The person has ${finalColor.toUpperCase()} hair. The hair is STRICTLY AND ABSOLUTELY ${finalColor.toUpperCase()} IN COLOR.`;
      } else if (finalColor) {
         extraColorPrompt = ` The person naturally has ${finalColor} hair. Maintain this underlying hair color gracefully.`;
      }

      // For english translation of the russian description, we provide a structured request to flux
      let fluxHairDetails = `Hairstyle specs: ${englishKeyword}.`;
      if (hairType) fluxHairDetails += ` Hair Texture: ${hairType}.`;
      if (hairLength) fluxHairDetails += ` Hair Length Constraint (from the guide): ${hairLength}.`;
      if (hairDensity && (hairDensity.includes("thin") || hairDensity.includes("sparse") || hairDensity.includes("редк"))) {
          fluxHairDetails += ` Hair Density: very thin, fine, sparse hair volume.`;
      }
      
      if (!isStudioShot) {
          if (requestedStrength === 0) {
             promptEng = `The exact same person from the original image, KEEP THE EXACT SAME HAIRSTYLE PRECISELY, but change the hair color. ${extraColorPrompt} Keep EVERYTHING ELSE EXACTLY the same: background, clothing, lighting, face, and pose.`;
          } else {
             promptEng = `The exact same person from the original image, but with a NEW HAIRSTYLE. ${fluxHairDetails} ${extraColorPrompt} Keep the same background, clothing, lighting, face, and pose. Context: ${description || ""}`;
          }
      } else {
          promptEng = `A photorealistic portrait of a ${descriptorEng}. NEW HAIRSTYLE TO APPLY: ${fluxHairDetails} ${extraColorPrompt} Context: ${description || ""}`;
      }
      
      const translateFaceShape = (val: string) => {
        val = val.toLowerCase();
        if (val.includes("овал")) return "oval";
        if (val.includes("круг") || val.includes("round")) return "round";
        if (val.includes("квадрат")) return "square";
        if (val.includes("сердц")) return "heart-shaped";
        if (val.includes("прямоуг")) return "rectangular";
        if (val.includes("ромб") || val.includes("брилл")) return "diamond";
        return val;
      };
      
      const featuresEng = [];
      if (faceShape && faceShape.length > 2) featuresEng.push(`face shape ${translateFaceShape(faceShape)}`);
      if (skinTone && skinTone.length > 2) featuresEng.push(`skin tone ${skinTone}`);
      if (eyeColor && eyeColor.length > 2) featuresEng.push(`eye color ${translateColor(eyeColor)}`);
      
      if (featuresEng.length > 0) {
        promptEng += ` The person has ${featuresEng.join(', ')}.`;
      }
      
      let fh = (facialHair || '').toLowerCase();
      if (fh && (fh.includes('clean') || fh.includes('shave'))) {
          promptEng += ` Clean shaven face.`;
      } else if (fh) {
          promptEng += ` Facial hair: ${fh}.`;
      }

      if (!isStudioShot) {
          if (clothingContext) {
              promptEng += ` EXACT SAME CLOTHING: ${clothingContext}.`;
          }
          if (requestedStrength === 0) {
              promptEng += ` CRITICAL: ONLY change the hair color. Do NOT change the hairstyle. Keep EVERYTHING exactly the same.`;
          } else {
              promptEng += ` CRITICAL: Keep EXACTLY the same background, clothing, environment, and pose as the original image. ONLY modify the hairstyle and color.`;
          }
      } else {
          promptEng += ` CRITICAL: Create a beautiful studio portrait or matching scene. Perfect lighting.`;
      }
      
      promptEng += ` Высокодетализированная естественная текстура кожи, видимые поры, без ретуши, несовершенства кожи. Amateur phone snapshot, high quality raw photography.`;
      
      if (finalColor) {
          promptEng += ` CRITICAL REQUIREMENT: THIS PERSON MUST HAVE ${finalColor.toUpperCase()} HAIR. DO NOT MAKE THE HAIR ANY OTHER COLOR. ${finalColor.toUpperCase()} HAIR ONLY!`;
      }

      promptEng = promptEng.substring(0, 1500).trim();

      if (fluxStrength <= 0.05 && targetImageUrl) {
          console.log("Skipping Flux Image-to-Image entirely, directly using targetImageUrl for FaceSwap...");
          finalImageUrl = baseImageForFlux;
      } else {
        try {
          console.log("Generating target blueprint via FAL.AI (Flux Dev Image-to-Image)... strength:", fluxStrength);
          let endpoint = "https://fal.run/fal-ai/flux/dev/image-to-image";
          
          const bodyPayload: any = {
             prompt: promptEng,
             image_url: baseImageForFlux,
             strength: fluxStrength,
             num_inference_steps: 28,
             guidance_scale: 3.5
          };
          
          const fluxRes = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Authorization": `Key ${falKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyPayload)
          });

          if (!fluxRes.ok) {
             const errData = await fluxRes.text();
             throw new Error(`FAL Flux Dev Error HTTP ${fluxRes.status}: ${errData}`);
          }
          
          const fluxData = await fluxRes.json();
          const generatedUrl = fluxData.images?.[0]?.url || fluxData.image?.url || fluxData.image_url || fluxData.url;
          
          if (generatedUrl) {
              finalImageUrl = generatedUrl;
          } else {
              throw new Error(`No image generated by Flux. Payload: ${JSON.stringify(fluxData)}`);
          }
        } catch (e: any) {
          throw e; 
        }
      }

      // Always run FaceSwap to ensure 100% facial feature retention
      try {
         console.log("Starting Virtual Try-On FaceSwap via FAL.AI...");
         const faceSwapPayload = {
           base_image_url: finalImageUrl,
           swap_image_url: selfieImageFull
         };
         console.log("FaceSwap Payload:", JSON.stringify(faceSwapPayload).substring(0, 500) + "... (truncated)");
         
         const falRes = await fetch("https://fal.run/fal-ai/face-swap", {
           method: "POST",
           headers: {
             "Authorization": `Key ${falKey}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify(faceSwapPayload)
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
      logToTelegram(`🎨 <b>Генерация (${req.body.userId || 'unknown'})</b>\nУспешно.`).catch(console.error);
      res.json({ 
        imageUrl: swappedImageUrl,            // Final processed image (face swapped)
        referenceImage: finalImageUrl,        // Original generation
        debugError: lastError 
      });

    } catch (err: any) {
      console.error("Full pipeline error:", err);
      logToTelegram(`❌ <b>Ошибка Генерации (${req.body.userId || 'unknown'})</b>\n<code>${err.message || 'Pipeline error'}</code>`).catch(console.error);
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

      logToTelegram(`👔 <b>Консультация (${req.body.userId || 'unknown'})</b>\nСгенерирована для: ${styleName}`).catch(console.error);

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

      logToTelegram(`❌ <b>Ошибка Консультации (${req.body.userId || 'unknown'})</b>\n<code>${errorMsg}</code>`).catch(console.error);

      res.status(500).json({ error: errorMsg });
    }
  });

  app.post("/api/chat-stylist", async (req, res) => {
    try {
      const { messages, features, styleName } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Missing or invalid messages array" });
      }

      let pureFeatures = { ...(features || {}) };
      delete pureFeatures.recommendations;
      
      const systemInstruction = `Ты - креативный и опытный звездный стилист-парикмахер. Твоя задача — отвечать на вопросы клиента о его волосах и стиле.
Физические данные клиента: ${JSON.stringify(pureFeatures)}.
Выбранная стрижка для обсуждения: ${styleName ? styleName : 'не указана'}.
Отвечай вежливо, профессионально, давай четкие, практичные советы.
Используй форматирование HTML (<strong>, <em>, <ul>, <li>, <p>, <br>) для лучшей читаемости, так как твой ответ будет вставлен в HTML документ. НЕ используй markdown (например, ** или \`\`\`html). Старайся отвечать лаконично, без лишней воды.`;

      const responseHtml = await callYandexGPTChat(systemInstruction, messages);
      
      let finalHtml = responseHtml.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();

      return res.json({ replyHtml: finalHtml });
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({ error: err.message || "Ошибка чата со стилистом" });
    }
  });

  app.post("/api/load-more", async (req, res) => {
    try {
      const { existingNames, features, preferredStyle } = req.body;

      console.log("Generating more recommendations via YandexGPT using cached features...");

      let pureFeatures2 = { ...(features || {}) };
      delete pureFeatures2.recommendations;
      const faceDescription = features ? JSON.stringify(pureFeatures2) : "Нет данных о лице (ошибка)";

      const systemInstruction = `Ты топовый и очень креативный парикмахер-стилист. Выведи ТОЛЬКО валидный JSON (без markdown и других символов).
Внимательно изучи описание внешности клиента (ТЕКУЩАЯ ДЛИНА И ГУСТОТА):
"${faceDescription}"

Ожидаемый стиль стрижки: ${preferredStyle !== undefined && preferredStyle !== 'Любой' ? preferredStyle : 'На твое усмотрение'}. КАТЕГОРИЧЕСКИ ВАЖНО подобрать 3 СОВЕРШЕННО РАЗНЫЕ, УНИКАЛЬНЫЕ стрижки, которые на 100% передают настроение и эстетику этого стиля. СТРОГО опирайся на КОЛИЧЕСТВО И КАЧЕСТВО ВОЛОС (учитывай залысины и густоту из описания) — не предлагай невыполнимые стрижки! НЕ предлагай стандартные повторяющиеся варианты (например, обычный фейд или кроп), сделай их максимально разнообразными!

ШАГ 1. Учитывая ПОЛ, текущую ДЛИНУ волос и ГУСТОТУ из описания.
ШАГ 2. Предложи 3 НОВЫЕ СОВЕРШЕННО РАЗНЫЕ стрижки (категорически не повторять: ${existingNames}).

ЖЕСТКАЯ ТАБЛИЦА ФИЗИЧЕСКИХ ОГРАНИЧЕНИЙ ДЛИНЫ ВОЛОС (МЫ ПРИМЕРЯЕМ НА ФОТО, НЕЛЬЗЯ УДЛИНЯТЬ ВОЛОСЫ ПРИМЕРКОЙ! Стрижка ДОЛЖНА быть КОРОЧЕ или РАВНОЙ текущей длине волос оригинала):
1. Если у клиента "Лысый": советовать ТОЛЬКО "Полное бритье головы" (Clean head shave) или "Гладкая лысина".
2. Если у клиента "Ежик/Очень короткие" (волосы до 2 см): разрешается предлагать ТОЛЬКО ультракороткие варианты (Базз-кат, Милитари фейд, Френч кроп).
3. Если у клиента "Короткие" (волосы от 2 до 7 см): предлагайте самые разнообразные варианты (Андеркат, Квифф, Цезарь, Помпадур-лайт - главное нестандартно!). Выбор должен СТРОГО соответствовать стилю.
4. Если у клиента "Средние" (волосы от 7 до 15 см): разрешается предлагать средние или короткие стрижки.
5. Если у клиента "Длинные" (волосы более 15 см): можно советовать любые стрижки.

ОБЯЗАТЕЛЬНО УЧИТЫВАЙТЕ густоту волос клиента! Если волосы "Редкие/Тонкие" или есть залысины - предлагайте стрижки для тонких волос, скрывающие недостатки.

АБСОЛЮТНОЕ ПРАВИЛО 1: Описание строго на русском языке.
АБСОЛЮТНОЕ ПРАВИЛО 2: КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать длинные стрижки, если у клиента короткие волосы или залысины. 
АБСОЛЮТНОЕ ПРАВИЛО 3: Исключить следующие стрижки, они уже были предложены: ${existingNames}.
АБСОЛЮТНОЕ ПРАВИЛО 4: В поле imageKeyword ОБЯЗАТЕЛЬНО укажи уникальное название стрижки ТОЧНО НА АНГЛИЙСКОМ языке, густоту волос (ОБЯЗАТЕЛЬНО пиши 'thin hair' или 'receding hairline' если волосы редкие или есть залысины) и длину. Иначе генератор не поймет стрижку.

Верни массив "recommendations":
{
  "recommendations": [
    {
      "name": "Название (креативное и уникальное)",
      "description": "Описание (почему идеально подходит)",
      "stylingTips": "Укладка",
      "imageKeyword": "Exact english haircut name, hair length, hair density/status"
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
      logToTelegram(`🔄 <b>Новые стрижки (${req.body.userId || 'unknown'})</b>\nУспешно.`).catch(console.error);
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
      
      logToTelegram(`❌ <b>Ошибка Новых Стрижек (${req.body.userId || 'unknown'})</b>\n<code>${errorMsg}</code>`).catch(console.error);

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
      const { userId, tgUserId, packageId = 10 } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        return res
          .status(500)
          .json({ error: "Telegram Bot Token is not configured" });
      }

      // Определяем пакеты: 5, 10 или 30 генераций
      type PackageConfig = { stars: number; label: string };
      const packages: Record<number, PackageConfig> = {
        5: { stars: 50, label: "5 Генераций" },
        10: { stars: 100, label: "10 Генераций" },
        30: { stars: 250, label: "30 Генераций" },
      };

      const selectedPackage = packages[packageId] || packages[10];

      const payloadString = JSON.stringify({ userId, tgUserId, package: packageId });
      
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: selectedPackage.label,
            description: `Пакет на ${packageId} примерных генераций нейростилиста`,
            payload: payloadString,
            provider_token: "", // Empty for Telegram Stars
            currency: "XTR",
            prices: [{ label: selectedPackage.label, amount: selectedPackage.stars }], 
          }),
        },
      );

      const data = await response.json();
      
      // Fallback for ToS acceptance: If createInvoiceLink fails because the bot owner
      // hasn't accepted Stars ToS, try to send an invoice to them directly to trigger it.
      if (!data.ok && data.description?.includes("PROVIDER_ACCOUNT_INVALID")) {
        console.log("Triggering sendInvoice fallback for ToS acceptance...");
        const sendResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/sendInvoice`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: tgUserId || userId, // Admin or current user
              title: `${selectedPackage.label} (Принятие условий)`,
              description: "Нажмите оплатить, чтобы принять условия Telegram Stars (если вы владелец бота)",
              payload: payloadString,
              provider_token: "",
              currency: "XTR",
              prices: [{ label: selectedPackage.label, amount: selectedPackage.stars }]
            }),
          }
        );
        const sendData = await sendResponse.json();
        if (sendData.ok) {
           return res.status(400).json({ error: "Для приема платежей звездами необходимо принять условия Telegram! Мы отправили вам счет в чат с ботом. Закройте это окно, перейдите в чат с ботом и нажмите 'Оплатить', чтобы принять условия Telegram Stars." });
        }
      }

      if (data.ok) {
        logToTelegram(`💳 <b>Создан счет (${userId}) на 100 Stars</b>`).catch(console.error);
        res.json({ invoiceUrl: data.result });
      } else {
        logToTelegram(`❌ <b>Ошибка создания счета (${userId})</b>\n${data.description}`).catch(console.error);
        res
          .status(400)
          .json({ error: data.description || "Failed to create invoice" });
      }
    } catch (err: any) {
      console.error(err);
      logToTelegram(`❌ <b>Ошибка генерации инвойса (${req.body.userId || 'unknown'})</b>\n<code>${err.message || 'Error'}</code>`).catch(console.error);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/set-telegram-webhook", async (req, res) => {
    try {
      const { webAppUrl } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken || !webAppUrl) {
         return res.status(400).json({ error: "Missing botToken or webAppUrl" });
      }
      
      const webhookUrl = `${webAppUrl}/api/telegram-webhook`;
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl })
      });
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Telegram Webhook for processing payments
  app.post("/api/telegram-webhook", async (req, res) => {
    try {
      const update = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      // Handle Pre-checkout Query
      if (update.pre_checkout_query) {
        const preCheckoutQueryId = update.pre_checkout_query.id;
        
        if (botToken) {
          await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pre_checkout_query_id: preCheckoutQueryId,
              ok: true
            })
          });
        }
        return res.sendStatus(200);
      }

      // Handle Successful Payment
      if (update.message && update.message.successful_payment) {
        const tgUserId = update.message.from?.id;
        const payloadStr = update.message.successful_payment.invoice_payload;
        
        let firebaseUserId = null;
        let purchasedGenerations = 10;
        try {
          const payloadObj = JSON.parse(payloadStr);
          firebaseUserId = payloadObj.userId;
          if (payloadObj.package) {
            purchasedGenerations = Number(payloadObj.package);
          }
          if (firebaseUserId === "local-user" || !firebaseUserId) {
            firebaseUserId = tgUserId.toString();
          }
        } catch(e) {
          firebaseUserId = tgUserId.toString();
        }
        
        logToTelegram(`✅ <b>Оплата успешна!</b> Пользователь: ${tgUserId}. Куплено: ${purchasedGenerations}. payload: ${payloadStr}`).catch(console.error);

        try {
          const admin = await import("firebase-admin");
          const fs = await import("fs");
          
          if (!admin.apps.length) {
            const configPath = "./firebase-applet-config.json";
            if (fs.existsSync(configPath)) {
              const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
              admin.initializeApp({
                projectId: config.projectId,
              });
            }
          }
          
          if (admin.apps.length > 0 && firebaseUserId) {
            const db = admin.firestore();
            const configPath = "./firebase-applet-config.json";
            const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            db.settings({ databaseId: config.firestoreDatabaseId });
            
            const userRef = db.collection("users").doc(firebaseUserId.toString());
            await userRef.set({
              generationsLeft: admin.firestore.FieldValue.increment(purchasedGenerations),
              fullAccess: true,
            }, { merge: true });
            console.log(`Updated Firestore for user ${firebaseUserId} via Admin SDK`);
          }
        } catch (dbErr) {
          console.error("Failed to update Firestore via Admin SDK:", dbErr);
        }

        if (botToken && tgUserId) {
          // Send success message to user
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: tgUserId,
              text: "✅ Доступ открыт! Поздравляем с успешной оплатой и приобретением полного доступа ко всем функциям."
            })
          });
        }
        
        // Note: The actual database addition usually goes here. 
        // e.g. updateDoc(doc(db, "users", userId), { generationsLeft: increment(100), fullAccess: true });
        
        return res.sendStatus(200);
      }

      // Keep it alive for other updates
      res.sendStatus(200);
    } catch (err) {
      console.error("Webhook error:", err);
      res.sendStatus(500);
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
