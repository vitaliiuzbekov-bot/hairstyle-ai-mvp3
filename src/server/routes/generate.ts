import fs from "fs";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, fieldSize: 15 * 1024 * 1024 } });

import { Request, Response, Router } from "express";
import path from "path";
import os from "os";
import { exec } from "child_process";
import { logToTelegram } from "../services/logger";
import { callLLM, callLLMChat, getYandexIamToken, extractFolderId } from "../services/llm";
import { getCacheKey, getCachedValue, setCachedValue } from "../services/cache";
import { adminApp, adminStorage, adminDb } from "../firebase";
import crypto from "crypto";
import { uploadBufferToFirebase } from "../utils/firebaseStorage";
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
import { defaultImageService } from "../services/ImageGenerationService";
import { isAuthorizedDeveloper } from "../utils/tgAuth";

async function getUrlForFal(url) {
    if (!url) return url;
    if (url.startsWith('data:')) {
        return await uploadImageToFal(url);
    }
    if (url.startsWith('/tmp/')) {
        const fileName = url.split('/').pop();
        const localPath = path.join(process.cwd(), 'tmp', fileName);
        if (fs.existsSync(localPath)) {
            const fileBuffer = fs.readFileSync(localPath);
            const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
            return await uploadImageToFal(base64Data);
        } else {
            console.error(`[getUrlForFal] File not found: ${localPath}`);
            // DO NOT THROW. Return original url, maybe it's hosted elsewhere somehow?
            // Actually, if we're here, it's definitely an error, but let's see.
            throw new Error(`Локальный файл не найден: ${url}`);
        }
    }
    return url;
}

function getProxiedUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http')) {
        return `/api/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
}




async function resolveImageToBase64(imageUrl: string | undefined): Promise<string | undefined> {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    // If it's already a fal.media URL, FAL can definitely access it
    if (imageUrl.includes('fal.media') || imageUrl.includes('fal.run')) {
        return imageUrl;
    }

    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/') && imageUrl.length > 1000) {
        return `data:image/jpeg;base64,${imageUrl}`;
    }
    
    let isLocalUrl = false;
    let parsedPath = imageUrl;
    if (imageUrl.startsWith('http')) {
        try {
            const urlObj = new URL(imageUrl);
            if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1') || urlObj.hostname.includes('0.0.0.0')) {
                parsedPath = urlObj.pathname + urlObj.search;
                isLocalUrl = true; 
            }
        } catch(e) { console.error("Ignored error:", e); }
    } else if (imageUrl.startsWith('/')) {
        isLocalUrl = true;
    }
    
    if (isLocalUrl) {
        const normalizePath = parsedPath.startsWith('/') ? parsedPath : '/' + parsedPath;
        const cleanPath = normalizePath.split('?')[0];
        try {
            const localUrl = `http://0.0.0.0:3000${normalizePath}`;
            const imgRes = await fetch(localUrl);
            if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                const buf = Buffer.from(arrayBuffer);
                let mime = imgRes.headers.get('content-type') || 'image/jpeg';
                if (!mime.startsWith('image/')) mime = 'image/jpeg';
                return `data:${mime};base64,${buf.toString('base64')}`;
            }
        } catch (e) {}
        
        const path = await import('path');
        const safePath = cleanPath.replace(/^\/+/, '');
        let localPath = path.join(process.cwd(), 'dist', safePath);
        if (!fs.existsSync(localPath)) localPath = path.join(process.cwd(), 'public', safePath);
        if (!fs.existsSync(localPath) && cleanPath.startsWith('/src/')) localPath = path.join(process.cwd(), safePath);
        
        if (fs.existsSync(localPath)) {
            const buf = fs.readFileSync(localPath);
            const ext = path.extname(localPath).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
            return `data:${mime};base64,${buf.toString('base64')}`;
        }
        return imageUrl;
    }
    
    // For all other remote URLs, download them to base64 to prevent FAL "file_download_error"
    try {
        
        console.log("[resolveImageToBase64] Attempting to download remote URL:", imageUrl);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(new Error("Timeout downloading image")), 15000);
        const imgRes = await fetch(imageUrl, {
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        clearTimeout(timeout);

        if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            let buf = Buffer.from(arrayBuffer);
            let mime = imgRes.headers.get('content-type') || 'image/jpeg';
            if (!mime.startsWith('image/')) mime = 'image/jpeg';
            try {
                const sharp = (await import('sharp')).default;
                buf = await sharp(buf).resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
                mime = 'image/jpeg';
            } catch (e) {
                console.warn("[resolveImageToBase64] Failed to resize, using original:", e.message);
            }
            return `data:${mime};base64,${buf.toString('base64')}`;
        } else {
            console.error("[resolveImageToBase64] HTTP Error downloading image:", imgRes.status);
            throw new Error(`Не удалось загрузить изображение по ссылке (HTTP ${imgRes.status})`);
        }
    } catch (e: any) {
        console.error(`[resolveImage] Could not download remote image to base64:`, e.message);
        throw new Error(`Ошибка загрузки изображения: ${e.message}`);
    }
}

export const generateRouter = Router();
const jobMap = new Map<string, any>();
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of jobMap.entries()) {
    if (now - (val.createdAt || 0) > 30 * 60 * 1000) jobMap.delete(key);
  }
}, 5 * 60 * 1000);










const customBlueprintCache = new Map<string, string>();

// Stricter limits for heavy text models and logic
const freeModelsLimiter = createRateLimiter(10 * 60 * 1000, 10); // 10 per 5 min
const heavyImageLimiter = createRateLimiter(10 * 60 * 1000, 5); // 5 per 10 min

generateRouter.post("/generate-reference", heavyImageLimiter, async (req, res) => {
    try {
      const { 
        gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        hairlineStatus, hairQuality, idempotencyKey, haircutName
      } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      // Check cache first (Cache for 30 days)
        const cacheKey = "v3_force_update_" + getCacheKey({ 
        route: "generate-reference-v28-gender-fixed", 
        keyword, description, gender, ageRange, skinTone, faceShape, facialHair,
        hairDensity, hairType, hairLength, hairlineStatus, hairQuality, clothingContext
      });
      console.log("[generate-full] checking cache..."); 

      const cachedImage = await getCachedValue<string>(cacheKey);
      
 console.log("[generate-full] cache checked!");
      if (cachedImage) {
        console.log("Returned reference from cache!");
        return res.json({ imageUrl: getProxiedUrl(cachedImage) });
      }

      let finalImageUrl = "";
      let lastError = "";

      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "FAL_KEY не установлен" });
      }

      console.log("Generating reference via fal-ai/flux/dev (Ultra-Realistic)...");
      try {
        const isFemale = (gender || "").toLowerCase() === "female" || (gender || "").toLowerCase().includes("жен");
        const isMale = !isFemale && ((gender || "").toLowerCase() === "male" || (gender || "").toLowerCase().includes("муж") || (gender || "").toLowerCase().includes("man") || (gender || "").toLowerCase().includes("boy"));
        
        const safeAge = ageRange || (isMale ? "30" : "25");
        const safeSkinTone = skinTone && skinTone !== "не указано" ? skinTone : "natural";
        
        // Build base prompt dynamically based on client features
        let base = `Ultra-realistic amateur smartphone photo, en face portrait facing camera directly, of a ${safeAge}-year-old ${isMale ? 'man' : 'woman'} looking directly at the camera. `;
        base += `Skin tone: ${safeSkinTone}, natural skin texture, pores, casual lighting, plain white wall background. `;
        
        if (isMale) {
            const hasBeard = (facialHair || "").toLowerCase().includes("бород") || (facialHair || "").toLowerCase().includes("усы") || (facialHair || "").toLowerCase().includes("beard");
            if (!hasBeard) {
                base += "Clean shaven, strictly no beard, no mustache, no stubble. ";
            } else {
                base += `Facial hair: ${facialHair}. `;
            }
        }
        
        base += "Centered front-facing framing, unedited raw photography, no plastic smoothing. NO PHONES, NO HANDS, NO MIRRORS in the frame. Entire hairstyle is fully visible. ";
        
        const seedValue = Math.floor(Math.random() * 1000000);
        
        const safeHairType = hairType && hairType.toLowerCase() !== "не указано" ? hairType : "straight/natural";
        const safeHairColor = hairColor && hairColor.toLowerCase() !== "не указано" ? hairColor : "";
        const hairDesc = (haircutName || keyword) + (description ? ", " + description : "") + ". Texture: " + safeHairType;
        const colorDesc = safeHairColor ? `Color: ${safeHairColor}.` : "";
        
        const finalPrompt = base + "Hairstyle strictly applied: " + hairDesc + ". " + colorDesc;

        let falRes: globalThis.Response | null = null;
        let retries = 2;
        let lastErrorText = "";
        while (retries >= 0) {
            try {
                falRes = await fetch("https://fal.run/fal-ai/flux/dev", {
                    method: "POST",
                    headers: {
                        "Authorization": `Key ${falKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: finalPrompt,
                        image_size: "portrait_4_3",
                        seed: seedValue,
                        num_inference_steps: 25,
                        guidance_scale: 3.5
                    })
                });

                if (!falRes.ok) {
                    lastErrorText = await falRes.text();
                    if (falRes.status === 502 || falRes.status === 503 || falRes.status === 504) {
                        retries--;
                        if (retries >= 0) {
                            console.log(`FAL Flux Dev Reference HTTP ${falRes.status}, retrying...`);
                            await new Promise(r => setTimeout(r, 1000));
                            continue;
                        }
                    }
                    throw new Error(`FAL.AI Error: ${falRes.status} - ${lastErrorText}`);
                }
                break;
            } catch (e: any) {
                if (retries > 0) {
                    retries--;
                    console.log("FAL Flux Dev Reference fetch error, retrying...", e.message);
                    await new Promise(r => setTimeout(r, 1000));
                } else {
                    throw e;
                }
            }
        }
        
        if (!falRes) throw new Error("FAL.AI Flux Dev Reference failed after retries.");

        const data = await falRes.json();
        const generatedUrl = data.images[0].url;

        // Fetch image as base64 to send to client properly
        const imageFetch = await fetch(generatedUrl);
        const imageBuf = await imageFetch.arrayBuffer();
        finalImageUrl = `data:image/jpeg;base64,${Buffer.from(imageBuf).toString('base64')}`;

            } catch (err: any) {
        console.error("\n\n[CRITICAL ERROR] GEMINI QUOTA EXCEEDED! PREVENTING BLIND FALLBACK TO SAVE MONEY AND AVOID 2-FACES.\n\n"); 
        console.error("Gemini failed to generate prompt:", err?.message || err);
        const errMsg = err?.message || String(err); 
        logToTelegram(`❌ *БЛОКИРОВКА ГЕНЕРАЦИИ:* Ошибка квот Gemini API (${errMsg}). Генерация остановлена, чтобы не допустить брака (эффекта двух лиц из-за слепого промпта).`).catch(console.error);
        
        // Throw an error explicitly to stop the generation pipeline and refund token if logic permits
        throw new Error("Лимит запросов к AI-анализатору исчерпан. Пожалуйста, подождите немного или обратитесь к администратору (Quota Exceeded).");
      }

        if (finalImageUrl) {
            await setCachedValue(cacheKey, finalImageUrl, 30 * 24 * 60 * 60);
            res.json({ imageUrl: getProxiedUrl(finalImageUrl) });
        }
    } catch (outerErr: any) {
        console.error('Generate reference error:', outerErr);
        res.status(500).json({ error: outerErr.message });
    }
});
generateRouter.post("/generate-full/status", async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    const { jobId } = req.body;
    if (!jobId || typeof jobId !== 'string') return res.status(400).json({ error: "Missing jobId" });
    
    if (!adminDb) return res.status(500).json({ error: "DB not initialized" });
    
    if (jobMap.has(jobId)) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res.json(jobMap.get(jobId));
    }
    const doc = await adminDb.collection("jobs").doc(jobId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); res.json(doc.data());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Re-added for backward compatibility with old cached clients
generateRouter.get('/job/:jobId', async (req, res) => {
  res.setHeader('Expires', '0');
  try {
    const { jobId } = req.params;
    console.log("[GET /job/:jobId] Polling for jobId:", jobId);
    if (!jobId || typeof jobId !== 'string') return res.status(400).json({ error: "Missing jobId" });


    
    if (!adminDb) return res.status(500).json({ error: "DB not initialized" });
    
    if (jobMap.has(jobId)) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res.json(jobMap.get(jobId));
    }
    const doc = await adminDb.collection("jobs").doc(jobId).get();
    if (!doc.exists) {
      console.log("[GET /job/:jobId] Job not found in Firestore:", jobId);
      return res.status(404).json({ error: "Job not found" });
    }
    
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); 
    const result = doc.data();
    console.log("[GET /job/:jobId] Result from Firestore:", result);
    res.json(result);
  } catch (err) {
    console.error("[GET /job/:jobId] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const handleGenerateFull = async (req, res) => { console.log("HITTING handleGenerateFull", req.body);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error("Global timeout 10m")), 10 * 60 * 1000);
    try {
      const { 
        userId, gender, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        vtonStrength, // Number from 50 to 100
        targetImageUrl, // Optional, generated reference image URL
        hairlineStatus, hairQuality, idempotencyKey
      } = req.body;
      
      const jobId = idempotencyKey || crypto.randomUUID();
      

      
      const keyword = decodeURIComponent(req.body.keyword || "");
      const description = decodeURIComponent(req.body.description || "");
      
      let selfieImage = req.body.selfieImage;
      if (req.file) {
        selfieImage = req.file.buffer.toString('base64');
      }

      if (!keyword || !selfieImage) {
        return res.status(400).json({ error: "Missing parameters: keyword and selfieImage are required." });
      }

      console.log("[generate-full] resolving target..."); 
let finalTargetImageUrl = await resolveImageToBase64(targetImageUrl);
 console.log("[generate-full] target resolved!");

      // Check cache first (Cache for 30 days)
       const cacheKey = "v3_force_update_" + getCacheKey({ 
        route: "generate-full-v9-reference-vision", 
        userId, keyword, description, hairColor, vtonStrength, targetImageUrl: finalTargetImageUrl,
        // using string truncation or full string to hash the selfie.
        // String hashing is deterministic.
        selfieHash: getCacheKey(selfieImage),
        hairlineStatus, hairQuality
      });
      const cachedImage = await getCachedValue<string>(cacheKey);
      if (cachedImage) {
        console.log("Returned VTON from cache!");
        return res.json({ imageUrl: getProxiedUrl(cachedImage) });
      }

      // 🚨 DEDUCT GENERATIONS ON THE BACKEND 🚨
      const isDeveloper = isAuthorizedDeveloper(req.header('x-telegram-init-data'));
      
      // Upload the user's original selfie to Firebase Storage so we can show it in the slider
      let originalImageUrl = "";
      if (adminStorage && selfieImage) {
        try {
          const match = selfieImage.match(/^data:image\/(\w+);base64,(.+)$/);
          if (match) {
            const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
            const buffer = Buffer.from(match[2], 'base64');
            const bucket = adminStorage.bucket();
            if (bucket.name) {
              const fileName = `originals/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
              const file = bucket.file(fileName);
              const uuid = crypto.randomUUID();
              await file.save(buffer, {
                metadata: {
                  contentType: `image/${match[1]}`,
                  metadata: { firebaseStorageDownloadTokens: uuid }
                }
              });
              originalImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
            }
          }
        } catch (e) {
          console.warn("Failed to upload original selfie", e);
        }
      }
      
      if (req.body.gender === "Unknown" || req.body.gender === "Неизвестно" || req.body.faceShape === "Unknown" || req.body.faceShape === "Неизвестно" || !req.body.gender || !req.body.faceShape) { return res.status(400).json({ error: "На фото не распознано лицо. Пожалуйста, загрузите более качественное фото анфас." }); }

      const billingCheck = await checkAndDeductGeneration(userId, idempotencyKey, req.body.tgUserId, cacheKey, isDeveloper);
      if (!billingCheck.ok) {
        return res.status(400).json({ error: billingCheck.error });
      }
      
      jobMap.set(jobId, { status: "processing", createdAt: Date.now() });
      if (adminDb) {
         try {
           await adminDb.collection("jobs").doc(jobId).set({ status: "processing", createdAt: Date.now() });
         } catch (dbErr: any) {
           // console.error("[generate-full] Warning: Failed to set job status in Firestore:", dbErr.message);
         }
      }
      
      // Respond early to avoid Render timeout, job continues in background
      res.json({ isAsync: true, jobId });
      
        let jobStatus = "done";
        let jobErrorMsg = "";
        let finalImageUrlForJob = "";
        let swappedImageUrlForJob = "";
        try {




      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        throw new Error("Отсутствует FAL_KEY в переменных окружения.");
      }

      let finalImageUrl = "";
      let lastError = "";
      let swappedImageUrl = "";
      console.log("[generate-full] resolving selfie..."); 
const resolvedSelfie = await resolveImageToBase64(selfieImage);
 console.log("[generate-full] selfie resolved!");
      let selfieImageFull = resolvedSelfie || (selfieImage.startsWith('http') || selfieImage.startsWith('data:') ? selfieImage : `data:image/jpeg;base64,${selfieImage}`);
      
      // Global bounding box for selfie to prevent timeouts
      if (selfieImageFull.startsWith('data:')) {
          try {
              const sharp = (await import('sharp')).default;
              const rawB64 = selfieImageFull.split(',')[1];
              let buf = Buffer.from(rawB64, 'base64');
              // Resize to max 1024x1024 to prevent Fal upload timeouts (30s) and Gemini payload limits
              buf = await sharp(buf).resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
              selfieImageFull = `data:image/jpeg;base64,${buf.toString('base64')}`;
              console.log("[generate-full] resized selfieImageFull to bounded 1024x1024");
          } catch (e) {
              console.warn("[generate-full] Failed to bound selfie image resolution:", e.message);
          }
      }

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

      const isCustomColorRequested = false;
      const targetHairColor = hairColor;
      const finalColor = targetHairColor && targetHairColor !== "Любой" ? translateColor(targetHairColor).toLowerCase() : "";
      
      let baseImageForFlux = selfieImageFull;
      
      // PARALLEL: Start Fal uploads immediately
       let fluxBaseImageUrlPromise = baseImageForFlux.startsWith('data:') ? uploadImageToFal(baseImageForFlux) : Promise.resolve(baseImageForFlux);
      fluxBaseImageUrlPromise.catch(() => {}); // prevent unhandled rejection crash
      let normalizedSelfie = selfieImageFull;
      if (typeof normalizedSelfie === 'string' && !normalizedSelfie.startsWith('data:') && !normalizedSelfie.startsWith('http')) {
          normalizedSelfie = 'data:image/jpeg;base64,' + normalizedSelfie;
      }
      let swapImageUrlForFalPromise = getUrlForFal(normalizedSelfie);
      swapImageUrlForFalPromise.catch(() => {}); // prevent unhandled rejection crash

      
            let uiStrength = Number(vtonStrength) || 45; 
      let fluxStrength = 0.95;
      
      // Calculate fluxStrength (denoising strength)
      // Higher strength = more deviation from the base image.
      // We want high strength so the hair changes to match the prompt!
      // If we use 0.20, Flux barely changes the image.
      fluxStrength = 0.50 + (uiStrength / 100) * 0.20; // Range (0.50-0.70) to preserve clothes and pose
      if (keyword && keyword.includes("same exact current hairstyle")) {
          fluxStrength = 0.35; // keep original structure
      }
      
      // Target image is used by Gemini to guide the prompt; we still run Flux on the user's selfie.

      let promptEng = "";
      if (!finalTargetImageUrl) {
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
6. Make sure to specify that the person's face structure (eyes, nose, mouth, chin, jawline, and core head shape) MUST remain completely unchanged.
7. IMPORTANT: Do NOT alter the facial features. If the person is bald in the source image and you are adding hair, ensure the face strictly matches the source.
8. CRITICAL: Analyze the ORIGINAL USER PHOTO provided. You MUST describe the user's EXACT clothing (color and type) and the background in extreme detail in your prompt, so the image generator does not change them.
9. Start the prompt with [CRITICAL HAIRSTYLE TRANSFORMATION:].
10. ABSOLUTELY CRITICAL: The person's head pose, angle, and gaze direction MUST strictly remain exactly as the original image (e.g. EN FACE if original is EN FACE). Never describe side-profile or semi-profile.
11. ABSOLUTELY CRITICAL: DO NOT add a beard, mustache, or stubble if the original facial hair spec says "None" or "clean shaven". If the original is clean shaven, explicitly add "clean shaven, strictly no beard, no mustache" to the prompt.
12. ABSOLUTELY CRITICAL: Describe the exact requested haircut geometry accurately (e.g. if buzz cut, state extremely short cropped hair, no crest, no volume).
13. ABSOLUTELY CRITICAL: Ensure NO PHONES, NO HANDS, NO MIRRORS are in the prompt.
14. CRITICAL: The entire response MUST be entirely in ENGLISH. Return ONLY the final English prompt text. No extra text, no markdown. Max length 1500 characters. DO NOT translate to Russian under any circumstances.`;
      try {
        console.log("Generating prompt via Gemini AI...");
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) throw new Error("GEMINI_API_KEY is not set.");
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        let contentsPayload: any[] = [{ text: systemInstruction + `\n\nTarget Hairstyle to generate: ${keyword} ${description}` }];
        if (selfieImageFull.startsWith('data:')) {
            try {
                const sharp = (await import('sharp')).default;
                const rawB64 = selfieImageFull.split(',')[1];
                let buf = Buffer.from(rawB64, 'base64');
                const resized = await sharp(buf).resize(512, 512, { fit: 'inside' }).jpeg({ quality: 80 }).toBuffer();
                contentsPayload.push({ text: `[IMAGE 1: ORIGINAL USER PHOTO]\nCRITICAL INSTRUCTION: Analyze THIS original photo. In your final prompt, you MUST accurately describe the person's EXACT clothing (type, color), their body pose/head angle, and the background/environment visible in this image. This is required so the AI image generator recreates the body and background identically.` });
                contentsPayload.push({
                   inlineData: { data: resized.toString('base64'), mimeType: 'image/jpeg' }
                });
            } catch (e) {
                console.error("Failed to process selfie image for Gemini context", e);
            }
        }
        
        const promptRes = await geminiQueue.add(async () => {
           return withRetry(async () => {
               try {
                   const response = await ai.models.generateContent({
                       model: 'gemini-2.5-flash',
                       contents: contentsPayload,
                       config: {
                           temperature: 0.7,
                           maxOutputTokens: 500
                       }
                   });
                   return { text: response.text };
               } catch (e: any) {
                   throw e;
               }
           });
        });
        promptEng = promptRes?.text?.trim() || "";
      } catch (err: any) {
        console.error("\n\n[CRITICAL ERROR] GEMINI QUOTA EXCEEDED! PREVENTING BLIND FALLBACK TO SAVE MONEY AND AVOID 2-FACES.\n\n"); 
        console.error("Gemini failed to generate prompt:", err?.message || err);
        const errMsg = err?.message || String(err); 
        logToTelegram(`❌ *БЛОКИРОВКА ГЕНЕРАЦИИ:* Ошибка квот Gemini API (${errMsg}). Генерация остановлена, чтобы не допустить брака (эффекта двух лиц из-за слепого промпта).`).catch(console.error);
        
        throw new Error("Лимит запросов к AI-анализатору исчерпан. Пожалуйста, подождите немного или обратитесь к администратору (Quota Exceeded).");
      }
      
      promptEng = promptEng.substring(0, 1500).trim();

      if (fluxStrength <= 0.05) {
          console.log("Skipping Flux Image-to-Image entirely, directly using base image for FaceSwap...");
          finalImageUrl = baseImageForFlux;
      } else {
        const blueprintCacheKey = crypto.createHash("md5").update(`v7_${baseImageForFlux}_${finalColor}_${fluxStrength}_${keyword}_${description || ""}`).digest("hex");
        if (customBlueprintCache.has(blueprintCacheKey)) {
            console.log("Using cached blueprint for:", finalColor, keyword);
            finalImageUrl = customBlueprintCache.get(blueprintCacheKey);
        } else {
          try {
            console.log(`Generating target blueprint via Fal.ai Flux Image-to-Image (strength: ${fluxStrength})...`);
            
            const uploadedBaseImage = await fluxBaseImageUrlPromise;
            
            const fluxPrompt = promptEng + " The person is wearing the exact same clothes, in the exact same background and environment as the original photo. Only the hair is changed. CRITICAL: en face portrait facing camera directly, exact same head pose and facial structure, looking straight ahead, NO head tilt.";
            
            const generatedBuffer = await defaultImageService.generateBaseImage({
                prompt: fluxPrompt,
                imageUrl: uploadedBaseImage,
                strength: fluxStrength
            });
            
            if (generatedBuffer) {
                const uploadedUrl = await uploadBufferToFirebase(generatedBuffer, 'image/jpeg');
                finalImageUrl = uploadedUrl;
                customBlueprintCache.set(blueprintCacheKey, uploadedUrl);
            } else {
                throw new Error("No image generated by Flux.");
            }
          } catch (e: any) {
            throw e; 
          }
        }
      }
      } else {
          console.log("🔥 100% DIRECT FACESWAP MODE: Using target image as blueprint. Bypassing Gemini & Flux.");
          finalImageUrl = finalTargetImageUrl;
      }
      let imageBuffer: Buffer | null = null;
      // Always run FaceSwap to ensure 100% facial feature retention
      try {
            console.log("Starting Virtual Try-On FaceSwap via ImageGenerationService... finalImageUrl:", finalImageUrl);
         
         const baseImageUrlForFal = await getUrlForFal(finalImageUrl);
          const swapImageUrlForFal = await swapImageUrlForFalPromise; 
         
         // Removed check for baseImageUrlForFal or swapImageUrlForFal being data URIs
         
          const swappedImageBuffer = await defaultImageService.swapFace({
           baseImageUrl: baseImageUrlForFal,
           swapImageUrl: swapImageUrlForFal
         });
          imageBuffer = swappedImageBuffer;
         swappedImageUrl = await uploadBufferToFirebase(swappedImageBuffer, 'image/jpeg');
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

          throw new Error(friendlyError);
      }
      let tgFileId = null;
      let sentViaTelegram = false;
      let contentType = 'image/jpeg';
      if (!imageBuffer || imageBuffer.byteLength < 5000) {
          throw new Error("FAL вернул невалидный файл (слишком маленький размер или неверный формат).");
      }





      // Final success
      logToTelegram(`🎨 <b>Генерация (${req.body.userId || 'unknown'})</b>
Успешно.`).catch(console.error);
      
      // Save to cache for 30 days
      await setCachedValue(cacheKey, swappedImageUrl, 30 * 24 * 60 * 60);
      finalImageUrlForJob = finalImageUrl;
      swappedImageUrlForJob = swappedImageUrl;

      // ASYNC BACKGROUND: Do not block returning response
      // Move Telegram & Firebase saving out of the critical path to speed up job status update
      Promise.all([
        (async () => {
          if (req.body.tgUserId && imageBuffer) {
            try {
              const originalImageUrl = req.body.imageUrl;
              const resultUrl = `${process.env.VITE_FRONTEND_URL}/#/?imageUrl=${encodeURIComponent(swappedImageUrl)}&originalUrl=${encodeURIComponent(originalImageUrl || '')}`;
              await sendPhotoToTelegramUser(req.body.tgUserId, imageBuffer, "✅ Результат готов!", undefined, resultUrl);
              console.log("Telegram WebApp message with photo send complete");
            } catch (e) { console.error("Async telegram error", e); }
          }
        })(),
        // Firebase async storage is removed because uploadBufferToFirebase handles it synchronously
      ]).catch(console.error);

    } catch (err: any) {
      console.error("Full pipeline error:", err);
      logToTelegram(`❌ <b>Ошибка Генерации (${req.body.userId || 'unknown'})</b>\n<code>${err.message || 'Pipeline error'}</code>`).catch(console.error);
      
      try {
        console.error("[Pipeline Error]", err.message || err.toString());
      } catch(e) { console.error("Ignored error:", e); }
      
      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨
      await refundGeneration(req.body.userId);
       
      jobStatus = "error";
      jobErrorMsg = err.message || "Pipeline error";
      jobMap.set(jobId, { status: "error", error: jobErrorMsg, createdAt: Date.now() });
    } finally {
      clearTimeout(timeoutId);
      console.log('[generate-full] Saving job status to Firestore/jobMap, jobId:', jobId);
      if (jobStatus === "done") {
          jobMap.set(jobId, { status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl, createdAt: Date.now() });
      } else {
          jobMap.set(jobId, { status: "error", error: jobErrorMsg, createdAt: Date.now() });
      }
      
      if (adminDb) {
         try {
           if (jobStatus === "done") {
             await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl });
             
             // Update user historyCache so the slider can find the original image
             if (userId) {
               try {
                 const userRef = adminDb.collection("users").doc(userId);
                 const userDoc = await userRef.get();
                 if (userDoc.exists) {
                   const data = userDoc.data();
                   let historyCache = [];
                   if (data.historyCache) {
                     historyCache = JSON.parse(data.historyCache);
                   }
                   historyCache.unshift({
                     url: swappedImageUrlForJob,
                     originalUrl: originalImageUrl, // Saved URL
                     keyword: "Стиль",
                     timestamp: Date.now()
                   });
                   await userRef.update({ historyCache: JSON.stringify(historyCache) });
                   console.log("Updated user historyCache for", userId);
                 }
               } catch (histErr) {
                 console.error("Failed to update user historyCache:", histErr);
               }
             }
             
           } else {
             await adminDb.collection("jobs").doc(jobId).update({ status: "error", error: jobErrorMsg });
           }
         } catch (dbErr: any) {
           // console.warn("[generate-full] Failed to save job status to Firestore (async background):", dbErr.message);
         }
      }
      
      if (!res.headersSent) {
          if (jobStatus === "done") {
             res.json({ 
                status: 'completed', 
                result: { 
                  imageUrl: getProxiedUrl(swappedImageUrlForJob),
                  originalUrl: getProxiedUrl(originalImageUrl),
                  referenceImage: getProxiedUrl(finalImageUrlForJob)
                } 
             });
          } else {
             res.status(500).json({ error: jobErrorMsg });
          }
      }
    }
  } catch (outerErr: any) {
    if (!res.headersSent) {
      let finalError = outerErr.message || "Pipeline error";
      if (typeof finalError === "object") finalError = JSON.stringify(finalError);
      res.status(500).json({ error: String(finalError) });
    }
  }
};
generateRouter.post("/generate-full/start", upload.single("image"), (req,res,next)=>{console.log("AFTER MULTER", req.body); next();}, handleGenerateFull);
generateRouter.post("/generate-full", upload.single("image"), (req,res,next)=>{console.log("AFTER MULTER", req.body); next();}, handleGenerateFull); // Backward compatibility


  
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
       const cacheKey = "v3_force_update_" + getCacheKey({
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

      let consultationHtml = await callLLM(systemInstruction, `Физические особенности клиента: ${faceDescription}`);
      
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
        } catch(e) { console.error("Ignored error:", e); }
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

      const responseHtml = await callLLMChat(systemInstruction, trimmedMessages);
      
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
    
    // We deduct 1 generation for AI load more
    if (!userId) {
        return res.status(401).json({ error: "Missing userId" });
    }
    const isDeveloper = isAuthorizedDeveloper(req.header('x-telegram-init-data'));
    const billingCheck = await checkAndDeductGeneration(userId, 'load-more-' + Date.now(), req.body.tgUserId, 'load-more-' + Date.now(), isDeveloper);
    if (!billingCheck.ok) {
        return res.status(400).json({ error: billingCheck.error });
    }

    
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
        const responseText = await callLLM(systemInstruction, prompt);
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

generateRouter.get("/clear-cache", async (req, res) => {
  try {
    
    
    
    const snapshot = await adminDb!.collection("generation_cache").get();
    let count = 0;
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
      count++;
    }
    res.json({ success: true, count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

generateRouter.get('/user/last-generation', async (req, res) => {
  try {
     const userId = req.query.userId;
     if (!userId) {
         return res.status(400).json({ error: "No userId" });
     }
     if (!adminDb) {
         return res.status(500).json({ error: "DB not initialized" });
     }
     const userDoc = await adminDb.collection('users').doc(userId as string).get();
     if (!userDoc.exists) {
         return res.json({ result: null });
     }
     const data = userDoc.data();
     let history = [];
     if (data?.historyCache) {
         history = JSON.parse(data.historyCache);
     }
     const last = history[0] || null;
     res.json({ result: last });
  } catch (err: any) {
     console.error("last-generation error:", err);
     res.status(500).json({ error: err.message });
  }
});

