import { isAuthorizedDeveloper } from "../utils/tgAuth";
import { createRateLimiter } from "../utils/rateLimiter";
import { FEMALE_LIBRARY, MALE_LIBRARY } from "../../data/haircutLibrary";
import { Router, Request, Response } from "express";
import { getCacheKey, getCachedValue, setCachedValue } from "../services/cache";
import { getDetailedAgePromptEng, getHairstyleEnglishDescription } from "../utils/promptGenerator";
import { uploadBufferToFirebase } from "../utils/firebaseStorage";

class AsyncQueue {
  private queue: (() => Promise<void>)[] = [];
  private activeCount = 0;
  constructor(private concurrency: number) {}
  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task());
        } catch (e) {
          reject(e);
        }
      });
      this.process();
    });
  }
  private process() {
    if (this.activeCount < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.activeCount++;
        task().finally(() => {
          this.activeCount--;
          this.process();
        });
      }
    }
  }
}

const referenceQueue = new AsyncQueue(2);
const pendingGenerations = new Map<string, Promise<string>>();

const referenceLimiter = createRateLimiter(5 * 60 * 1000, 200); // 200 requests per 5 minutes

export const referenceRouter = Router();

referenceRouter.post("/reference", referenceLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, gender, hairColor, isLibrary } = req.body;
    
    // VALIDATE LIBRARY KEYWORD TO PREVENT ABUSE
    if (!keyword || keyword.length > 100) {
      res.status(400).json({ error: "Invalid keyword" }); 
      return;
    }
    if (isLibrary) {
      const library = gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
      const existsInLibrary = library.some(item => item.name === req.body.haircutName || item.name === keyword);
      const isDeveloper = isAuthorizedDeveloper(req.header('x-telegram-init-data'));
      if (!existsInLibrary && !isDeveloper) {
        console.warn(`Unauthorized library reference generation attempt for keyword: ${keyword}`);
        res.status(400).json({ error: "Invalid library keyword" });
        return;
      }
    }
    
    // If it's a library request, we ignore user-specific attributes like hairColor for the cache key
    const cacheKeyParams: any = { route: "reference", keyword, gender };
    if (!isLibrary && hairColor) {
      cacheKeyParams.hairColor = hairColor;
    }
    if (req.body.description) {
      cacheKeyParams.description = req.body.description;
    }
    if (req.body.haircutName) {
      cacheKeyParams.haircutName = req.body.haircutName;
    }
    const cacheKey = "v6_" + getCacheKey(cacheKeyParams);
    const cachedImage = await getCachedValue<string>(cacheKey);
    
    if (cachedImage) {
      console.log("Returned reference from cache (Global Library)");
      res.json({ imageUrl: cachedImage });
      return;
    }

    if (pendingGenerations.has(cacheKey)) {
      try {
        const imageUrl = await pendingGenerations.get(cacheKey);
        res.json({ imageUrl });
        return;
      } catch (e) {
      }
    }

    const generationPromise = referenceQueue.enqueue(async () => {
      const lowerGender = (gender || "person").toLowerCase();
      const isFemale = lowerGender === "female" || lowerGender.includes("жен") || lowerGender.includes("woman") || lowerGender.includes("girl") || lowerGender.includes("девушк") || lowerGender.includes("девочк");
      const isMale = !isFemale && (lowerGender.includes("муж") || lowerGender.includes("male") || lowerGender.includes("man") || lowerGender.includes("пар") || lowerGender.includes("boy"));
      
      const kwLower = (keyword || "").toLowerCase();
      const isBaldStyle = kwLower.includes("bald") || kwLower.includes("shaved head") || kwLower.includes("zero hair") || kwLower.includes("no hair") || kwLower.includes("налысо") || kwLower.includes("лысый") || kwLower.includes("лысая") || kwLower.includes("без волос");
      const isBuzzStyle = !isBaldStyle && (kwLower.includes("buzz") || kwLower.includes("ежик") || (kwLower.includes("бокс") && !kwLower.includes("полубокс")) || kwLower.includes("под машинку") || kwLower.includes("под ноль") || kwLower.includes("ultra-short"));
      const ageProps = req.body.ageRange ? `Age around ${req.body.ageRange}` : (isMale ? "30 years old" : "25 years old");
      const faceProps = req.body.skinTone ? `Skin tone: ${req.body.skinTone}, smooth clear skin, natural soft lighting. ` : "Smooth clear skin, natural soft lighting. ";
      let beardProps = "";
      if (isMale) {
          const hasBeard = (req.body.facialHair || "").toLowerCase().includes("бород") || (req.body.facialHair || "").toLowerCase().includes("усы") || (req.body.facialHair || "").toLowerCase().includes("beard");
          if (!hasBeard && !isLibrary) {
              beardProps = "Clean shaven, strictly no beard, no mustache, no stubble. ";
          } else if (hasBeard && !isLibrary) {
              beardProps = `Facial hair: ${req.body.facialHair}. `;
          }
      }
      let finalKeyword = req.body.description ? req.body.description : getHairstyleEnglishDescription(keyword);
      let colorProps = (hairColor && !isLibrary) ? `Hair color: ${hairColor.toLowerCase()}. ` : "";
      let hairDensProps = req.body.hairDensity && !isLibrary ? `Hair density: ${req.body.hairDensity}. ` : "Hair density: normal thick hair. ";
      let hairlineProps = req.body.hairlineStatus && !isLibrary ? `Hairline: ${req.body.hairlineStatus}. ` : "Hairline: standard. ";
      
      let extraBaldInjunction = "";
      let negativePrompt = "cartoon, 3d, makeup, glamour, artificial, smooth skin, plastic";
      if (isBaldStyle) {
        finalKeyword = "completely clean shaved head under zero, absolutely bald scalp, 100% hairless shorn head, zero hair, smooth shinny skull profile, человек абсолютно лысый налысо, у него голый бритый череп, полное отсутствие волос";
        colorProps = ""; 
        hairDensProps = "Hair density: completely bald (no hair). ";
        hairlineProps = "Hairline: completely bald, clean shaven head. ";
        extraBaldInjunction = "CRITICAL INSTRUCTION: THE PERSON MUST BE COMPLETELY BALD. NO HAIR AT ALL. SMOOTH SKIN SHAVED HEAD. ";
        negativePrompt = "волосы, прическа, стрижка, парик, укладка, шевелюра, кудри, локоны, челка, hair, wig, hairstyle, locks, curls, hairline, fluffy, fluffy hair, voluminous hair, long hair, bangs, dreadlocks, afro, " + negativePrompt;
      } else if (isBuzzStyle) {
        finalKeyword = "ultra-short buzz cut, head shaved under clipper 0.5mm, neat thin stubble, extremely short close taper fade, absolutely no hair volume, hair is flat against skin, ультракороткая мужская стрижка ежик под ноль машинкой";
        hairDensProps = "Hair density: very sparse stubble. ";
        hairlineProps = "Hairline: low short stubble hairline. ";
        extraBaldInjunction = "CRITICAL INSTRUCTION: STYLED COMPACT BUZZ CUT. NO PUFFY OR VOLUMINOUS HAIR ON TOP. NO LONG HAIR. ";
        negativePrompt = "длинные волосы, пышные волосы, прическа с объемом, кудри, парик, укладка, начес, челка, long hair, medium hair, fluffy hair, wig, curls, voluminous hair, puffy hair, bangs, hair locks, " + negativePrompt;
      }
      
      let prompt = `en face portrait facing camera directly, professional beauty salon photography, highly aesthetic, beautiful soft studio lighting, well-groomed healthy hair, of an attractive ${isMale ? 'man' : 'woman'}. ${ageProps}. ${faceProps}${colorProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Hairstyle strictly applied: ${finalKeyword}. Photorealistic, cinematic 8k, fashion editorial style, elegant.`;
      
      console.log("Generating reference via Gemini Imagen 3...", prompt);
      const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
      if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not set or empty in environment variables.");
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: { parts: [{ text: prompt.substring(0, 4000) }] },
          config: { imageConfig: { aspectRatio: "3:4", imageSize: "1K" } }
      });
      
      let base64Image = '';
      for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
              base64Image = part.inlineData.data;
              break;
          }
      }
      
      if (!base64Image) {
          throw new Error("No image generated by Gemini");
      }
      
      const generatedBuffer = Buffer.from(base64Image, 'base64');
      const imageUrl = await uploadBufferToFirebase(generatedBuffer, 'image/jpeg');
      await setCachedValue(cacheKey, imageUrl, 30 * 24 * 60 * 60);
      return imageUrl;
    });

    pendingGenerations.set(cacheKey, generationPromise);

    try {
      const imageUrl = await generationPromise;
      res.json({ imageUrl });
    } finally {
      pendingGenerations.delete(cacheKey);
    }

  } catch (err: any) {
    console.error("Reference Image Endpoint Error:", err);
    res.status(500).json({ error: "Ошибка при генерации референса." });
  }
});
