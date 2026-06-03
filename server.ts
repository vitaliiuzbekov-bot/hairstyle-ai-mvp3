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
        temperature: 0.7,
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
- hairLength (ОБЯЗАТЕЛЬНО проанализируй длину и выбери одну из категорий: "Лысый", "Ежик/Очень короткие", "Короткие", "Средние", "Длинные" - НА РУССКОМ)
- hairDensity (ОБЯЗАТЕЛЬНО: "Редкие/Тонкие", "Средние", "Густые" - НА РУССКОМ)
- hairType ("Прямые", "Волнистые", "Кудрявые" - НА РУССКОМ)
- skinTone (на английском)
- skinDetails (на английском)
- hairColor (на английском)
- eyeColor (на английском)
- ageRange (на английском, e.g., "20-30")
- facialFeatures (на английском)
- facialHair (на английском)

ЖЕСТКАЯ ТАБЛИЦА ФИЗИЧЕСКИХ ОГРАНИЧЕНИЙ ДЛИНЫ ВОЛС ПРИ ПОДБОРЕ (МЫ ПРИМЕРЯЕМ НА ФОТО, НЕЛЬЗЯ УДЛИНЯТЬ ИЛИ ДОРИСОВЫВАТЬ ВОЛОСЫ ПРИМЕРКОЙ! Стрижка ДОЛЖНА быть КОРОЧЕ или РАВНОЙ текущей длине волос оригинала):
1. Если у клиента "Лысый": разрешается советовать ТОЛЬКО "Полное бритье головы" (Clean head shave) или "Гладкая лысина". Любые другие стрижки запрещены!
2. Если у клиента "Ежик/Очень короткие" (волосы до 1.5-2 см): разрешается предлагать ТОЛЬКО "Базз-кат (Buzz cut)", "Милитари фейд", "Ультракороткий кроп (Ultra-short crop)". Любые классические, модельные, объемные кудри, челки или прически со средними волосами КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНЫ.
3. Если у клиента "Короткие" (волосы от 2 до 7 см): разрешается предлагать ТОЛЬКО короткие стрижки: "Короткий кроп (Short crop)", "Текстурированный фейд (Textured fade)", "Бокс / Полубокс", "Цезарь". КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО советовать маллет, каре, каскад, помпадур, квифф, андеркат с длинными прядями или любые средние/длинные прически! Длина предлагаемого образа должна быть КРАЙНЕ короткой и аккуратной.
4. Если у клиента "Средние" (волосы от 7 до 15 см): разрешается предлагать средние или короткие стрижки (каре, шегги, маллет, андеркат, короткий кроп). Запрещено советовать длинные волосы (ниже плеч).
5. Если у клиента "Длинные" (волосы более 15 см): можно советовать любые стрижки (так как стрижка укорачивает волосы).

ДОПОЛНИТЕЛЬНЫЕ КРИТИЧЕСКИЕ ПРАВИЛА:
1. КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать пышные объемные прически с высокой плотностью волос, если у клиента "Редкие/Тонкие" волосы или есть залысины. Для тонких/редких волос предлагай стрижки, скрывающие залысины или подчеркивающие текстуру (например, текстурированный кроп с коротким верхом, фейд, ультракороткий базз-кат).
2. Стрижка должна быть выполнима путем ОБРЕЗАНИЯ текущих волос. Мы не можем дорисовать плотность или длину.
3. Ожидаемый стиль стрижки: ${preferredStyle !== undefined && preferredStyle !== 'Любой' ? preferredStyle : 'На твое усмотрение'}. Если стиль указан и не равен "На твое усмотрение", предложи креативные варианты в стиле "${preferredStyle}".

ВНИМАНИЕ: ТЫ ОБЯЗАН ВЕРНУТЬ РОВНО ТРИ (3) ВАРИАНТА СТРИЖКИ. СТРОГО 3 ВАРИАНТА, НЕ МЕНЬШЕ И НЕ БОЛЬШЕ.
ЕСЛИ ТЫ НЕ ВЕРНЕШЬ 3 ВАРИАНТА, ПРИЛОЖЕНИЕ СЛОМАЕТСЯ.

Твой ответ должен быть СТРОГО в формате валидного JSON объекта:
{
  "warning": "Предупредите мягко, если запрос недостижим" (или пустая строка),
  "recommendations": [
    // В ЭТОМ МАССИВЕ ДОЛЖНО БЫТЬ СТРОГО 3 (ТРИ) ОБЪЕКТА С РАЗНЫМИ СТРИЖКАМИ!
    {
      "name": "Название стрижки на русском",
      "description": "Честное объяснение, почему она подходит...",
      "stylingTips": "Советы по укладке...",
      "imageKeyword": "Haircut name, hair density, hair length (english)"
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
      const { gender, keyword, faceShape, hairLength, hairDensity, hairType, skinTone, skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair } = req.body;
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

      let prompt = `Студийный портрет крупным планом, по центру кадра, смотрит прямо в камеру, нейтральное выражение лица. Модель: ${descriptorRu}. Прическа и стрижка: "${keyword}". `;
      
      if (lengthRu) {
         prompt += `Длина волос: ${lengthRu}. `;
      }
      if (hairDensity && (hairDensity.includes("thin") || hairDensity.includes("sparse") || hairDensity.includes("редк"))) {
         prompt += `Тонкие волосы, низкая густота. `;
      } else {
         prompt += `Естественная густота волос, без излишеств. `;
      }
      
      const translateColorRu = (val: string) => {
        val = val.toLowerCase();
        if (val.includes("блонд") || val.includes("светл")) return "светлый блонд";
        if (val.includes("русый")) return "светло-русый";
        if (val.includes("каштан") || val.includes("шатен")) return "каштановый";
        if (val.includes("черн") || val.includes("тёмн") || val.includes("темн")) return "черный цвет";
        if (val.includes("рыж") || val.includes("медн")) return "рыжий цвет";
        if (val.includes("сед")) return "пепельный цвет";
        return val;
      };

      if (hairColor) prompt += `Цвет волос: ${translateColorRu(hairColor)}. `;
      if (hairType) prompt += `Тип волос: ${hairType}. `;
      
      let fh = (req.body.facialHair || '').toLowerCase();
      if (fh && (fh.includes('clean') || fh.includes('shave'))) {
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

      // Fallback to YandexART
      const yandexServiceAccountKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
      const yandexFolderId = process.env.YANDEX_FOLDER_ID;

      if (yandexServiceAccountKey && yandexFolderId) {
        console.log("Generating reference via YandexART as fallback... prompt:", prompt);
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
              aspectRatio: { widthRatio: "1", heightRatio: "1" }
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
                  diagnostic = `\n(Диагностика: YandexART отклонил запрос. Проверьте правильность YANDEX_FOLDER_ID на вашем сервере (Render.com). Значение на сервере: "${masked}")`;
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
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair,
        selfieImage, // Required for Step 2
        vtonStrength // Number from 50 to 100
      } = req.body;
      
      if (!keyword || !selfieImage) {
        return res.status(400).json({ error: "Missing parameters: keyword and selfieImage are required." });
      }

      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "Отсутствует FAL_KEY в переменных окружения." });
      }

      // Convert vtonStrength (50-100) to actual flux strength (0.50 - 0.95)
      const requestedStrength = typeof vtonStrength === 'number' ? vtonStrength : 85;
      const fluxStrength = Math.min(Math.max(requestedStrength / 100, 0.50), 0.95);

      let finalImageUrl = "";
      let lastError = "";
      let swappedImageUrl = "";
      const selfieImageFull = selfieImage.startsWith('data:') ? selfieImage : `data:image/jpeg;base64,${selfieImage}`;

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

      let promptEng = `A photorealistic high-quality portrait of a ${descriptorEng} with a NEW HAIRCUT: "${englishKeyword}". CRITICAL: KEEP the person's face, pose, clothing, and background EXACTLY the same, but COMPLETELY REPLACE the hair with a perfect "${englishKeyword}" hairstyle. `;
      
      if (hairDensity && (hairDensity.includes("thin") || hairDensity.includes("sparse") || hairDensity.includes("редк"))) {
         promptEng += ` The hair is VERY THIN and SPARSE.`;
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

      const translateColor = (val: string) => {
        val = val.toLowerCase();
        if (val.includes("блонд") || val.includes("светл")) return "blonde";
        if (val.includes("русый")) return "light brown";
        if (val.includes("каштан") || val.includes("шатен")) return "brown";
        if (val.includes("черн") || val.includes("тёмн") || val.includes("темн")) return "black";
        if (val.includes("рыж") || val.includes("медн")) return "red / copper";
        if (val.includes("сед")) return "grey / silver";
        return val;
      };

      const featuresEng = [];
      if (faceShape && faceShape.length > 2) featuresEng.push(`face shape ${translateFaceShape(faceShape)}`);
      if (skinTone && skinTone.length > 2) featuresEng.push(`skin tone ${skinTone}`);
      if (eyeColor && eyeColor.length > 2) featuresEng.push(`eye color ${translateColor(eyeColor)}`);
      if (featuresEng.length > 0) promptEng += `Appearance: ${featuresEng.join(', ')}. `;
      
      const targetHairColor = customHairColor || hairColor;

      if (customHairColor) {
         promptEng += `CRITICAL: HAIR COLOR MUST BE STRICTLY ${translateColor(customHairColor)}! Do not use any other color. `;
      } else if (targetHairColor) {
         promptEng += `CRITICAL: Preserve original hair color: ${translateColor(targetHairColor)}. `;
      }
      
      if (hairType) promptEng += `Hair texture: ${hairType}. `;
      
      let fh = (facialHair || '').toLowerCase();
      if (fh && (fh.includes('clean') || fh.includes('shave'))) {
          promptEng += `CRITICAL: Clean shaven face, strictly NO BEARD (no beard). `;
      } else if (fh) {
          promptEng += `Facial hair: ${fh}. `;
      } else {
          promptEng += `Clean shaven face. `;
      }

      promptEng += `CRITICAL: PRESERVE EXACT CLOTHING AND SHOULDERS FROM ORIGINAL IMAGE. DO NOT CHANGE SHIRT OR OUTFIT. Neutral simple background. KEEP FACE COMPLETELY UNCHANGED.`;

      // Skip clothing describing to save time and avoid 504 Gateway Timeout
      /*
      try {
        console.log("Extracting clothing and background context to preserve it...");
        const visionRes = await fetch("https://fal.run/fal-ai/any-llm/vision", {
           method: "POST",
           headers: {
             "Authorization": `Key ${falKey}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify({
             image_url: selfieImageFull,
             prompt: "Describe ONLY the clothing (exact color, type, neckline) and the background (color, setting) in one concise sentence. Do not describe the person's face, hair, or pose."
           })
        });
        if (visionRes.ok) {
           const visionData = await visionRes.json();
           if (visionData.output) {
              promptEng += ` Exact Scene Constraints: ${visionData.output}.`;
              console.log("Detected Scene:", visionData.output);
           }
        }
      } catch (e) {
        console.log("Vision clothing extraction failed, continuing...", e);
      }
      */

      promptEng = promptEng.substring(0, 700).trim();

      try {
        console.log("Generating new haircut via FAL.AI (Flux I2I)...");
        let endpoint = "https://fal.run/fal-ai/flux/dev/image-to-image";
        const bodyPayload: any = {
          image_url: selfieImageFull,
          prompt: promptEng,
          strength: fluxStrength,
          num_inference_steps: 15
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

  app.post("/api/load-more", async (req, res) => {
    try {
      const { existingNames, features, preferredStyle } = req.body;

      console.log("Generating more recommendations via YandexGPT using cached features...");

      let pureFeatures2 = { ...(features || {}) };
      delete pureFeatures2.recommendations;
      const faceDescription = features ? JSON.stringify(pureFeatures2) : "Нет данных о лице (ошибка)";

      const systemInstruction = `Ты строгий парикмахер-стилист. Выведи ТОЛЬКО валидный JSON (без markdown и других символов).
Внимательно изучи описание внешности клиента (ТЕКУЩАЯ ДЛИНА И ГУСТОТА):
"${faceDescription}"

Ожидаемый стиль стрижки: ${preferredStyle !== undefined && preferredStyle !== 'Любой' ? preferredStyle : 'На твое усмотрение'}. Если стиль указан и не равен "На твое усмотрение", КАТЕГОРИЧЕСКИ ВАЖНО подобрать 3 СОВЕРШЕННО РАЗНЫЕ, УНИКАЛЬНЫЕ стрижки, которые на 100% передают настроение и эстетику стиля "${preferredStyle}". НЕ предлагай стандартные повторяющиеся варианты, прояви креатив и предложи именно стрижки в стиле "${preferredStyle}", строго соблюдая правила длины и густоты.

ШАГ 1. Учитывая ПОЛ, текущую ДЛИНУ волос и ГУСТОТУ из описания.
ШАГ 2. Предложи 3 НОВЫЕ СОВЕРШЕННО РАЗНЫЕ стрижки (не повторять: ${existingNames}).

ЖЕСТКАЯ ТАБЛИЦА ФИЗИЧЕСКИХ ОГРАНИЧЕНИЙ ДЛИНЫ ВОЛС ПРИ ПОДБОРЕ (МЫ ПРИМЕРЯЕМ НА ФОТО, НЕЛЬЗЯ УДЛИНЯТЬ ИЛИ ДОРИСОВЫВАТЬ ВОЛОСЫ ПРИМЕРКОЙ! Стрижка ДОЛЖНА быть КОРОЧЕ или РАВНОЙ текущей длине волос оригинала):
1. Если у клиента "Лысый": разрешается советовать ТОЛЬКО "Полное бритье головы" (Clean head shave) или "Гладкая лысина". Любые другие стрижки запрещены!
2. Если у клиента "Ежик/Очень короткие" (волосы до 1.5-2 см): разрешается предлагать ТОЛЬКО "Базз-кат (Buzz cut)", "Милитари фейд", "Ультракороткий кроп (Ultra-short crop)". Любые классические, модельные, объемные кудри, челки или прически со средними воласами КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНЫ.
3. Если у клиента "Короткие" (волосы от 2 до 7 см): разрешается предлагать ТОЛЬКО короткие стрижки: "Короткий кроп (Short crop)", "Текстурированный фейд (Textured fade)", "Бокс / Полубокс", "Цезарь". КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО советовать маллет, каре, каскад, помпадур, квифф, андеркат с длинными прядями или любые средние/длинные прически! Длина предлагаемого образа должна быть КРАЙНЕ короткой и аккуратной.
4. Если у клиента "Средние" (волосы от 7 до 15 см): разрешается предлагать средние или короткие стрижки (каре, шегги, маллет, андеркат, короткий кроп). Запрещено советовать длинные волосы (ниже плеч).
5. Если у клиента "Длинные" (волосы более 15 см): можно советовать любые стрижки (так как стрижка укорачивает волосы).

АБСОЛЮТНОЕ ПРАВИЛО 1: Описание строго на русском языке.
АБСОЛЮТНОЕ ПРАВИЛО 2: КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать длинные, средние или классические объемные стрижки, если у клиента короткие волосы, базз-кат, ежик или залысины. Стрижка должна быть выполнима путем обрезания текущих волос.
АБСОЛЮТНОЕ ПРАВИЛО 3: КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать объемные густые стрижки, если у клиента тонкие/редкие волосы.
АБСОЛЮТНОЕ ПРАВИЛО 4: Исключить следующие стрижки, они уже были предложены: ${existingNames}.
АБСОЛЮТНОЕ ПРАВИЛО 5: В поле imageKeyword ОБЯЗАТЕЛЬНО укажи густоту волос и длину на английском языке (например: buzz cut, thin receding hair, very short hair).

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
      const { userId, tgUserId } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        return res
          .status(500)
          .json({ error: "Telegram Bot Token is not configured" });
      }

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendInvoice`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgUserId || userId, // Use tgUserId for chat_id
            title: "Доступ к боту",
            description: "Полный доступ ко всем функциям",
            payload: JSON.stringify({ userId, tgUserId, package: 100 }), // Important: We still include the Firebase UID
            provider_token: "", // Empty for Telegram Stars
            currency: "XTR",
            prices: [{ label: "Полный доступ", amount: 100 }], // 100 Stars
          }),
        },
      );

      const data = await response.json();
      if (data.ok) {
        logToTelegram(`💳 <b>Отправлен счет (${userId}) на 100 Stars</b>`).catch(console.error);
        res.json({ success: true, message: "Счет отправлен в чат" });
      } else {
        logToTelegram(`❌ <b>Ошибка отправки счета (${userId})</b>\n${data.description}`).catch(console.error);
        res
          .status(400)
          .json({ error: data.description || "Failed to send invoice" });
      }
    } catch (err: any) {
      console.error(err);
      logToTelegram(`❌ <b>Ошибка генерации инвойса (${req.body.userId || 'unknown'})</b>\n<code>${err.message || 'Error'}</code>`).catch(console.error);
      res.status(500).json({ error: err.message });
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
        try {
          const payloadObj = JSON.parse(payloadStr);
          firebaseUserId = payloadObj.userId;
        } catch(e) {}
        
        logToTelegram(`✅ <b>Оплата успешна!</b> Пользователь: ${tgUserId}. payload: ${payloadStr}`).catch(console.error);

        try {
          // Initialize Firebase if not already initialized
          const { initializeApp, getApps } = await import("firebase/app");
          const { getFirestore, doc, updateDoc, increment, getDoc } = await import("firebase/firestore");
          
          let appInstance;
          if (getApps().length === 0) {
            const fs = await import("fs");
            const configPath = "./firebase-applet-config.json";
            if (fs.existsSync(configPath)) {
              const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
              appInstance = initializeApp(config);
            }
          } else {
            appInstance = getApps()[0];
          }

          if (appInstance && firebaseUserId) {
            const configPath = "./firebase-applet-config.json";
            const fs = await import("fs");
            const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            const db = getFirestore(appInstance, config.firestoreDatabaseId);
            const userRef = doc(db, "users", firebaseUserId.toString());
            const snap = await getDoc(userRef);
            if (snap.exists()) {
              await updateDoc(userRef, {
                generationsLeft: increment(100),
                fullAccess: true,
              });
              console.log(`Updated Firestore for user ${firebaseUserId}`);
            }
          }
        } catch (dbErr) {
          console.error("Failed to update Firestore:", dbErr);
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
