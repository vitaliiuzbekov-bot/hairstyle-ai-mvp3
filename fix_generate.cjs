const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const uiStrengthBlock = `      let uiStrength = Number(vtonStrength) || 45; 
      let fluxStrength = 0.95;
      
      // Calculate fluxStrength (denoising strength)
      // Higher strength = more deviation from the base image.
      // We want high strength so the hair changes to match the prompt!
      // If we use 0.20, Flux barely changes the image.
      fluxStrength = 0.75 + (uiStrength / 100) * 0.20; // 0.75 to 0.95 range
      if (keyword && keyword.includes("same exact current hairstyle")) {
          fluxStrength = 0.35; // keep original structure
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
        
        let systemInstruction = \`You are an expert AI image generation prompt engineer.
Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI (e.g., Flux) to change a person's hairstyle in an image.
We have the following specs from the user (some may be in Russian):
- Gender: \${gender || "not specified"}
- Age: \${ageRange || "not specified"}
- Target Hairstyle: \${keyword}
- Base description of the style: \${description || "None"}
- Desired Hair Color: \${finalColor || 'Original hair color'}
- Original face features: Face shape: \${faceShape || "Unknown"}, Skin tone: \${skinTone || "Unknown"}, Eye color: \${eyeColor || "Unknown"}, Facial hair: \${facialHair || "None"}
- Hair qualities requested: Length: \${hairLength || "-"}, Type: \${hairType || "-"}, Density: \${hairDensity || "-"}, Hairline: \${hairlineStatus || "-"}, Quality: \${hairQuality || "-"}
- Clothing/Background instruction: \${clothingContext || "Do not change clothes/background"}

Instructions:
1. Translate the required hairstyle and qualities into English (if needed).
2. Write a prompt in English for a photorealistic portrait.
3. The prompt MUST describe the person's age/gender accurately based on the specs (e.g. "middle-aged man", "young adult woman"). Do not add unnatural smoothing if the person is old.
4. The requested hairstyle MUST be described in critical detail and clarity based on the targeted style.
5. If a hair color is specified, make it absolutely clear that it must be applied across the ENTIRE head without gradients/other shades. Use strict phrasing.
6. Make sure to specify that the person's face structure (eyes, nose, mouth, chin, jawline, and core head shape) MUST remain completely unchanged.
7. IMPORTANT: Do NOT alter the facial features. If the person is bald in the source image and you are adding hair, ensure the face strictly matches the source.
8. The clothing/background instructions should be incorporated if present.
9. Start the prompt with [CRITICAL HAIRSTYLE TRANSFORMATION:] and focus heavily on hair changing.
10. CRITICAL: The entire response MUST be entirely in ENGLISH. Return ONLY the final English prompt text. No extra text, no markdown. Max length 1500 characters. DO NOT translate to Russian under any circumstances.\`;

        let contentsPayload: any = [{ text: systemInstruction }];

        if (finalTargetImageUrl) {
            let base64Data = "";
            let mimeType = "image/jpeg";
            
            if (finalTargetImageUrl.startsWith("data:image/")) {
                mimeType = finalTargetImageUrl.split(';')[0].split(':')[1];
                base64Data = finalTargetImageUrl.split(',')[1];
            } else if (finalTargetImageUrl.startsWith("http")) {
                try {
                    console.log("[generate-full] Fetching target image URL for Gemini visual reference...");
                    const imgRes = await fetch(finalTargetImageUrl);
                    if (imgRes.ok) {
                        const arrayBuffer = await imgRes.arrayBuffer();
                        base64Data = Buffer.from(arrayBuffer).toString('base64');
                        mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
                    } else {
                        console.log(\`[generate-full] WARNING: Failed to fetch target image URL for Gemini. Status: \${imgRes.status}\`);
                    }
                } catch (e) {
                    console.error("[generate-full] Error fetching target image URL for Gemini:", e);
                }
            }

            if (base64Data) {
                // Resize reference image to save Gemini tokens and prevent OOM
                try {
                    const sharp = (await import('sharp')).default;
                    const buf = Buffer.from(base64Data, 'base64');
                    const resized = await sharp(buf).resize(512, 512, { fit: 'inside' }).jpeg({ quality: 80 }).toBuffer();
                    base64Data = resized.toString('base64');
                    mimeType = 'image/jpeg';
                } catch (e) {
                    console.error("Failed to resize reference image for Gemini", e);
                }

                contentsPayload.push({ text: \`[IMAGE 1: TARGET HAIRSTYLE REFERENCE]\\nCRITICAL INSTRUCTION: You MUST deeply analyze this image and describe the EXACT hairstyle shown in it in extreme visual detail (including hair length, parting, texture, volume, fade, and overall geometry). Use YOUR visual analysis of THIS image as the primary hairstyle description in your final prompt, ignoring any generic text name in 'Target Hairstyle' if it conflicts! Focus heavily on ensuring the exact haircut structure is transferred.\` });
                contentsPayload.push({
                   inlineData: {
                      data: base64Data,
                      mimeType: mimeType
                   }
                });
            }
        }`;

// Let's replace everything from `let uiStrength = Number(vtonStrength) || 45;`
// up to `const promptRes = await geminiQueue.add(async () => {`
const startUiStrength = code.indexOf('let uiStrength = Number(vtonStrength) || 45;');
const geminiStart = code.indexOf('const promptRes = await geminiQueue.add(async () => {');

if (startUiStrength !== -1 && geminiStart !== -1) {
    const originalBlock = code.substring(startUiStrength, geminiStart);
    code = code.replace(originalBlock, uiStrengthBlock + '\n\n        ');
    fs.writeFileSync('src/server/routes/generate.ts', code);
    console.log("Successfully rewrote generate block");
} else {
    console.log("Failed to find boundaries");
}
