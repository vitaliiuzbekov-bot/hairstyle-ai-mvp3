import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Generating BEFORE image...");
    const response1 = await ai.models.generateImages({
        model: 'imagen-3.0-generate-001',
        prompt: 'A highly realistic, centered portrait of a beautiful young woman with messy, unstyled hair. Studio lighting, plain background, facing camera directly, neutral expression. Professional photography, 8k resolution, photorealistic.',
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '3:4',
        },
    });
    
    const base64ImageBytes1 = response1.generatedImages[0].image.imageBytes;
    
    console.log("Generating AFTER image...");
    const response2 = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageBytes1,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: 'Edit the image so the woman now has an elegant, beautifully styled, professional modern haircut. Keep her face, lighting, and expression exactly the same.',
          },
        ],
      },
      config: {
          responseModalities: ["IMAGE"],
      },
    });
    
    let base64ImageBytes2 = "";
    for (const part of response2.candidates[0].content.parts) {
      if (part.inlineData) {
        base64ImageBytes2 = part.inlineData.data;
      }
    }

    if (!base64ImageBytes2) {
       console.log("Failed to generate edited image.");
       process.exit(1);
    }
    
    const out = `
export const leftImage = "data:image/jpeg;base64,${base64ImageBytes1}";
export const rightImage = "data:image/jpeg;base64,${base64ImageBytes2}";
`;
    fs.writeFileSync('src/assets/slider-images.ts', out);
    console.log("Images generated and saved successfully!");
  } catch(e) {
    console.error("Error generating images:", e);
  }
}

run();
