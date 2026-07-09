import { GoogleGenAI } from "@google/genai";

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: "Find a direct URL (.jpg or .png) to a high-quality before and after haircut portrait of a woman. It MUST be a single image where the left side is before and the right side is after. Return ONLY the direct URL as a string, nothing else.",
    config: {
      tools: [{googleSearch: {}}],
    },
  });
  console.log(response.text);
}
run();
