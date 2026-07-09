import { GoogleGenAI, Modality } from "@google/genai";
import fs from "fs";
import https from "https";

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Download a base image to edit
    console.log("Downloading base image...");
    const baseImgBuf = await download("https://image.pollinations.ai/prompt/portrait%20of%20a%20beautiful%20young%20woman%20with%20sleek%20straight%20short%20bob%20haircut,%20facing%20camera%20directly,%20studio%20lighting,%20neutral%20expression,%20plain%20background?nologo=true&seed=888&width=800&height=1000");
    const base64ImageBytes1 = baseImgBuf.toString('base64');
    fs.writeFileSync('base.jpg', baseImgBuf);
    
    console.log("Generating AFTER image (editing)...");
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
            text: 'Edit the image so the woman now has very messy, frizzy, unstyled long hair. Keep her face, lighting, and expression exactly the same.',
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
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
export const rightImage = "data:image/jpeg;base64,${base64ImageBytes1}"; // original sleek
export const leftImage = "data:image/jpeg;base64,${base64ImageBytes2}"; // messy
`;
    fs.writeFileSync('src/assets/slider-images.ts', out);
    console.log("Images generated and saved successfully!");
  } catch(e) {
    console.error("Error generating images:", e);
  }
}

run();
