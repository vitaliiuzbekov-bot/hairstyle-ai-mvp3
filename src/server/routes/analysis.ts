import { Request, Response, Router } from "express";
import { logToTelegram } from "../services/logger";
import { callYandexGPT } from "../services/yandex";

export const analysisRouter = Router();

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

analysisRouter.post("/analyze", async (req: Request, res: Response): Promise<void> => {
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
      route: "analyze",
      imageHash: getCacheKey(targetBase64),
      preferredStyle: preferredStyle || "Любой",
      faceApiGender, faceApiShape, faceApiAge
    };
    const cacheKey = getCacheKey(cacheKeyParams);
    
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

    const preDetectedFacts = faceApiGender ? `[PRE-DETECTED FACTS BY FACE-API: Gender is STRICTLY ${faceApiGender === 'male' ? 'MALE' : 'FEMALE'}. Age is approx ${faceApiAge}. Face shape is EXACTLY ${faceApiShape}. ${req.body.localSkinTone ? `Skin tone: ${req.body.localSkinTone}.` : ''} ${req.body.localHairColor ? `Hair color: ${req.body.localHairColor}.` : ''}]` : "";
    
    if (skipVision && preDetectedFacts) {
        console.log("Skipping Vision API, using frontend provided parameters only.");
        visualDescription = preDetectedFacts 
          + "\nAssume short to medium hair length, medium density by default unless otherwise specified. Generate creative recommendations strictly matching the pre-detected facts.";
    } else {
        const visionPrompt = `You are an expert trichologist, physiognomist and master hair stylist. Analyze this person's face and hair with ultimate precision from the photo. Provide a very detailed clinical description: 
${preDetectedFacts} 
1) EXACT gender and estimated age. (USE PRE-DETECTED FACTS IF AVAILABLE)
2) Precise face shape. (USE PRE-DETECTED FACTS IF AVAILABLE)
3) EXACT hair length in cm and category (bald, buzz, short, medium, long). 
4) EXACT hair density (thick, medium, thin, sparse, balding) and exact status of the hairline (is there a receding hairline, temporal thinning, bald spots?). 
5) Hair texture (straight, wavy, curly, coily). 
6) Current true hair color. CRITICAL: Closely examine the roots and overall tone! Brown hair can look yellowish under lighting glare, do NOT mistake light brown / chestnut hair for blonde due to lighting. (USE PRE-DETECTED FACTS IF AVAILABLE)
7) Skin tone and facial hair style (beard, mustache, clean shaven). 
8) ONLY a concise description of clothing (exact color, type) and background (color/setting). Evaluate hair quality objectively. Be brutally honest.`;

        let mimeTypeStr = "image/jpeg";
        let base64PrefixRemoved = targetBase64;
        if (targetBase64.startsWith("data:")) {
            mimeTypeStr = targetBase64.substring("data:".length, targetBase64.indexOf(";base64,"));
            base64PrefixRemoved = targetBase64.replace(/^data:[\w-]+\/[\w-]+;base64,/, "");
        }
        
        try {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ 
                apiKey: process.env.GEMINI_API_KEY
            });
            
            let retries = 5;
            let attempt = 0;
            while (retries > 0) {
                try {
                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: [
                          { text: visionPrompt },
                          {
                            inlineData: {
                              mimeType: mimeTypeStr || "image/jpeg",
                              data: base64PrefixRemoved
                            }
                          }
                        ]
                    });
                    visualDescription = preDetectedFacts + "\n" + (response.text || "");
                    break;
                } catch (err: any) {
                    retries--;
                    attempt++;
                    let errMsg = err.message || JSON.stringify(err);
                    if (retries === 0) {
                        if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand")) {
                            throw new Error("Нейросеть сейчас испытывает высокую нагрузку (503). Пожалуйста, подождите минуту и попробуйте снова.");
                        }
                        throw err;
                    }
                    console.warn(`Gemini Vision attempt failed, retrying... (${attempt}/5)`, err.message);
                    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
                }
            }
        } catch (e: any) {
            console.error("Gemini Vision failed:", e.message);
            throw new Error(`Vision Analysis Error: ${e.message}`);
        }
    }
    console.timeEnd("Yandex Vision (Analysis)");

    console.time("YandexGPT");
    console.log("Generating recommendations via YandexGPT...");

    const systemText = `Ты топовый и очень креативный парикмахер-стилист. Твоя задача — проанализировать детальное клиническое описание внешности клиента и предложить 3 СОВЕРШЕННО РАЗНЫХ И НЕСТАНДАРТНЫХ варианта стрижки. 
Output EXCLUSIVELY a JSON object (no markdown, no backticks, strictly parseable JSON).

Сначала выдели характеристики в соответствии со следующими правилами:
- gender ("male" или "female", строго соответствуй полу из описания!)
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

ЖЕСТКИЕ ПРАВИЛА И ОГРАНИЧЕНИЯ ДЛЯ ПОДБОРА СТРИЖЕК (НА ОСНОВЕ ТЕКУЩИХ ПАРАМЕТРОВ):

1. ТРЕБОВАНИЕ К ДЛИНЕ ВОЛОС И ОБЛЫСЕНИЮ (КРИТИЧЕСКИ ВАЖНО):
   Мы не можем "наращивать" волосы примеркой. Предлагаемые стрижки должны быть РАВНЫМИ или КОРОЧЕ текущей длины волос:
   - Если клиент "Лысый" или имеет выраженную обширную лысину: КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО рекомендовать густые длинные прически! Предлагай только:
     1. "Clean head shave" (Полное бритье головы опасной бритвой) - стильно и брутально.
     2. "Ultra-short buzz cut" (Ультракороткий ежик под машинку 1-3 мм) - подчеркивает мужественность при глубоких залысинах.
     3. "Head shave with stubble" (Бритье головы с эффектом 3-дневной щетины).
   - Если "Ежик/Очень короткие" (до 2 см): только ультракороткие стрижки (Базз-кат, Милитари фейд, Ультракороткий кроп, Френч кроп). Никаких андеркатов с длинным верхом или причесок с длинной челкой!
   - Если "Короткие" (от 2 до 7 см): Текстурированный кроп, Короткий Цезарь, Фейд с коротким зачесом, Квифф (с коротким верхом), Ежик. Запрещено предлагать средние/длинные стрижки (каре, шэгги, британка с длинной челкой, маллет).
   - Если "Средние" (от 7 до 15 см): любые средние (Помпадур, Андеркат, Сайд-парт, Квифф) или короткие стрижки. Запрещены стрижки на плечи или каскады.
   - Если "Длинные" (более 15 см): допустима любая длина.

2. ТРЕБОВАНИЕ К ГУСТОТЕ И ЗАЛЫСИНАМ (МАКСИМАЛЬНОЕ РАЗНООБРАЗИЕ):
   Если у клиента редкие/тонкие волосы ("Редкие/Тонкие") или указаны залысины (receding hairline, M-shape, temporal thinning, bald spots):
   - КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО зацикливаться на банальном или уродливом Кропе / Челке вперед! Предлагай благородные, разнообразные и современные стрижки, подходящие под стиль жизни!
   - Для ТОНКИХ волос и ЗАЛЫСИН существует великолепный арсенал:
     - Для делового стиля: предложи аккуратный "Executive Side Part" (аккуратный пробор с низкой растушевкой по бокам, визуально отвлекающий от залысин), "Smart Ivy League" (интеллигентный Айви-Лиг с зачесом челки набоко-вперед), или "Tapered Low Fade Crew Cut" (элегантный классический полубокс).
     - Для кэжуал/будничного стиля: предложи "Short Textured Quiff" (текстурный квифф, где пряди укладываются хаотично набок/вверх и прекрасно маскируют височные пробелы), "Caesar Fade" (элегантный Цезарь с легкой текстурой).
     - Для спортивного стиля: "Sporty Tapered Buzz Cut" (классический спортивный ультракороткий базз-кат с мягким переходом), "High and Tight".
   - Стрижки должны выглядеть естественно, премиально, солидно и стильно с учетом текстуры клиента!

3. ТРЕБОВАНИЕ К ПОЛУ И ВОЗРАСТУ:
   - Если сфотографировалась женщина средних лет или пожилая женщина (бабушка), предлагай исключительно СТИЛЬНЫЕ ЖЕНСКИЕ СТРИЖКИ (например, женский Пикси, Боб, Шегги, Каре, Ультракороткий текстурированный женский кроп), соответствующие ее возрасту! Никогда не предлагай бабушкам мужские стрижки вроде "Кроп" или "Фейд", пиши соответствующие ее возрасту модные женские названия.
   - Для детей предлагай стильные молодежные, детские и практичные стрижки.

4. ТРЕБОВАНИЕ К ВЫБРАННОМУ СТИЛЮ (ЖЕСТКОЕ СООТВЕТСТВИЕ СТИЛЮ):
   Ожидаемый стиль стрижки: \${preferredStyle !== undefined && preferredStyle !== 'Любой' ? preferredStyle : 'Любой (на твое усмотрение)'}. 
   Все 3 стрижки из подбора должны строго соответствовать этому стилю! КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдавать одни и те же стрижки (например, кроп, кроп, кроп) под разные стили жизни!
   - "Деловой" (Business) / "Элегантный": Только благородные, аккуратные, соразмерные классические стрижки. Никаких экстремальных андеркатов с выбритым затылком, растрепанного гранжа или кроп-стрижек! Подходящие варианты: Classic Executive Side Part, Ivy League Haircut, Low Pompadour Taper, Gentleman's Tapered Cut.
   - "Спортивный" (Sporty): Идеально удобные, компактные, атлетичные стрижки. Подходящие варианты: Dynamic Crew Cut, Short Textured Athletic Crop, Buzz Cut low-fade, High and Tight.
   - "Кэжуал" (Casual): Актуальные повседневные стрижки. Подходящие варианты: Casual Modern Taper, Slick Back Taper, Textured Loose Fringe, Short Messy Quiff.
   - "Романтичный" / "Креативный" / "Дерзкий": Выразительные, модные, свободные стили. Подходящие варианты: Middle Part Flow "Curtains" (если позволяет длина верха), Modern Taper Mullet (классический мягкий маллет), Wolf Cut, Modern Pompadour Fade, Shaggy Layered Cut.

5. ТРЕБОВАНИЕ К 'imageKeyword' (ДЛЯ ОПТИМАЛЬНОЙ ГЕНЕРАЦИИ РЕФЕРЕНСОВ):
   - 'imageKeyword' должен быть детальным набором ключевых слов НА АНГЛИЙСКОМ через запятую.
   - Он должен сочетать название стрижки, ее текстуру, правильный возраст и пол, густоту, чтобы результат генерации точно наложился за счет правильного референса.
   - КРИТИЧНО ДЛЯ ГЕНЕРАЦИИ: Чтобы нейросети не раздували прически до абсурда, добавляй в imageKeyword жесткие ограничения объема: "absolutely no puffy hair, strictly flat lying top, realistic natural fall, zero artificial volume".
   - Например: "neat gentleman clean side part haircut, low taper fade, absolutely no puffiness, flat hair, 40 years old man classic business executive hair model, high-quality studio portrait".
   - Избегай банального названия "Fade". Всегда пиши конкретную стрижку, возраст, пол и структуру волос.

4. ТРЕБОВАНИЯ К ЕСТЕСТВЕННОСТИ, ОБЪЕМУ И ПОВСЕДНЕВНОСТИ (КРИТИЧЕСКИ ВАЖНО):
   - КАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ предлагать прически с "гипер-объемом", салонные укладки с начесом, зализанные идеально глянцевые волосы каскадом, аниме-укладки или "пышные шапки" волос, если только у клиента изначально волосы не обладают огромной густотой (афро и т.д.).
   - Для 95% людей предлагай ЕСТЕСТВЕННЫЕ, повседневные (casual) стрижки. Они должны выглядеть так, как люди носят волосы в реальной жизни каждый день (слегка небрежные, естественная текстура, без рекламного лоска).
   - При написании \`description\` избегай слов "пышная укладка", "идеальный объем", "роскошный объем". Используй "естественное падение волос", "повседневная текстура", "волосы естественно лежат по форме головы".

Твой ответ должен быть СТРОГО в формате валидного JSON объекта:
{
  "warning": "Предупредите мягко, если запрос недостижим" (или пустая строка),
  "recommendations": [
    {
      "name": "Название стрижки на русском (уникальное!)",
      "description": "Точное объяснение, почему она скрывает недостатки и подчеркивает достоинства клиента...",
      "stylingTips": "Специфичные советы по укладке для его типа волос...",
      "imageKeyword": "Exact english descriptive keywords, hair length, hair density, hairline detail, style style, close-up portrait"
    },
    { ...второй вариант... },
    { ...третий вариант... }
  ]
}
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

    res.status(500).json({ error: errorMsg });
  }
});
