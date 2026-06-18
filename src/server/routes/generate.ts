
import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { logToTelegram } from "../services/logger";
import { callYandexGPT, callYandexGPTChat, getYandexIamToken, extractFolderId } from "../services/yandex";
import { getCacheKey, getCachedValue, setCachedValue } from "../services/cache";
import { adminApp, adminStorage } from "../firebase";
import crypto from "crypto";
import { sendPhotoToTelegramUser } from "../services/telegramBot";

import {
  getDemographicDescriptorRu,
  getDemographicDescriptor,
  translateHairlineStatusToEng,
  translateHairQualityToEng,
  translateHairTypeToEng,
  translateHairLengthToEng,
  translateHairDensityToEng,
  translateFacialHairToEng,
  getDetailedAgePromptRu,
  getDetailedAgePromptEng,
  getHairstyleEnglishDescription,
  getDemographicDetails,
  getSafeRussianPrompt,
  getDetailedRussianPrompt
} from "../utils/promptGenerator";

import { checkAndDeductGeneration, refundGeneration } from "../utils/billing";

export const generateRouter = Router();

const customBlueprintCache = new Map<string, string>();

generateRouter.post("/generate-reference", async (req, res) => {
    try {
      const { 
        gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        hairlineStatus, hairQuality, haircutName
      } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      // Check cache first (Cache for 30 days)
      const cacheKey = getCacheKey({ 
        route: "generate-reference-v11-flat-fix", 
        keyword, gender, customHairColor, ageRange, skinTone, faceShape, facialHair,
        hairDensity, hairType, hairLength, hairlineStatus, hairQuality
      });
      const cachedImage = await getCachedValue<string>(cacheKey);
      if (cachedImage) {
        console.log("Returned reference from cache!");
        return res.json({ imageUrl: cachedImage });
      }

      // Generate a highly realistic prompt taking user base into account
      const prompt = getDetailedRussianPrompt({
        gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        hairlineStatus, hairQuality, haircutName
      });

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
              { weight: 1, text: prompt },
              { weight: -2, text: "пышная прическа, гипер-объем, волосы торчком, растрепанные, салонная укладка, парик, пушистые волосы, шапка волос, начес, афро, кудри" },
              { weight: -1, text: "коллаж, мультик, водяной знак, текст, до и после, 3D" }
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
              const safePrompt = getSafeRussianPrompt(gender, ageRange, haircutName, keyword, hairColor, clothingContext);
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
          console.error(`Не удалось сгенерировать изображение: ${lastError}. Попытка использовать Gemini-2.5-flash-image.`);
          try {
              const { GoogleGenAI, Modality } = await import("@google/genai");
              const geminiApiKey = process.env.GEMINI_API_KEY;
              if (geminiApiKey) {
                  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
                  const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                      parts: [
                        { text: `A highly photorealistic, amateur portrait photo of an average individual with this specific hairstyle: ${prompt}. CRITICAL INSTRUCTION: STYLED HAIR MUST HAVE ABSOLUTELY ZERO VOLUME AND ZERO MESSINESS. IT MUST LIE COMPLETELY FLAT AGAINST THE HEAD OR HAVE A VERY MODEST, NATURAL EVERYDAY LOOK. Do not generate puffy, curly, tall, voluminous, or "messy/hurricane" hair. Do not make it look like a fashion magazine cover. Strictly amateur style lighting, simple wall background, flat hair.` },
                      ],
                    },
                    config: {
                        responseModalities: [Modality.IMAGE],
                    },
                  });
                  for (const part of response.candidates?.[0]?.content?.parts || []) {
                    if (part.inlineData) {
                      finalImageUrl = `data:image/jpeg;base64,${part.inlineData.data}`;
                      break;
                    }
                  }
              }
          } catch(e: any) {
              console.error(`Gemini Fallback Failed:`, e);
          }
          if (!finalImageUrl) {
             finalImageUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80';
          }
      } else {
          // Save to cache for 30 days (30 * 24 * 60 * 60 seconds)
          await setCachedValue(cacheKey, finalImageUrl, 30 * 24 * 60 * 60);
      }
      
      // If Gemini fallback generated it, cache it here so it doesn't run again for identical prompts.
      if (finalImageUrl && finalImageUrl !== 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80') {
           await setCachedValue(cacheKey, finalImageUrl, 30 * 24 * 60 * 60);
      }

      res.json({ imageUrl: finalImageUrl, debugError: lastError });
    } catch (err: any) {
      console.error("Reference gen error:", err);
      res.status(500).json({ error: err.message || "Ошибка генерации референса" });
    }
  });

  
generateRouter.post("/generate-full", async (req, res) => {
    const controller = new AbortController();
    req.on('close', () => {
      // controller.abort(); // Removed: Let the process finish in background to send to Telegram Bot
      console.log(`[generate-full] Client disconnected, but processing will continue in background.`);
    });

    try {
      const { 
        userId, gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        vtonStrength, // Number from 50 to 100
        targetImageUrl, // Optional, generated reference image URL
        hairlineStatus, hairQuality, idempotencyKey
      } = req.body;
      
      let selfieImage = req.body.selfieImage;
      if (req.file) {
        selfieImage = req.file.buffer.toString('base64');
      }

      if (!keyword || !selfieImage) {
        return res.status(400).json({ error: "Missing parameters: keyword and selfieImage are required." });
      }

      let finalTargetImageUrl = targetImageUrl;
      if (finalTargetImageUrl && finalTargetImageUrl.startsWith('/')) {
        // Try reading from public or dist folders
        let localPath = path.join(process.cwd(), 'dist', finalTargetImageUrl);
        if (!fs.existsSync(localPath)) {
            localPath = path.join(process.cwd(), 'public', finalTargetImageUrl);
        }
        if (fs.existsSync(localPath)) {
            const buf = fs.readFileSync(localPath);
            finalTargetImageUrl = `data:image/jpeg;base64,${buf.toString('base64')}`;
        }
      }

      // Check cache first (Cache for 30 days)
      const cacheKey = getCacheKey({ 
        route: "generate-full-v8-flat-fix", 
        userId, keyword, customHairColor, hairColor, vtonStrength, targetImageUrl: finalTargetImageUrl,
        // using string truncation or full string to hash the selfie.
        // String hashing is deterministic.
        selfieHash: getCacheKey(selfieImage),
        hairlineStatus, hairQuality
      });
      const cachedImage = await getCachedValue<string>(cacheKey);
      if (cachedImage) {
        console.log("Returned VTON from cache!");
        return res.json({ imageUrl: cachedImage });
      }

      // 🚨 DEDUCT GENERATIONS ON THE BACKEND 🚨
      const billingCheck = await checkAndDeductGeneration(userId, idempotencyKey);
      if (!billingCheck.ok) {
        return res.status(403).json({ error: billingCheck.error });
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
        val = val.toLowerCase().trim();
        if (val.includes("светло-каштанов") || val.includes("светло каштанов") || val.includes("light chestnut") || val.includes("light brown chestnut")) {
          return "solid uniform light chestnut brown";
        }
        if (val.includes("тёмно-каштан") || val.includes("темно-каштан") || val.includes("dark chestnut") || val.includes("dark brown")) {
          return "rich deep dark chestnut brown";
        }
        if (val.includes("блонд") || val.includes("светл") || val.includes("blonde") || val.includes("light hair") || val.includes("platinum")) {
          return "solid uniform bright platinum blonde";
        }
        if (val.includes("рус") || val.includes("light brown") || val.includes("medium brown") || val.includes("ash brown") || val.includes("ash blonde")) {
          return "solid uniform medium ash blonde and light brown";
        }
        if (val.includes("каштан") || val.includes("шатен") || val.includes("brown") || val.includes("chestnut")) {
          return "solid uniform rich chestnut brown";
        }
        if (val.includes("черн") || val.includes("тёмн") || val.includes("темн") || val.includes("black") || val.includes("dark hair") || val.includes("pure black")) {
          return "solid uniform pure jet black";
        }
        if (val.includes("рыж") || val.includes("медн") || val.includes("ginger") || val.includes("red hair") || val.includes("copper")) {
          return "solid uniform intense copper ginger-red";
        }
        if (val.includes("сед") || val.includes("пепел") || val.includes("бел") || val.includes("сер") || val.includes("grey") || val.includes("gray") || val.includes("white") || val.includes("silver")) {
          return "solid uniform pure silver white and grey";
        }
        if (val.includes("розов") || val.includes("pink")) return "vibrant pastel pink";
        if (val.includes("син") || val.includes("голуб") || val.includes("blue")) return "vivid blue";
        if (val.includes("зелен") || val.includes("зелён") || val.includes("green")) return "vivid green";
        if (val.includes("фиолет") || val.includes("purple")) return "vivid purple";
        if (val.includes("красн") || val.includes("red")) return "vivid red";
        return val;
      };

      const isCustomColorRequested = customHairColor && customHairColor !== "Любой";
      const targetHairColor = isCustomColorRequested ? customHairColor : hairColor;
      const finalColor = targetHairColor && targetHairColor !== "Любой" ? translateColor(targetHairColor).toLowerCase() : "";
      
      let baseImageForFlux = selfieImageFull;
      let fluxStrength = 0.40;
      
      // We process the reference image (targetImageUrl), which comes from either catalog, uploaded reference, or YandexART.
      if (finalTargetImageUrl) {
          baseImageForFlux = finalTargetImageUrl.startsWith('http') || finalTargetImageUrl.startsWith('data:') 
              ? finalTargetImageUrl 
              : `data:image/jpeg;base64,${finalTargetImageUrl}`;
          
          if (isCustomColorRequested) {
              // Apply a dye pass to the reference image before FaceSwapping with the user's face
              // Increased from 0.28 to 0.45 to ensure the color applies successfully without destroying shape
              fluxStrength = 0.45;
          } else {
              // Exact match, no color change needed - skip straight to FaceSwap
              fluxStrength = 0.05;
          }
      } else {
          baseImageForFlux = selfieImageFull;
          if (keyword && keyword.includes("same exact current hairstyle")) {
              fluxStrength = 0.85;
          } else {
              fluxStrength = 0.50;
          }
      }

      // Translate description & clothing context to English if it contains Cyrillic characters
      let englishDescription = description || "";
      let englishClothingContext = clothingContext || "";
      const needsDescTrans = description && /[а-яА-ЯёЁ]/.test(description);
      const needsClothTrans = clothingContext && /[а-яА-ЯёЁ]/.test(clothingContext);

      if (needsDescTrans || needsClothTrans) {
        try {
          console.log("Translating Russian contextual details to English via YandexGPT (batched)...");
          const systemPrompt = `Translate the provided Russian texts to English. Return ONLY a pure valid JSON object (no markdown, no code blocks) with the exact keys "description" (use precise image generation keywords for stable diffusion) and "clothingContext" (clear English description for props). If a text is empty, leave it empty.`;
          const userPrompt = JSON.stringify({
            description: needsDescTrans ? description : "",
            clothingContext: needsClothTrans ? clothingContext : ""
          });
          
          let translatedResponse = await callYandexGPT(systemPrompt, userPrompt);
          
          // Cleanup markdown from LLM
          const jsonMatch = translatedResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            translatedResponse = jsonMatch[0];
          } else {
            translatedResponse = translatedResponse.replace(/```(json)?\s*/g, "").replace(/```\s*$/g, "").trim();
          }

          const parsed = JSON.parse(translatedResponse);
          if (needsDescTrans && parsed.description && parsed.description.trim().length > 3) {
            englishDescription = parsed.description.trim();
          }
          if (needsClothTrans && parsed.clothingContext && parsed.clothingContext.trim().length > 3) {
            englishClothingContext = parsed.clothingContext.trim();
          }
        } catch (e) {
          console.warn("Failed to translate batch texts, falling back to original:", e);
        }
      }

      const isGreyColorRequested = finalColor && (finalColor.includes("grey") || finalColor.includes("gray") || finalColor.includes("white") || finalColor.includes("silver"));
      
      const removeGrayAndAgingBias = (text: string) => {
        if (!finalColor || isGreyColorRequested) return text;
        return text
          .replace(/\b(grey|gray|silver|white|platinum|ash|blonde-grey|grey-blonde|natural-grey|salt-and-pepper|salt\s+and\s+pepper)\b/gi, "")
          .replace(/\b(mature|elderly|senior|old|aged|aging|aged-looking)\b/gi, "middle-aged")
          .replace(/\s+/g, " ")
          .trim();
      };

      if (englishDescription) {
        englishDescription = removeGrayAndAgingBias(englishDescription);
      }

      const descriptorEng = getDemographicDescriptor(gender, ageRange);

      const getKeywordEngSafe = (kw: string) => {
        let keywordLower = kw.toLowerCase();
        let safeKeyword = kw;
        if (keywordLower.includes("buzz") || keywordLower.includes("бокс") || keywordLower.includes("ежик") || keywordLower.includes("кроп") || keywordLower.includes("crop") || keywordLower.includes("under") || keywordLower.includes("fade")) {
          safeKeyword = kw + ", strictly flat lying hair, no volume";
        } else {
             safeKeyword = kw + ", realistic natural volume, lying flat on head, no puffiness at roots";
        }
        return safeKeyword;
      }

      // Extract english keyword from something like "Пляжные волны (Beach Waves)"
      let englishKeyword = keyword;
      const bracketMatch = keyword.match(/\(([^)]+)\)/);
      if (bracketMatch && bracketMatch[1]) {
         englishKeyword = bracketMatch[1];
      }
      if (englishKeyword) {
          englishKeyword = getKeywordEngSafe(removeGrayAndAgingBias(englishKeyword));
      }

      let promptEng = "";
      
      let extraColorPrompt = "";
      if (finalColor) {
          const colorUpper = finalColor.toUpperCase();
          extraColorPrompt = ` [COLOR DEFINITION: HAIR MUST BE 100% UNIQUELY AND SOLIDLY COLOURED IN ${colorUpper}. Every single hair strand, segment, root, and tip must be strictly and uniformly ${colorUpper}. ABSOLUTELY NO other color shades, no gradients, no highlights, no lowlights, no dark roots, no grey hair if not specified, and no mixed tones are allowed under any circumstances. Clear, deep, and perfectly saturated ${colorUpper} hair dye coverage over the entire hairstyle].`;
      }

      // For english translation of the russian description, we provide a structured request to flux
      let fluxHairDetails = `Hairstyle specs: ${englishKeyword}.`;
      if (hairType) fluxHairDetails += ` Hair Texture: ${translateHairTypeToEng(hairType)}.`;
      if (hairLength) fluxHairDetails += ` Hair Length Constraint: ${translateHairLengthToEng(hairLength)}.`;
      if (hairDensity) {
          fluxHairDetails += ` Hair Density: ${translateHairDensityToEng(hairDensity)}. `;
      }
      
      const hairlineEng = translateHairlineStatusToEng(hairlineStatus, englishKeyword);
      if (hairlineEng) fluxHairDetails += ` Hairline details: ${hairlineEng}`;
      
      const qualityEng = translateHairQualityToEng(hairQuality);
      if (qualityEng) fluxHairDetails += ` Hair characteristics: ${qualityEng}`;

      fluxHairDetails = removeGrayAndAgingBias(fluxHairDetails);

      let agePromptEng = getDetailedAgePromptEng(ageRange || "");
      
      promptEng = `A photorealistic portrait of a ${descriptorEng}. This person is a ${agePromptEng}. [CRITICAL HAIRSTYLE REPLICATION: YOU MUST EXACTLY AND PERFECTLY REPLICATE THE HAIRSTYLE, VOLUME, SHAPE, AND TEXTURE PORTRAYED IN THE IMAGE. DO NOT CHANGE THE HAIRSTYLE STRUCTURE OR TYPE. THIS IS STRICTLY REQUIRED. STYLE OVERVIEW: ${englishKeyword} - ${englishDescription || ""}]. ${fluxHairDetails} ${extraColorPrompt} CRITICAL FACIAL CLARITY REQUIREMENT: The person must look directly at the camera with a clear, unobstructed face. The face must be in perfect sharp focus, crystal clear. No face warping, no distortions. Look directly at the camera, beautiful portrait lighting. CRITICAL INSTRUCTION: NO HYPER-VOLUME. HAIR MUST LIE FLAT AND NATURAL unless explicitly requested.`;
      
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
      
      const englishFacialHair = translateFacialHairToEng(facialHair);
      promptEng += ` Facial hair status: ${englishFacialHair}.`;

      promptEng += ` CRITICAL: Create a beautiful studio portrait or matching scene. Perfect lighting.`;
      
      promptEng += ` Highly detailed natural skin texture, visible pores, no airbrushing, unretouched, natural skin imperfections. Amateur phone snapshot, high quality raw photography.`;
      
      if (finalColor) {
          promptEng += ` CRITICAL REQUIREMENT: THIS PERSON MUST HAVE ${finalColor.toUpperCase()} HAIR. DO NOT MAKE THE HAIR ANY OTHER COLOR. ${finalColor.toUpperCase()} HAIR ONLY!`;
      }

      // Add high-priority bracketing prefix for hair color to make sure it's strictly observed
      if (finalColor) {
          promptEng = `[STRICTLY AND ABSOLUTELY ${finalColor.toUpperCase()} HAIR COLOR REQUIRED, NO OTHER SHADES OR TONES ALLOWED, 100% COMPLETE HAIR COLOR SOLID COVERAGE] ` + promptEng;
      }

      promptEng = promptEng.substring(0, 1500).trim();

      if (fluxStrength <= 0.05) {
          console.log("Skipping Flux Image-to-Image entirely, directly using base image for FaceSwap...");
          finalImageUrl = baseImageForFlux;
      } else {
        const blueprintCacheKey = crypto.createHash("md5").update(`${baseImageForFlux}_${finalColor}_${fluxStrength}_${keyword}`).digest("hex");
        if (customBlueprintCache.has(blueprintCacheKey)) {
            console.log("Using cached blueprint for:", finalColor, keyword);
            finalImageUrl = customBlueprintCache.get(blueprintCacheKey)!;
        } else {
          try {
            console.log("Generating target blueprint via FAL.AI (Flux Dev Image-to-Image)... strength:", fluxStrength);
            let endpoint = "https://fal.run/fal-ai/flux/dev/image-to-image";
            
            const bodyPayload: any = {
               prompt: promptEng,
               image_url: baseImageForFlux,
               strength: fluxStrength,
               num_inference_steps: 15,
               guidance_scale: 3.5
            };
            
            const fluxRes = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Authorization": `Key ${falKey}`,
                "Content-Type": "application/json"
              },
              signal: controller.signal,
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
                customBlueprintCache.set(blueprintCacheKey, generatedUrl);
            } else {
                throw new Error(`No image generated by Flux. Payload: ${JSON.stringify(fluxData)}`);
            }
          } catch (e: any) {
            throw e; 
          }
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
           signal: controller.signal,
           body: JSON.stringify(faceSwapPayload)
         });

         if (!falRes.ok) {
           const errText = await falRes.text();
           try {
             fs.appendFileSync('/app/applet/pipeline_error.log', '\nFAL FaceSwap HTTP Error ' + falRes.status + ': ' + errText + '\n');
           } catch(e) {}
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
          if (error.name === 'AbortError') {
              console.log("Client disconnected, aborting generation");
              return;
          }
          console.error("FAL VTON failed:", error);
          
          let friendlyError = error.message;
          if (friendlyError.includes("402") || friendlyError.includes("balance") || friendlyError.includes("insufficient")) {
             friendlyError = "На стороне нейросети (FAL) закончились средства. Администратор должен пополнить баланс.";
          } else if (friendlyError.includes("face") && (friendlyError.includes("detected") || friendlyError.includes("found"))) {
             friendlyError = "Внимание: На фото (или в сгенерированной прическе) не было обнаружено лицо для замены 🎭 Попробуйте сделать селфи строго анфас, либо выберите другую стрижку.";
          } else if (friendlyError.includes("FAL")) {
             friendlyError = `Ошибка нейросети: ${error.message}`;
          }

          return res.status(500).json({ 
            error: friendlyError,
            referenceImage: finalImageUrl 
          });
        }

      // Ensure fallback or fast CDN upload
      let tgFileId = null;
      let sentViaTelegram = false;

      // Ensure we have the buffer of the swapped image to send to telegram or save
      let imageBuffer: Buffer | null = null;
      try {
        const imageRes = await fetch(swappedImageUrl);
        if (imageRes.ok) {
           imageBuffer = Buffer.from(await imageRes.arrayBuffer());
        }
      } catch (e) {
        console.warn("Failed to fetch swappedImage for storage:", e);
      }

      // Try sending to Telegram
      if (imageBuffer && req.body.tgUserId) {
        tgFileId = await sendPhotoToTelegramUser(
          req.body.tgUserId, 
          imageBuffer, 
          `💇 Твоя стрижка готова!\n\n<i>${keyword || 'Примерка'}</i>`
        );
        if (tgFileId) {
          sentViaTelegram = true;
          swappedImageUrl = `/api/tg/${tgFileId}`; // Rewrite URL to proxy telegram image
        }
      }

      // Upload to Firebase Storage as fallback if we couldn't send via TG (ex. local dev) or we want permanent url
      if (adminStorage && imageBuffer && !tgFileId) {
         try {
             const bucket = adminStorage.bucket();
             if (bucket.name) {
                 const fileName = `generations/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                 const file = bucket.file(fileName);
                 const uuid = crypto.randomUUID();
                 await file.save(imageBuffer, {
                     metadata: { 
                       contentType: "image/jpeg",
                       metadata: {
                         firebaseStorageDownloadTokens: uuid
                       }
                     }
                 });
                 swappedImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
             }
         } catch (storageErr: any) {
             console.warn("Storage upload skipped. Falling back to temporary image URL.");
         }
      }

      // Final success
      logToTelegram(`🎨 <b>Генерация (${req.body.userId || 'unknown'})</b>\nУспешно.`).catch(console.error);
      
      // Save to cache for 30 days
      await setCachedValue(cacheKey, swappedImageUrl, 30 * 24 * 60 * 60);

      res.json({ 
        imageUrl: swappedImageUrl,            // Final processed image (face swapped)
        referenceImage: finalImageUrl,        // Original generation
        debugError: lastError 
      });

    } catch (err: any) {
      console.error("Full pipeline error:", err);
      logToTelegram(`❌ <b>Ошибка Генерации (${req.body.userId || 'unknown'})</b>\n<code>${err.message || 'Pipeline error'}</code>`).catch(console.error);
      
      try {
        fs.appendFileSync('/app/applet/pipeline_error.log', new Date().toISOString() + ': ' + (err.message || err.toString()) + '\n');
      } catch(e) {}

      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨
      await refundGeneration(req.body.userId);
      
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

      // Check cache for this exact consultation
      const cacheKey = getCacheKey({
        route: "generate-ar-consultation",
        styleKeyword,
        styleName,
        faceDescription // The deterministic JSON string
      });

      const cachedHtml = await getCachedValue<string>(cacheKey);
      if (cachedHtml) {
        console.log("Returned AR consultation from cache!");
        return res.json({ 
          consultationHtml: cachedHtml,
          warning: ""
        });
      }
      
      const systemInstruction = `Ты профессиональный парикмахер. Проанализируй эти особенности лица человека.
Подробно объясни, как стрижка "${styleKeyword}" (${styleName}) будет смотреться на этом конкретном человеке. Напиши 3 пункта: 
- "Персональный анализ": Почему это подойдет или какие нужны адаптации под форму лица.
- "Как просить мастера": Конкретные инструкции для барбера/парикмахера.
- "Уход и укладка": Какие средства использовать каждый день.
Форматируй текст СТРОГО с помощью HTML-тегов (<p>, <strong>, <br>, <ul>, <li>).
НЕ используй синтаксис markdown (никаких \`\`\`html или \`\`\`). Верни ТОЛЬКО готовый HTML код.`;

      let consultationHtml = await callYandexGPT(systemInstruction, `Физические особенности клиента: ${faceDescription}`);
      
      consultationHtml = consultationHtml.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();

      // Save consultation to cache for 30 days
      await setCachedValue(cacheKey, consultationHtml, 30 * 24 * 60 * 60);

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

      const trimmedMessages = messages.length > 6 ? messages.slice(-6) : messages;

      const responseHtml = await callYandexGPTChat(systemInstruction, trimmedMessages);
      
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

      const folderId = process.env.YANDEX_FOLDER_ID;
      const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
      const geminiApiKey = process.env.GEMINI_API_KEY;

      const cleanMimeType = mimeType.split(";")[0].trim();
      const isOgg = cleanMimeType.includes("ogg") || cleanMimeType.includes("opus");

      // Check if Yandex is not set up, or if this is a webm/mp4 structure that Yandex cannot parse directly
      if (!isOgg || !folderId || !saKey) {
        if (geminiApiKey) {
          console.log("Transcribing via Gemini API for browser compatibility:", cleanMimeType);
          try {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ 
              apiKey: geminiApiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build'
                }
              }
            });

            let transcribedText = "";
            let retries = 5;
            let attempt = 0;
            while (retries > 0) {
              try {
                const response = await ai.models.generateContent({
                  model: "gemini-2.5-flash",
                  contents: [
                    {
                      text: "Преврати аудиозапись в текст. Напиши только распознанный текст на русском языке и ничего больше. Не добавляй никаких пояснений, хэштегов или кавычек."
                    },
                    {
                      inlineData: {
                        mimeType: cleanMimeType,
                        data: audioBase64
                      }
                    }
                  ]
                });
                transcribedText = response.text?.trim() || "";
                break;
              } catch (geminiErr: any) {
                retries--;
                attempt++;
                let errMsg = geminiErr.message || JSON.stringify(geminiErr);
                if (retries === 0) {
                  if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand")) {
                      throw new Error("Нейросеть сейчас испытывает высокую нагрузку. Пожалуйста, подождите минуту и попробуйте снова.");
                  }
                  throw geminiErr;
                }
                console.warn(`Gemini fallback STT attempt failed, retrying... (${attempt}/5)`, geminiErr.message);
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
              }
            }

            return res.json({ text: transcribedText });
          } catch (geminiErr: any) {
            console.error("Gemini fallback STT failed:", geminiErr);
            throw new Error(`Ошибка распознавания аудио: ${geminiErr.message}`);
          }
        } else {
             throw new Error("Yandex SpeechKit не настроен, а GEMINI_API_KEY отсутствует для резервного распознавания.");
        }
      }

      // If it has ogg format, use Yandex SpeechKit
      const cleanFolderId = extractFolderId(folderId);
      const iamToken = await getYandexIamToken(saKey);
      const audioBuffer = Buffer.from(audioBase64, 'base64');

      const url = `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=${cleanFolderId}&lang=ru-RU&format=oggopus`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${iamToken}`,
          "Content-Type": "application/octet-stream"
        },
        body: audioBuffer
      });

      if (!response.ok) {
         const errText = await response.text();
         // If Yandex fails due to format / ogg header issue, try Gemini as safety net
         if ((errText.includes("header") || response.status === 400) && geminiApiKey) {
            console.warn("Yandex STT failed with 400. Trying Gemini API fallback...");
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ 
              apiKey: geminiApiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build'
                }
              }
            });
            let textResult = "";
            let retries = 5;
            let attempt = 0;
            while (retries > 0) {
              try {
                  const fallbackResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [
                      { text: "Преврати аудиозапись в текст. Напиши только распознанный текст на русском языке и ничего больше." },
                      { inlineData: { mimeType: cleanMimeType, data: audioBase64 } }
                    ]
                  });
                  textResult = fallbackResponse.text?.trim() || "";
                  break;
              } catch (geminiErr: any) {
                  retries--;
                  attempt++;
                  let errMsg = geminiErr.message || JSON.stringify(geminiErr);
                  if (retries === 0) {
                    if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand")) {
                        throw new Error("Нейросеть сейчас испытывает высокую нагрузку. Пожалуйста, подождите минуту и попробуйте снова.");
                    }
                    throw geminiErr;
                  }
                  console.warn(`Gemini API fallback attempt failed, retrying... (${attempt}/5)`, geminiErr.message);
                  await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
              }
            }
            return res.json({ text: textResult });
         }
         throw new Error(`Ошибка Yandex SpeechKit STT (HTTP ${response.status}): ${errText}`);
      }

      const data = await response.json();
      const transcribedText = data.result || "";
      return res.json({ text: transcribedText });
    } catch (err: any) {
      console.error("Transcribe error:", err);
      res.status(500).json({ error: err.message || "Ошибка транскрибации" });
    }
});

generateRouter.post("/load-more", async (req, res) => {
  try {
    const { userId, existingNames, features, preferredStyle } = req.body;
    
    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let existingStr = "";
    if (Array.isArray(existingNames) && existingNames.length > 0) {
      existingStr = existingNames.join(", ");
    }
    
    const prompt = `Пользователь ищет варианты причесок.
Сгенерируй 4 новых и УНИКАЛЬНЫХ рекомендации причесок.
ОНИ НЕ ДОЛЖНЫ СТРЕЧАТЬСЯ В ЭТОМ СПИСКЕ: ${existingStr}.
Предпочитаемый стиль: ${preferredStyle || "Любой"}.

Особенности пользователя:
Пол: ${features?.gender || "Не указан"}
Форма лица: ${features?.faceShape || "Не указана"}
Густота волос: ${features?.hairDensity || "Не указана"}
Тип волос: ${features?.hairType || "Не указан"}
Длина: ${features?.hairLength || "Не указана"}

Для каждого варианта:
- name: Название прически (например "Удлиненный боб", "Пикси", "Crop"). Возвращай короткое и понятное название на русском!
- imageKeyword: Транслителированное или английское название для запроса в нейросеть (стабильное имя стиля).
- description: Почему это подойдет пользователю (1-2 предложения на русском).
- stylingTips: Краткий совет по укладке.`;

    let data: any = null;
    let retries =  5;
    let attempt = 0;
    while(retries > 0) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      imageKeyword: { type: Type.STRING },
                      stylingTips: { type: Type.STRING }
                    },
                    required: ["name", "description", "imageKeyword", "stylingTips"]
                  }
                }
              },
              required: ["recommendations"]
            }
          }
        });
        
        const responseText = response.text || "{}";
        data = JSON.parse(responseText);
        break; // Success
      } catch (geminiErr: any) {
        retries--;
        attempt++;
        let errMsg = geminiErr.message || JSON.stringify(geminiErr);
        if (retries === 0) {
          if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand") || errMsg.includes("429")) {
              throw new Error("Нейросеть сейчас испытывает высокую нагрузку. Пожалуйста, подождите минуту и попробуйте снова.");
          }
          throw geminiErr;
        }
        console.warn(`Gemini API fallback attempt failed, retrying... (${attempt}/5)`, geminiErr?.message);
        // wait exponential backoff
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
    
    res.json({ recommendations: data?.recommendations || [] });
  } catch (err: any) {
    console.error("Load more error:", err);
    res.status(500).json({ error: err.message || "Ошибка генерации новых вариантов." });
  }
});
