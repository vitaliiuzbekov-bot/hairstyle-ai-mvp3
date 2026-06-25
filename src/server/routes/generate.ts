
import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { logToTelegram } from "../services/logger";
import { callYandexGPT, callYandexGPTChat, getYandexIamToken, extractFolderId } from "../services/yandex";
import { getCacheKey, getCachedValue, setCachedValue } from "../services/cache";
import { adminApp, adminStorage } from "../firebase";
import crypto from "crypto";
import { sendPhotoToTelegramUser } from "../services/telegramBot";
import { safeParseJSON } from "../utils/json";
import { geminiQueue, imageGenQueue, withRetry } from "../utils/queues";
import { createRateLimiter } from "../utils/rateLimiter";

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
import { uploadImageToFal } from "../services/falClient";

export const generateRouter = Router();

const customBlueprintCache = new Map<string, string>();

// Stricter limits for heavy text models and logic
const freeModelsLimiter = createRateLimiter(5 * 60 * 1000, 10); // 10 per 5 min
const heavyImageLimiter = createRateLimiter(10 * 60 * 1000, 5); // 5 per 10 min

generateRouter.post("/generate-reference", heavyImageLimiter, async (req, res) => {
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
        route: "generate-reference-v27-gemini-prompt", 
        keyword, gender, customHairColor, ageRange, skinTone, faceShape, facialHair,
        hairDensity, hairType, hairLength, hairlineStatus, hairQuality, clothingContext
      });
      const cachedImage = await getCachedValue<string>(cacheKey);
      if (cachedImage) {
        console.log("Returned reference from cache!");
        return res.json({ imageUrl: cachedImage });
      }

      let finalImageUrl = "";
      let lastError = "";

      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "FAL_KEY не установлен" });
      }

      console.log("Generating reference via fal-ai/flux/schnell...");
      try {
        const isMale = gender === "male" || gender === "Мужчина";
        const femalePrompt = "Professional front-facing portrait of a 25-year-old striking Caucasian woman, head and shoulders visible, perfectly symmetrical face. Neutral lighting, clean white background. Centered framing, entire hairstyle is fully visible in frame. ";
        const malePrompt = "Professional front-facing portrait of a 28-year-old striking Caucasian man, head and shoulders visible, perfectly symmetrical face, strong square jaw, sparse stubble. Neutral lighting, clean white background. Centered framing, entire hairstyle is fully visible in frame. ";
        
        const base = isMale ? malePrompt : femalePrompt;
        const seedValue = isMale ? 99999 : 55555;
        
        // Pass original hair structure info if provided, otherwise default to natural straight to avoid unexpected curls
        const safeHairType = hairType && hairType.toLowerCase() !== "не указано" ? hairType : "straight/natural";
        const hairDesc = (haircutName || keyword) + (description ? ", " + description : "") + ". Hair texture: " + safeHairType;
        const colorDesc = customHairColor && customHairColor !== "Любой" ? " Color: " + customHairColor : "";
        
        const finalPrompt = base + "Hair is " + hairDesc + "." + colorDesc;

        const falRes = await fetch("https://fal.run/fal-ai/flux/schnell", {
            method: "POST",
            headers: {
                "Authorization": `Key ${falKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: finalPrompt,
                image_size: "portrait_4_3",
                seed: seedValue,
                num_inference_steps: 4
            })
        });

        if (!falRes.ok) {
            const errText = await falRes.text();
            throw new Error(`FAL.AI Error: ${falRes.status} - ${errText}`);
        }

        const data = await falRes.json();
        const generatedUrl = data.images[0].url;

        // Fetch image as base64 to send to client properly
        const imageFetch = await fetch(generatedUrl);
        const imageBuf = await imageFetch.arrayBuffer();
        finalImageUrl = `data:image/jpeg;base64,${Buffer.from(imageBuf).toString('base64')}`;

      } catch (err: any) {
        lastError += `[FAL Flux: ${err.message}]`;
        console.error("FAL Flux Failed:", err);
      }

      if (!finalImageUrl) {
          throw new Error(`К сожалению, не удалось сгенерировать референс прически. Ошибка: ${lastError}`);
      } else {
          // Save to cache for 30 days (30 * 24 * 60 * 60 seconds)
          await setCachedValue(cacheKey, finalImageUrl, 30 * 24 * 60 * 60);
      }
      
      if (finalImageUrl) {
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
        userId, gender, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        vtonStrength, // Number from 50 to 100
        targetImageUrl, // Optional, generated reference image URL
        hairlineStatus, hairQuality, idempotencyKey
      } = req.body;
      
      const keyword = decodeURIComponent(req.body.keyword || "");
      const description = decodeURIComponent(req.body.description || "");
      const customHairColor = req.body.customHairColor ? decodeURIComponent(req.body.customHairColor) : undefined;
      
      let selfieImage = req.body.selfieImage;
      if (req.file) {
        selfieImage = req.file.buffer.toString('base64');
      }

      if (!keyword || !selfieImage) {
        return res.status(400).json({ error: "Missing parameters: keyword and selfieImage are required." });
      }

      let finalTargetImageUrl = targetImageUrl;
      if (finalTargetImageUrl) {
        let isLocalUrl = false;
        let parsedPath = finalTargetImageUrl;
        if (finalTargetImageUrl.startsWith('http')) {
            try {
                const urlObj = new URL(finalTargetImageUrl);
                // If it's the current app's hostname, or localhost, or ends in run.app
                // Actually, just extract the pathname and see if it's a known local asset
                parsedPath = urlObj.pathname;
                isLocalUrl = true; 
            } catch(e) {}
        } else if (finalTargetImageUrl.startsWith('/') || finalTargetImageUrl.startsWith('golden_base/')) {
            isLocalUrl = true;
        }

        if (isLocalUrl && (parsedPath.startsWith('/') || parsedPath.startsWith('golden_base/'))) {
            let normalizePath = parsedPath.startsWith('/') ? parsedPath : '/' + parsedPath;
            // Strip any query strings that Vite might append (e.g. ?import or ?v=...)
            if (normalizePath.includes('?')) {
                normalizePath = normalizePath.split('?')[0];
            }
            
            // Try reading from public or dist folders, and also src for dev mode
            // Remove leading slash for safe join
            const safePath = normalizePath.replace(/^\/+/, '');
            let localPath = path.join(process.cwd(), 'dist', safePath);
            if (!fs.existsSync(localPath)) {
                localPath = path.join(process.cwd(), 'public', safePath);
            }
            if (!fs.existsSync(localPath) && normalizePath.startsWith('/src/')) {
                localPath = path.join(process.cwd(), safePath);
            }
            if (fs.existsSync(localPath)) {
                const buf = fs.readFileSync(localPath);
                const ext = path.extname(localPath).toLowerCase();
                const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                finalTargetImageUrl = `data:${mime};base64,${buf.toString('base64')}`;
                console.log(`[generate-full] Successfully loaded local target image ${localPath}`);
            } else {
                try {
                    const localUrl = `http://0.0.0.0:3000${normalizePath}`;
                    console.log(`[generate-full] Fetching target image from local dev server: ${localUrl}`);
                    const imgRes = await fetch(localUrl);
                    if (imgRes.ok) {
                        const arrayBuffer = await imgRes.arrayBuffer();
                        const buf = Buffer.from(arrayBuffer);
                        const ext = path.extname(normalizePath).toLowerCase();
                        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                        finalTargetImageUrl = `data:${mime};base64,${buf.toString('base64')}`;
                        console.log(`[generate-full] Successfully loaded local target image from dev server: ${normalizePath}`);
                    } else {
                        console.log(`[generate-full] WARNING: Could not fetch local target image from dev server. Status: ${imgRes.status}`);
                    }
                } catch (e) {
                    console.error(`[generate-full] Error fetching local target image from dev server:`, e);
                }
            }
            if (!finalTargetImageUrl.startsWith('data:')) {
                console.log(`[generate-full] CRITICAL WARNING: targetImageUrl could not be resolved to base64. Using original path: ${normalizePath}`);
            }
        }
      }

      // Check cache first (Cache for 30 days)
      const cacheKey = getCacheKey({ 
        route: "generate-full-v9-reference-vision", 
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
      
      // Map UI vtonStrength (50-100) to fluxStrength (0.3 - 0.75). 
      // Higher strength means more hair change, lower means strict adherence to original jaw/face.
      let uiStrength = Number(vtonStrength) || 45; 
      let fluxStrength = 0.75; // Default

      if (finalTargetImageUrl) {
          // Studio Shot logic: Use catalog image as base and completely skip flux for exact 100% hair shape. 
          // Note: This results in the catalog model's body being used.
          console.log("Visual reference provided, enabling Catalog Studio Shot");
          baseImageForFlux = finalTargetImageUrl;
          fluxStrength = 0.05; 
      } else {
          // Map linearly: 50 -> 0.45, 100 -> 0.75
          if (uiStrength >= 50 && uiStrength <= 100) {
              fluxStrength = 0.45 + ((uiStrength - 50) / 50) * 0.30;
          }
          if (keyword && keyword.includes("same exact current hairstyle")) {
              fluxStrength = 0.35; // keep original structure
          }
      }

      let promptEng = "";
      try {
        console.log("Generating prompt via Gemini AI...");
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            throw new Error("GEMINI_API_KEY не установлен");
        }
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ 
            apiKey: geminiApiKey, 
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        
        let systemInstruction = `You are an expert AI image generation prompt engineer.
Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI (e.g., Flux) to change a person's hairstyle in an image.
We have the following specs from the user (some may be in Russian):
- Gender: ${gender || "not specified"}
- Age: ${ageRange || "not specified"}
- Target Hairstyle: ${keyword}
- Base description of the style: ${description || "None"}
- Desired Hair Color: ${finalColor || 'Original hair color'}
- Original face features: Face shape: ${faceShape || "Unknown"}, Skin tone: ${skinTone || "Unknown"}, Eye color: ${eyeColor || "Unknown"}, Facial hair: ${facialHair || "None"}
- Hair qualities requested: Length: ${hairLength || "-"}, Type: ${hairType || "-"}, Density: ${hairDensity || "-"}, Hairline: ${hairlineStatus || "-"}, Quality: ${hairQuality || "-"}
- Clothing/Background instruction: ${clothingContext || "Do not change clothes/background"}

Instructions:
1. Translate the required hairstyle and qualities into English (if needed).
2. Write a prompt in English for a photorealistic portrait.
3. The prompt MUST describe the person's age/gender accurately based on the specs (e.g. "middle-aged man", "young adult woman"). Do not add unnatural smoothing if the person is old.
4. The requested hairstyle MUST be described in critical detail and clarity based on the targeted style.
5. If a hair color is specified, make it absolutely clear that it must be applied across the ENTIRE head without gradients/other shades. Use strict phrasing.
6. Make sure to specify that the person's face structure (eyes, nose, mouth, chin, jawline) MUST remain completely unchanged.
7. The clothing/background instructions should be incorporated if present.
8. Start the prompt with [CRITICAL HAIRSTYLE TRANSFORMATION:] and focus heavily on hair changing.
9. Return ONLY the final English prompt text. No extra text, no markdown. Max length 1500 characters.`;

        let contentsPayload: any = [{ text: systemInstruction }];

        if (finalTargetImageUrl && finalTargetImageUrl.startsWith("data:image/")) {
            const mimeType = finalTargetImageUrl.split(';')[0].split(':')[1];
            const base64Data = finalTargetImageUrl.split(',')[1];
            contentsPayload.push({
               inlineData: {
                  data: base64Data,
                  mimeType: mimeType
               }
            });
            contentsPayload[0].text += `\n\n[CRITICAL VISUAL REFERENCE]: The user provided a reference image showing the target hairstyle (attached). You MUST deeply analyze the attached image and describe the EXACT hairstyle shown in it in extreme visual detail (including hair length, parting, texture, volume, waves/curls, fade, and overall geometry). Use YOUR visual analysis of this attached image as the primary hairstyle description in your final prompt, ignoring any generic text name in 'Target Hairstyle' if it conflicts!`;
        }

        const promptRes = await geminiQueue.add(() => withRetry(() => ai.models.generateContent({
             model: 'gemini-2.5-flash', // Flash to prevent quota limits
             contents: { parts: contentsPayload },
             config: {
                 temperature: 0.7,
                 maxOutputTokens: 500
             }
        })));
        promptEng = promptRes?.text?.trim() || "";
      } catch (err: any) {
        console.error("Gemini failed to generate prompt, falling back to basic prompt:", err?.message || err);
        // Better fallback prompt with basic translation for common rus words
        let mappedKw = keyword || "";
        if (mappedKw.includes("Пикси")) mappedKw = "Pixie haircut, very short elegant female cut";
        if (mappedKw.includes("Классический Боб")) mappedKw = "Classic Bob haircut, elegant straight hair above shoulders";
        if (mappedKw.includes("Удлиненный боб")) mappedKw = "Long Bob (Lob), collarbone length";
        if (mappedKw.includes("с челкой")) mappedKw += " with bangs/fringe";
        if (mappedKw.includes("Свой референс")) mappedKw = "Different elegant hairstyle based on reference";
        
        promptEng = `A photorealistic portrait of a person. Age: ${ageRange || "unknown"}, Gender: ${gender || "unknown"}. New Hairstyle: ${mappedKw} - ${description || ""}. Desired Hair Color: ${finalColor || "original"}. The face features must remain exactly the same.`;
        if (finalColor) {
            promptEng = `[STRICTLY ${finalColor.toUpperCase()} HAIR COLOR] ` + promptEng;
        }
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
            
            const fluxBaseImageUrl = baseImageForFlux.startsWith('data:') ? await uploadImageToFal(baseImageForFlux) : baseImageForFlux;

            const bodyPayload: any = {
               prompt: promptEng,
               image_url: fluxBaseImageUrl,
               strength: fluxStrength,
               num_inference_steps: 15
            };
            
            const fluxRes = await imageGenQueue.add(() => fetch(endpoint, {
              method: "POST",
              headers: {
                "Authorization": `Key ${falKey}`,
                "Content-Type": "application/json"
              },
              signal: controller.signal,
              body: JSON.stringify(bodyPayload)
            })) as globalThis.Response;

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
         
         const baseImageUrlForFal = finalImageUrl.startsWith('data:') ? await uploadImageToFal(finalImageUrl) : finalImageUrl;
         const swapImageUrlForFal = selfieImageFull.startsWith('data:') ? await uploadImageToFal(selfieImageFull) : selfieImageFull;

         const faceSwapPayload = {
           base_image_url: baseImageUrlForFal,
           swap_image_url: swapImageUrlForFal
         };
         console.log("FaceSwap Payload:", JSON.stringify(faceSwapPayload).substring(0, 500) + "... (truncated)");
         
         const falRes = await imageGenQueue.add(() => fetch("https://fal.run/fal-ai/face-swap", {
           method: "POST",
           headers: {
             "Authorization": `Key ${falKey}`,
             "Content-Type": "application/json"
           },
           signal: controller.signal,
           body: JSON.stringify(faceSwapPayload)
         })) as globalThis.Response;

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

  
generateRouter.post("/generate-ar", freeModelsLimiter, async (req, res) => {
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

  
generateRouter.post("/chat-stylist", freeModelsLimiter, async (req, res) => {
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

      const cleanMimeType = mimeType.split(";")[0].trim();
      const isOgg = cleanMimeType.includes("ogg") || cleanMimeType.includes("opus");

      if (!folderId || !saKey) {
          throw new Error("Yandex SpeechKit не настроен (отсутствует YANDEX_FOLDER_ID или YANDEX_SERVICE_ACCOUNT_KEY).");
      }

      const cleanFolderId = extractFolderId(folderId);
      const iamToken = await getYandexIamToken(saKey);
      const audioBuffer = Buffer.from(audioBase64, 'base64');

      const formatArg = isOgg ? "oggopus" : "lpcm";
      const url = `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=${cleanFolderId}&lang=ru-RU&format=${formatArg}`;
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

generateRouter.post("/load-more", freeModelsLimiter, async (req, res) => {
  try {
    const { userId, existingNames, features, preferredStyle } = req.body;
    
    let existingStr = "";
    if (Array.isArray(existingNames) && existingNames.length > 0) {
      existingStr = existingNames.join(", ");
    }
    
    const systemInstruction = `Ты стилист-ассистент. Отвечай СТРОГО в формате JSON без markdown:
{
  "recommendations": [
    {
      "name": "Название прически",
      "imageKeyword": "keyword",
      "description": "Описание",
      "stylingTips": "Советы"
    }
  ]
}`;

    const prompt = `Пользователь ищет варианты причесок.
Сгенерируй 4 новых и УНИКАЛЬНЫХ рекомендации причесок.
ОНИ НЕ ДОЛЖНЫ СТРЕЧАТЬСЯ В ЭТОМ СПИСКЕ: ${existingStr}.
Предпочитаемый стиль: ${preferredStyle || "Любой"}.

Особенности пользователя:
Пол: ${features?.gender || "Не указан"}
Форма лица: ${features?.faceShape || "Не указана"}
Густота волос: ${features?.hairDensity || "Не указана"}
Тип волос: ${features?.hairType || "Не указан"}
Длина: ${features?.hairLength || "Не указана"}`;

    let data: any = null;
    try {
        const responseText = await callYandexGPT(systemInstruction, prompt);
        data = safeParseJSON(responseText);
    } catch (err: any) {
        console.warn("YandexGPT / JSON Parse failed in /load-more, trying Gemini with JSON schema fallback:", err.message);
    }

    if (!data) {
        try {
            const { GoogleGenAI, Type } = await import("@google/genai");
            const geminiApiKey = process.env.GEMINI_API_KEY;
            if (geminiApiKey) {
                const ai = new GoogleGenAI({ 
                  apiKey: geminiApiKey,
                  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
                });
                const response = await geminiQueue.add(() => withRetry(async () => {
                    let lastError;
                    const modelsToTry = ['gemini-2.5-flash'];
                    for (const modelName of modelsToTry) {
                        try {
                            return await ai.models.generateContent({
                                model: modelName,
                                contents: prompt,
                                config: {
                                    systemInstruction: systemInstruction,
                                    temperature: 0.85,
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
                                                        imageKeyword: { type: Type.STRING },
                                                        description: { type: Type.STRING },
                                                        stylingTips: { type: Type.STRING }
                                                    },
                                                    required: ["name", "imageKeyword", "description", "stylingTips"]
                                                }
                                            }
                                        },
                                        required: ["recommendations"]
                                    }
                                }
                            });
                        } catch (err: any) {
                           lastError = err;
                           const msg = err.message || String(err);
                           if (!msg.includes("503") && !msg.includes("429") && !msg.includes("high demand") && !msg.includes("UNAVAILABLE")) {
                               throw err;
                           }
                        }
                    }
                    throw lastError;
                }));
                if (response.text) {
                    data = safeParseJSON(response.text);
                }
            }
        } catch (geminiErr: any) {
            console.error("Gemini fallback in /load-more failed:", geminiErr);
        }
    }

    if (!data || !data.recommendations) {
        throw new Error("Ошибка генерации новых вариантов через нейросеть.");
    }
    
    res.json({ recommendations: data.recommendations });
  } catch (err: any) {
    console.error("Load more error:", err);
    res.status(500).json({ error: err.message || "Ошибка генерации новых вариантов." });
  }
});
