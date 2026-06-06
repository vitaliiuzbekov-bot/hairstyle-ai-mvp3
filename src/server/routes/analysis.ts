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
    const { imageBase64, imageUrl, mimeType, preferredStyle } = req.body;
    const targetBase64 = await fetchImageAsBase64(imageUrl, imageBase64);
    if (!targetBase64) {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      res.status(500).json({ error: "FAL_KEY is missing for image analysis." });
      return;
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
