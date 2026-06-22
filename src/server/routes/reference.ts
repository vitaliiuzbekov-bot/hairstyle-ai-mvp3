import { Router, Request, Response } from "express";
import { getCacheKey, getCachedValue, setCachedValue } from "../services/cache";
import { getDemographicDetails, getDetailedAgePromptEng } from "../utils/promptGenerator";

import { callYandexART } from "../services/yandex";

export const referenceRouter = Router();

referenceRouter.post("/reference", async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, gender, faceShape, hairColor, eyeColor, skinTone, ageRange, facialHair, hairDensity, hairlineStatus, hairLength } = req.body;
    
    const cacheKey = getCacheKey({ route: "reference-v25-bald-fixed", keyword, gender, faceShape, hairColor, eyeColor, skinTone, ageRange, facialHair, hairDensity, hairlineStatus, hairLength });
    const cachedImage = await getCachedValue<string>(cacheKey);
    if (cachedImage) {
      console.log("Returned reference from cache");
      res.json({ imageUrl: cachedImage });
      return;
    }

    const lowerGender = (gender || "person").toLowerCase();
    const isMale = lowerGender.includes("муж") || lowerGender.includes("male") || lowerGender.includes("man") || lowerGender.includes("пар");
    
    // Determine if the requested style keyword itself represents a bald or buzzed look
    const kwLower = (keyword || "").toLowerCase();
    const isBaldStyle = kwLower.includes("bald") || 
                        kwLower.includes("shave") || 
                        kwLower.includes("shorn") || 
                        kwLower.includes("shaven") || 
                        kwLower.includes("zero hair") || 
                        kwLower.includes("no hair") || 
                        kwLower.includes("лыс") || 
                        kwLower.includes("налысо") || 
                        kwLower.includes("брит") || 
                        kwLower.includes("бритая") ||
                        kwLower.includes("без волос");

    const isBuzzStyle = !isBaldStyle && (
                        kwLower.includes("buzz") || 
                        kwLower.includes("ежик") || 
                        kwLower.includes("бокс") || 
                        kwLower.includes("под машинку") || 
                        kwLower.includes("под ноль") ||
                        kwLower.includes("ultra-short")
                      );

    const ageProps = getDetailedAgePromptEng(ageRange || "young");
    const faceProps = faceShape ? `Face shape: ${faceShape.toLowerCase()}. ` : "";
    const eyeProps = eyeColor ? `Eye color: ${eyeColor.toLowerCase()}. ` : "";
    const skinProps = skinTone ? `Skin tone: ${skinTone.toLowerCase()}. ` : "";
    const beardProps = facialHair && facialHair.length > 3 ? (isMale ? `Facial hair: ${facialHair.toLowerCase()}. ` : "") : "Clean shaven face. ";

    let finalKeyword = keyword;
    let colorProps = hairColor ? `Hair color: ${hairColor.toLowerCase()}. ` : "";
    let hairDensProps = hairDensity ? `Hair density: ${hairDensity.toLowerCase()}. ` : "";
    let hairlineProps = hairlineStatus ? `Hairline: ${hairlineStatus.toLowerCase()}. ` : "";
    let extraBaldInjunction = "";
    let negativePrompt = "professional, studio lighting, airbrushed, retouched, perfect skin, cartoon, 3d, makeup, glamour";

    if (isBaldStyle) {
      finalKeyword = "completely clean shaved head under zero, absolutely bald scalp, 100% hairless shorn head, zero hair, smooth shinny skull profile, человек абсолютно лысый налысо, у него голый бритый череп, полное отсутствие волос";
      colorProps = ""; // No hair color
      hairDensProps = "Hair density: completely bald (no hair, редкие волосы отсутствуют). ";
      hairlineProps = "Hairline: completely bald, clean shaven head. ";
      extraBaldInjunction = "CRITICAL INSTRUCTION: THE PERSON MUST BE COMPLETELY BALD. NO HAIR AT ALL. SMOOTH SKIN SHAVED HEAD. ЧЕЛОВЕК НА ФОТО ПОЛНОСТЬЮ ЛЫСЫЙ, СТРОГИЙ ЗАПРЕТ НА КУДРИ, ПРИЧЕСКУ И ВОЛОСЫ. ";
      negativePrompt = "волосы, прическа, стрижка, парик, укладка, шевелюра, кудри, локоны, челка, растительность на голове, hair, wig, hairstyle, locks, curls, hairline, fluffy, fluffy hair, voluminous hair, long hair, bangs, dreadlocks, afro, " + negativePrompt;
    } else if (isBuzzStyle) {
      finalKeyword = "ultra-short buzz cut, head shaved under clipper 0.5mm, neat thin stubble, extremely short close taper fade, absolutely no hair volume, hair is flat against skin, ультракороткая мужская стрижка ежик под ноль машинкой";
      hairDensProps = "Hair density: very sparse stubble. ";
      hairlineProps = "Hairline: low short stubble hairline. ";
      extraBaldInjunction = "CRITICAL INSTRUCTION: STYLED COMPACT BUZZ CUT. NO PUFFY OR VOLUMINOUS HAIR ON TOP. NO LONG HAIR. СТРИЖКА СВЕРХКОРОТКАЯ, НЕТ НИКАКОГО ОБЪЕМА НА ГОЛОВЕ. ";
      negativePrompt = "длинные волосы, пышные волосы, прическа с объемом, кудри, парик, укладка, начес, челка, long hair, medium hair, fluffy hair, wig, curls, voluminous hair, puffy hair, bangs, hair locks, " + negativePrompt;
    }

    const prompt = `Hyper-realistic, unedited, authentic amateur smartphone selfie of an ordinary ${isMale ? 'man' : 'woman'}. ${ageProps}. ${faceProps}${colorProps}${eyeProps}${skinProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Hairstyle: ${finalKeyword}. Typical indoor room lighting or natural window light, asymmetric raw facial features, natural uneven skin texture with visible pores and slight blemishes. NOT a professional model, very casual daily look, no airbrushing, no studio lighting, completely raw unretouched photo. Cannot look like a GQ or Vogue model.`;
    
    const imageUrl = await callYandexART({
      prompt,
      negativePrompt,
      aspectRatio: { widthRatio: "3", heightRatio: "4" }
    });
    
    await setCachedValue(cacheKey, imageUrl, 30 * 24 * 60 * 60);
    res.json({ imageUrl });

  } catch (err: any) {
    console.error("Reference Image Endpoint Error:", err);
    res.status(500).json({ error: "Ошибка при генерации референса." });
  }
});
