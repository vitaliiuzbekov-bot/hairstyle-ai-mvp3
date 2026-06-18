import "dotenv/config";
import fs from "fs";
import path from "path";

// Скрипт для генерации "Золотой базы" эталонных причесок с помощью FAL.AI FLUX
// Запуск: npx tsx src/scripts/generateGoldenBase.ts

const FAL_KEY = process.env.FAL_KEY;

if (!FAL_KEY) {
  console.error("ОШИБКА: FAL_KEY не найден в .env");
  process.exit(1);
}

// Список базовых причесок для генерации (начинаем с основного женского и мужского базового каталога)
const HAIRSTYLES = [
  // ЖЕНСКИЕ
  { id: "f_pixie", name: "Пикси", prompt: "short textured elegant pixie cut, female model" },
  { id: "f_bob", name: "Классический Боб", prompt: "classic chin-length glossy bob cut, straight hair, female model" },
  { id: "f_long_bob", name: "Лоб (Удлиненный боб)", prompt: "long bob lob haircut, slightly wavy collarbone length, female model" },
  { id: "f_long_straight", name: "Длинные прямые", prompt: "very long straight sleek shiny hair, middle part, female model" },
  { id: "f_long_wavy", name: "Длинные волнистые", prompt: "long gorgeous soft wavy hair, voluminous beach waves, female model" },
  { id: "f_bangs", name: "С челкой", prompt: "long straight hair with straight blunt bangs fringe, female model" },
  
  // МУЖСКИЕ (короткий список для начала)
  { id: "m_buzz", name: "Милитари (Buzz Cut)", prompt: "very short military buzz cut, handsome male model" },
  { id: "m_crop", name: "Текстурный Кроп", prompt: "textured french crop with skin fade, handsome male model" },
  { id: "m_pompadour", name: "Помпадур", prompt: "classic voluminous pompadour, fade sides, handsome male model" }
];

const OUTPUT_DIR = path.join(process.cwd(), "public", "golden_base");

async function generateImageForStyle(style: typeof HAIRSTYLES[0]) {
  console.log(`Генерация для: ${style.name} (${style.id})...`);
  
  const promptEng = `A highly detailed, photorealistic studio portrait photography of a beautiful Caucasian model looking directly at the camera. Extremely attractive, perfect symmetry. She has a perfectly styled [ ${style.prompt} ] hairstyle. Perfectly flat professional soft studio lighting, neutral solid light grey background. Sharp focus on the face and hair. Unretouched skin texture, incredibly realistic, 8k resolution, raw photo. Wearing a simple plain white t-shirt.`;

  try {
    const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: style.id.startsWith("m_") ? promptEng.replace("beautiful Caucasian model", "handsome Caucasian male model").replace("She", "He") : promptEng,
        image_size: "portrait_4_3",
        num_inference_steps: 28, // FLUX Pro
        guidance_scale: 3.5
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Ошибка генерации ${style.name}:`, err);
      return null;
    }

    const data = await res.json();
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
         console.error(`Нет URL изображения в ответе для ${style.name}`);
         return null;
    }

    console.log(`Успешно сгенерирован ${style.name}: ${imageUrl}`);
    return imageUrl;

  } catch (e) {
    console.error(`Ошибка для ${style.name}:`, e);
    return null;
  }
}

async function downloadImage(url: string, filename: string) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), Buffer.from(buffer));
  console.log(`Скачано и сохранено: ${filename}`);
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results: Record<string, {name: string, url: string}> = {};

  for (const style of HAIRSTYLES) {
    const filename = `${style.id}.jpg`;
    const localPath = path.join(OUTPUT_DIR, filename);
    
    // Пропускаем, если уже сгенерировано (экономим деньги)
    if (fs.existsSync(localPath)) {
        console.log(`Пропуск ${style.name}, файл уже существует.`);
        results[style.id] = { name: style.name, url: `/golden_base/${filename}` };
        continue;
    }

    const imageUrl = await generateImageForStyle(style);
    if (imageUrl) {
       await downloadImage(imageUrl, filename);
       results[style.id] = { name: style.name, url: `/golden_base/${filename}` };
    }
    // Небольшая пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(results, null, 2)
  );

  console.log("✅ Генерация базы завершена! Файлы сохранены в /public/golden_base");
}

run();
