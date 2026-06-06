
import { Request, Response, Router } from "express";
import { logToTelegram } from "../services/logger";
import { callYandexGPT, callYandexGPTChat, getYandexIamToken, extractFolderId } from "../services/yandex";

export const generateRouter = Router();

generateRouter.post("/generate-reference", async (req, res) => {
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

  
generateRouter.post("/generate-full", async (req, res) => {
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
      const selfieImageFull = selfieImage.startsWith('http') || selfieImage.startsWith('data:') ? selfieImage : `data:image/jpeg;base64,${selfieImage}`;

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

  
generateRouter.post("/generate-ar", async (req, res) => {
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

  
generateRouter.post("/chat-stylist", async (req, res) => {
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

  

generateRouter.post("/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64 || !mimeType) {
        return res.status(400).json({ error: "Missing audioBase64 or mimeType" });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [
          {
            text: "Транскрибируй это аудио на русском языке. Верни только текст и ничего больше."
          },
          {
              inlineData: {
                  mimeType,
                  data: audioBase64
              }
          }
        ]
      });
      const transcribedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.json({ text: transcribedText });
    } catch (err: any) {
      console.error("Transcribe error:", err);
      res.status(500).json({ error: err.message || "Ошибка транскрибации" });
    }
});
