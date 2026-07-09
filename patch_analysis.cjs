const fs = require('fs');
let code = fs.readFileSync('src/server/routes/analysis.ts', 'utf8');

// 1. Import library
const importStatement = `import { FEMALE_LIBRARY, MALE_LIBRARY } from "../../data/haircutLibrary";\n`;
if (!code.includes("FEMALE_LIBRARY")) {
    code = code.replace(/import { getCacheKey/, importStatement + "import { getCacheKey");
}

// 2. Change YandexGPT prompt to stop asking for recommendations
const oldPromptStart = `Ты топовый и очень креативный парикмахер-стилист. Твоя задача — проанализировать детальное клиническое описание внешности клиента и предложить 3 СОВЕРШЕННО РАЗНЫХ И НЕСТАНДАРТНЫХ варианта стрижки. \nOutput EXCLUSIVELY a JSON object (no markdown, no backticks, strictly parseable JSON).`;
const newPromptStart = `Ты эксперт-физиогномист и трихолог. Твоя задача — проанализировать детальное клиническое описание внешности клиента и вернуть его в структурированном виде.\nOutput EXCLUSIVELY a JSON object (no markdown, no backticks, strictly parseable JSON).`;

code = code.replace(oldPromptStart, newPromptStart);

// Remove the huge recommendations rules block
const recommendationsRulesRegex = /ЖЕСТКИЕ ПРАВИЛА И ОГРАНИЧЕНИЯ ДЛЯ ПОДБОРА СТРИЖЕК[\s\S]*?Твой ответ должен быть СТРОГО в формате валидного JSON объекта:[\s\S]*?"recommendations": \[[\s\S]*?\]\n\}/;
code = code.replace(recommendationsRulesRegex, 'Твой ответ должен быть СТРОГО в формате валидного JSON объекта.');

const oldSchema = `Return ONLY the raw JSON string matching this schema:
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

const newSchema = `Return ONLY the raw JSON string matching this schema:
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
code = code.replace(oldSchema, newSchema);

// 3. Inject library recommendations after parsing JSON
const injectLogic = `
    const parsedResults = safeParseJSON(textOutput);
    
    // 🔥 INJECT 3 RANDOM LIBRARY RECOMMENDATIONS TO SAVE AI COSTS 🔥
    const lib = parsedResults.gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
    const shuffled = [...lib].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3);
    parsedResults.recommendations = picked.map(item => ({
      name: item.name,
      description: item.description,
      stylingTips: item.stylingTips,
      imageKeyword: item.imageKeyword || item.name // Ensure imageKeyword exists or fall back to name
    }));
`;

code = code.replace(/const parsedResults = safeParseJSON\(textOutput\);/, injectLogic.trim());

fs.writeFileSync('src/server/routes/analysis.ts', code);
