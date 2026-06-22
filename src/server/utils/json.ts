/**
 * Безопасный парсинг JSON из ответов языковых моделей
 */
export function safeParseJSON<T = any>(text: string): T {
  if (!text) {
    throw new Error("Cannot parse empty text as JSON");
  }

  let clean = text.trim();
  
  // Удаляем разметку markdown ```json ... ```
  clean = clean.replace(/^```[a-zA-Z]*\s*/i, "");
  clean = clean.replace(/\s*```$/i, "");
  clean = clean.trim();
  
  // Попытка прямого парсинга
  try {
    return JSON.parse(clean) as T;
  } catch (e) {
    // Пробуем искать JSON структуры в тексте
  }

  // Ищем первый { или [ и последний } или ] соответственно
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = clean.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate) as T;
    } catch (e) {
      // Продолжаем
    }
  }

  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const candidate = clean.substring(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate) as T;
    } catch (e) {
      // Продолжаем
    }
  }
  
  try {
    return JSON.parse(clean) as T;
  } catch (e2: any) {
    throw new Error(`Не удалось распарсить JSON из текста: "${clean.substring(0, 150)}..." - Ошибка: ${e2.message}`);
  }
}
