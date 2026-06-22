import { AnalysisResult } from '../types';
import * as faceapi from '@vladmandic/face-api';

export interface SmartCropResult {
  base64: string | null;
  warning?: string;
}

// Global flag to track preload status
let isFaceApiPreloaded = false;

export const preloadFaceApiModels = async () => {
    if (isFaceApiPreloaded) return;
    try {
        const modelsUrl = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri(modelsUrl),
            faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrl),
            faceapi.nets.faceExpressionNet.loadFromUri(modelsUrl),
            faceapi.nets.ageGenderNet.loadFromUri(modelsUrl),
        ]);
        isFaceApiPreloaded = true;
        console.log("FaceAPI models preloaded in background");
    } catch(e) {
         console.warn("FaceAPI preload failed", e);
    }
};

export const smartCropFace = async (imageBase64: string, mimeType: string): Promise<SmartCropResult> => {
  // Fallback timeout to prevent infinite hanging
  const withTimeout = (promise: Promise<any>, ms: number) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
    ]);
  };

  try {
    const modelsUrl = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
    await withTimeout(Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelsUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrl)
    ]), 10000); // 10s timeout

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Image load error in smartCrop"));
      img.src = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
    });

    // Yield to allow browser to render loading states before heavy sync ML task
    await new Promise(r => requestAnimationFrame(r));

    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks();
    
    if (!detections) return { base64: null, warning: "Лицо не найдено. Нам нужно четкое фото лица для работы нейросети." };

    // --- ШАГ 3: ЛОКАЛЬНЫЙ КОНТРОЛЬ КАЧЕСТВА И РАКУРСА (AI QUALITY CHECK) ---
    // Проверяем освещенность (score)
    const score = detections.detection.score;
    if (score < 0.6) {
        return { base64: null, warning: "Очень плохое освещение или размытое фото. Пожалуйста, сделайте фото с хорошим светом." };
    }

    // Проверяем наклон и поворот головы по лендмаркам
    const landmarks = detections.landmarks.positions;
    const nose = landmarks[30];
    const leftEar = landmarks[0];
    const rightEar = landmarks[16];
    const leftEye = landmarks[36];
    const rightEye = landmarks[45];
    const chin = landmarks[8];

    const faceWidth = rightEar.x - leftEar.x;
    const noseDistLeft = nose.x - leftEar.x;
    const yawRatio = noseDistLeft / faceWidth; 

    if (yawRatio < 0.35 || yawRatio > 0.65) {
        return { base64: null, warning: "Пожалуйста, смотрите ПРЯМО в камеру. Фото в профиль или полубоком не подходит для качественного результата." };
    }

    const dX = rightEye.x - leftEye.x;
    const dY = rightEye.y - leftEye.y;
    const angle = Math.abs(Math.atan(dY / dX) * (180 / Math.PI));
    if (angle > 15) {
        return { base64: null, warning: "Ваша голова сильно наклонена. Пожалуйста, держите устройство ровно." };
    }

    const box = detections.detection.box;
    // Calculate new bounding box (portrait mode, 3:4 aspect ratio)
    // We want the face to be vertically somewhat in the upper half
    const faceSize = Math.max(box.width, box.height);
    
    // Target dimensions
    // Let's pad by a factor of 2.5 of the face size.
    const cropWidth = faceSize * 2.5;
    const cropHeight = cropWidth * (4/3); // 3:4 portrait
    
    // Calculate center
    const faceCenterX = box.x + box.width / 2;
    const faceCenterY = box.y + box.height / 2;
    
    // Upper half face bias (face should be at ~40% of height)
    let startX = faceCenterX - cropWidth / 2;
    let startY = faceCenterY - cropHeight * 0.4;
    
    // Boundaries check
    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;
    if (startX + cropWidth > img.width) startX = Math.max(0, img.width - cropWidth);
    if (startY + cropHeight > img.height) startY = Math.max(0, img.height - cropHeight);
    
    // If image is smaller than requested crop, we might just use the original image bounded
    const finalWidth = Math.min(cropWidth, img.width - startX);
    const finalHeight = Math.min(cropHeight, img.height - startY);

    // Limit maximum dimensions of the cropped target image to 850 to avoid huge request sizes
    const MAX_DIM = 850;
    let targetWidth = finalWidth;
    let targetHeight = finalHeight;
    if (targetWidth > targetHeight) {
      if (targetWidth > MAX_DIM) {
        targetHeight = Math.round((targetHeight * MAX_DIM) / targetWidth);
        targetWidth = MAX_DIM;
      }
    } else {
      if (targetHeight > MAX_DIM) {
        targetWidth = Math.round((targetWidth * MAX_DIM) / targetHeight);
        targetHeight = MAX_DIM;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { base64: null };

    ctx.drawImage(img, startX, startY, finalWidth, finalHeight, 0, 0, targetWidth, targetHeight);
    
    // Return base64 string without data uris with optimized compression quality (0.75 is perfect balance)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
    return { base64: dataUrl.split(",")[1] };
  } catch (e) {
    console.warn("Smart crop failed", e);
    return { base64: null };
  }
};

export const fallbackFaceApi = async (
  imageBase64: string | null,
  mimeType: string,
  preferredStyle: string
): Promise<AnalysisResult | null> => {
  try {
    if (!imageBase64) return null;
    const modelsUrl = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
    
    const withTimeout = (promise: Promise<any>, ms: number) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
      ]);
    };

    // We assume faceapi is available globally (e.g. loaded via a script tag)
    await withTimeout(Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelsUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrl),
      faceapi.nets.faceExpressionNet.loadFromUri(modelsUrl),
      faceapi.nets.ageGenderNet.loadFromUri(modelsUrl),
    ]), 10000); // 10s timeout
    
    // Yield to let UI update after models load
    await new Promise(r => setTimeout(r, 10));

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Image load error in fallbackFaceApi"));
      img.src = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
      if (img.complete) resolve(undefined);
    });

    // Yield to allow browser to render loading states before heavy sync ML task
    await new Promise(r => setTimeout(r, 10));

    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    if (!detections) {
      throw new Error("Лицо не найдено локальным алгоритмом");
    }

    // Determine Face Shape
    const box = detections.detection.box;
    const width = box.width;
    const height = box.height;
    const ratio = height / width;
    
    const landmarks = detections.landmarks.positions;
    // points 4 and 12 for jaw width
    const jawDx = landmarks[12].x - landmarks[4].x;
    const jawDy = landmarks[12].y - landmarks[4].y;
    const jawWidth = Math.sqrt(jawDx * jawDx + jawDy * jawDy);
    
    // --- ШАГ 4: ЛОКАЛЬНАЯ ЭКСТРАКЦИЯ ФИЗИОГНОМИКИ КОЖИ И ВОЛОС (PIXEL ANALYSIS) ---
    // Extracting Skin Tone and Hair Color natively without server compute
    let skinTone = "Светлый (Light)";
    let hairColor = "Темно-каштановый";
    
    try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, img.width, img.height);
            // Cheek patch for skin tone (around landmark 2 or 14)
            const cheekX = Math.floor(landmarks[2].x + 10);
            const cheekY = Math.floor(landmarks[2].y);
            const skinPixel = ctx.getImageData(cheekX, cheekY, 1, 1).data;
            const r = skinPixel[0]; const g = skinPixel[1]; const b = skinPixel[2];
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
            if (brightness < 60) skinTone = "Темный (Dark)";
            else if (brightness < 130) skinTone = "Смуглый (Olive)";
            else if (brightness < 200) skinTone = "Средний (Medium)";
            else skinTone = "Светлый (Light)";
            
            // Forehead / Hair area patch
            // Above the nose (landmark 27) and above the bounding box top
            let hairY = Math.floor(box.y - (box.height * 0.15));
            if (hairY < 0) hairY = 0; // If hair is cut off, just take the top pixel
            const hairX = Math.floor(landmarks[27].x);
            const hairPixel = ctx.getImageData(hairX, hairY, 1, 1).data;
            const hr = hairPixel[0]; const hg = hairPixel[1]; const hb = hairPixel[2];
            const hBrightness = (hr * 299 + hg * 587 + hb * 114) / 1000;
            
            if (hBrightness < 45) hairColor = "Черный";
            else if (hBrightness > 150 && hr > hg + 20) hairColor = "Блонд";
            else if (hr > hg + 40 && hr > 100) hairColor = "Рыжий";
            else if (hBrightness < 90) hairColor = "Темно-каштановый";
            else hairColor = "Русый";
        }
    } catch(e) {
        console.warn("Pixel analysis skipped", e);
    }

    let faceShape = "Овальная";
    if (ratio > 1.5) {
      faceShape = "Удлиненная";
    } else if (ratio < 1.25) {
      if (jawWidth / width > 0.75) {
        faceShape = "Квадратная";
      } else {
        faceShape = "Круглая";
      }
    } else {
      if (jawWidth / width > 0.8) {
        faceShape = "Прямоугольная";
      } else {
        faceShape = "Овальная";
      }
    }

    return {
      warning: "Мы выполнили экспресс-определение физиогномики лица в вашем браузере. Анализ проведен локально (ИИ не отправлял ваше фото на сервер моделей).",
      gender: detections.gender === "male" ? "male" : "female",
      faceShape: faceShape,
      skinTone: skinTone,
      hairColor: hairColor,
      hairDensity: "Средние",
      hairType: "Прямые",
      ageRange: `${Math.round(detections.age - 5)}-${Math.round(detections.age + 5)}`,
      recommendations: detections.gender === "male" ? (
        preferredStyle === "Деловой" || preferredStyle === "Элегантный" ? [
          {
            name: "Классический пробор (Executive Side Part)",
            description: "Элегантная классика с аккуратным боковым пробором и плавным переходом. Подчеркивает статус и идеален для деловых встреч.",
            stylingTips: "Нанесите помаду сильной фиксации с умеренным блеском и уложите расческой.",
            imageKeyword: "Classic Executive Side Part Men",
          },
          {
            name: "Лига Плюща (Ivy League)",
            description: "Интеллигентный укороченный вариант классической канадки, который выглядит аккуратно без сложных укладок.",
            stylingTips: "Слегка уложите челку набок с помощью воска или матовой глины.",
            imageKeyword: "Classic Ivy League Haircut Men",
          },
          {
            name: "Аккуратная Канадка (Low Taper Pompadour)",
            description: "Объемная теменная зона с аккуратным, благородным и плавным переходом к вискам. Солидно и солидно.",
            stylingTips: "Используйте мусс для объема и высушите феном по направлению назад-набок.",
            imageKeyword: "Low Taper Pompadour Men",
          }
        ] : preferredStyle === "Спортивный" ? [
          {
            name: "Крю-кат (Dynamic Crew Cut)",
            description: "Максимально практичная, мужественная спортивная стрижка, которая прекрасно держит форму в любых условиях.",
            stylingTips: "Не требует укладки. Достаточно просушить полотенцем.",
            imageKeyword: "Sporty Crew Cut Fade Men",
          },
          {
            name: "Спортивный Базз-кат (Sporty Buzz Cut Fade)",
            description: "Ультракороткая стрижка с плавным градиентом от кожи на висках до короткого верха. Подчеркивает волевые черты лица.",
            stylingTips: "Не требует стайлинга. Идеально для активного образа жизни.",
            imageKeyword: "Sporty Buzz Cut Fade Men",
          },
          {
            name: "Атлетический Кроп (Textured Athletic Crop)",
            description: "Короткая текстурированная спортивная стрижка с уплотненным верхом и короткими висками.",
            stylingTips: "Нанесите каплю матовой пудры для подчеркивания текстуры волосков.",
            imageKeyword: "Short Textured Athletic Crop Men",
          }
        ] : [
          {
            name: "Андеркат (Undercut)",
            description: "Короткие виски и затылок с удлиненным стильным верхом и челкой.",
            stylingTips: "Используйте помаду для волос или воск для фиксации челки.",
            imageKeyword: "Classic Undercut Men",
          },
          {
            name: "Кроп (Textured Crop)",
            description: "Текстурированная современная короткая стрижка с плавным переходом.",
            stylingTips: "Матовая глина поможет подчеркнуть современную текстуру.",
            imageKeyword: "Textured Crop Fade Men",
          },
          {
            name: "Современный Квифф (Modern Quiff)",
            description: "Динамичная стрижка с объемом у лба, создающая стильный и свободный городской образ.",
            stylingTips: "Уложите челку наверх и назад с помощью текстурирующей глины или пудры.",
            imageKeyword: "Textured Modern Quiff Men",
          }
        ]
      ) : (
        preferredStyle === "Деловой" || preferredStyle === "Элегантный" ? [
          {
            name: "Гладкий Боб (Sleek Classic Bob)",
            description: "Идеально ровная классическая стрижка средней длины, излучающая благородство и женственность.",
            stylingTips: "Используйте термозащитный спрей и разгладьте утюжком для зеркального блеска.",
            imageKeyword: "Sleek Classic Bob Haircut",
          },
          {
            name: "Элегантный Пикси-Боб (Elegant Pixie-Bob)",
            description: "Интеллигентный гибрид пикси и боба с красивым прикорневым объемом.",
            stylingTips: "Высушите феном с круглой щеткой, направляя пряди назад-набок.",
            imageKeyword: "Elegant Pixie Bob Haircut",
          },
          {
            name: "Длинные Каскадные Слои (Classic Long Layers)",
            description: "Роскошный классический способ придать объем длинным волосам, сохраняя общую форму.",
            stylingTips: "Уложите феном на большую круглую щетку (брашинг) для эффекта салонной укладки.",
            imageKeyword: "Classic Long Layered Waves",
          }
        ] : preferredStyle === "Спортивный" ? [
          {
            name: "Короткий Пикси (Active Pixie Cut)",
            description: "Динамичная, легкая и максимально практичная стрижка, идеально открывающая шею и линию подбородка.",
            stylingTips: "Разотрите немного матовой пасты в ладонях и взёрошьте кончики волос.",
            imageKeyword: "Short Textured Pixie Cut Active",
          },
          {
            name: "Рваное Каре (Textured Bob Cut)",
            description: "Свободная, легкая в уходе стрижка средней длины с градуированными концами.",
            stylingTips: "Быстро высушите феном по направлению вниз, взбивая пальцами для естественности.",
            imageKeyword: "Messy Styled Bob Cut",
          },
          {
            name: "Удобный Боб (Blunt Cut Bob)",
            description: "Ровный и плотный срез, который всегда аккуратно лежит даже во время активных тренировок.",
            stylingTips: "Слегка сбрызните легким увлажняющим спреем против пушения.",
            imageKeyword: "Blunt Cut Short Bob Haircut",
          }
        ] : [
          {
            name: "Стрижка Боб (Bob Cut)",
            description: "Классическая длина, которая великолепно идет почти всем типам лица.",
            stylingTips: "Слегка подкручивайте концы круглой щеткой для дополнительного объема.",
            imageKeyword: "Classic Bob Haircut",
          },
          {
            name: "Пикси (Pixie Cut)",
            description: "Смелая стильная короткая стрижка, прекрасно подчеркивающая изящные черты лица.",
            stylingTips: "Используйте текстурирующую пасту для создания непринужденного вида.",
            imageKeyword: "Textured Pixie Cut",
          },
          {
            name: "Длинные слои (Long Layers)",
            description: "Универсальный способ добавить объем и движение, сохраняя при этом всю роскошную длину.",
            stylingTips: "Легкий спрей с морской солью поможет создать непринужденные пляжные волны.",
            imageKeyword: "Long Layered Waves",
          }
        ]
      ),
    } as AnalysisResult;
  } catch (e) {
    console.error("Local face-api fallback failed", e);
    return null;
  }
};
