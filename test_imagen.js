import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: 'Split screen before-and-after portrait. Left: woman with messy long hair. Right: same woman with sleek short bob haircut. Identical face, 100% symmetrical, perfectly centered.',
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    fs.writeFileSync('imagen_test.jpg', Buffer.from(base64ImageBytes, 'base64'));
    console.log("Success with imagen-4.0");
  } catch(e) {
    console.log("Failed:", e.message);
  }
}
run();
