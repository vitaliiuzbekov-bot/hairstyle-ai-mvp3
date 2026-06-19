import { Router, Request, Response } from "express";
import { getCacheKey, getCachedValue, setCachedValue } from "../services/cache";
import { getDemographicDetails, getDetailedAgePromptEng } from "../utils/promptGenerator";

import { callYandexART } from "../services/yandex";

export const referenceRouter = Router();

referenceRouter.post("/reference", async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, gender, faceShape, hairColor, eyeColor, skinTone, ageRange, facialHair, hairDensity, hairlineStatus } = req.body;
    
    const cacheKey = getCacheKey({ route: "reference-v3", keyword, gender, faceShape, hairColor, eyeColor, skinTone, ageRange, facialHair, hairDensity, hairlineStatus });
    const cachedImage = await getCachedValue<string>(cacheKey);
    if (cachedImage) {
      console.log("Returned reference from cache");
      res.json({ imageUrl: cachedImage });
      return;
    }

    const lowerGender = (gender || "person").toLowerCase();
    const isMale = lowerGender.includes("муж") || lowerGender.includes("male") || lowerGender.includes("man") || lowerGender.includes("пар");
    
    const ageProps = getDetailedAgePromptEng(ageRange || "young");
    const faceProps = faceShape ? `Face shape: ${faceShape.toLowerCase()}. ` : "";
    const colorProps = hairColor ? `Hair color: ${hairColor.toLowerCase()}. ` : "";
    const eyeProps = eyeColor ? `Eye color: ${eyeColor.toLowerCase()}. ` : "";
    const skinProps = skinTone ? `Skin tone: ${skinTone.toLowerCase()}. ` : "";
    const hairDensProps = hairDensity ? `Hair density: ${hairDensity.toLowerCase()}. ` : "";
    const hairlineProps = hairlineStatus ? `Hairline: ${hairlineStatus.toLowerCase()}. ` : "";
    const beardProps = facialHair && facialHair.length > 3 ? (isMale ? `Facial hair: ${facialHair.toLowerCase()}. ` : "") : "Clean shaven face. ";

    const prompt = `Hyper-realistic, unedited, authentic amateur smartphone selfie of an ordinary ${isMale ? 'man' : 'woman'}. ${ageProps}. ${faceProps}${colorProps}${eyeProps}${skinProps}${hairDensProps}${hairlineProps}${beardProps} Hairstyle: ${keyword}. Typical indoor room lighting or natural window light, asymmetric raw facial features, natural uneven skin texture with visible pores and slight blemishes. NOT a professional model, very casual daily look, no airbrushing, no studio lighting, completely raw unretouched photo. Cannot look like a GQ or Vogue model.`;
    
    const imageUrl = await callYandexART({
      prompt,
      negativePrompt: "professional, studio lighting, airbrushed, retouched, perfect skin, cartoon, 3d, makeup, glamour",
      aspectRatio: { widthRatio: "3", heightRatio: "4" }
    });
    
    await setCachedValue(cacheKey, imageUrl, 30 * 24 * 60 * 60);

    res.json({ imageUrl });

  } catch (err: any) {
    console.error("Reference Image Endpoint Error:", err);
    res.status(500).json({ error: "Ошибка при генерации референса." });
  }
});
