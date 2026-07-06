import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    try {
        console.log("Generating base image...");
        const response1 = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: 'Front view portrait of a beautiful young woman with long messy hair, looking directly at camera, neutral expression, white studio background, extremely high quality, photorealistic',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        let base64ImageBytes = "";
        for (const part of response1.candidates[0].content.parts) {
            if (part.inlineData) {
                base64ImageBytes = part.inlineData.data;
            }
        }
        
        if (!base64ImageBytes) {
            console.log("Failed to generate base image");
            return;
        }
        
        fs.writeFileSync("public/new-before.jpg", Buffer.from(base64ImageBytes, 'base64'));
        console.log("Base image saved.");
        
        console.log("Editing image...");
        const response2 = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageBytes,
                            mimeType: "image/jpeg",
                        },
                    },
                    {
                        text: 'change the hairstyle to an elegant short bob haircut, keep the face and pose exactly the same',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        let editedBase64 = "";
        for (const part of response2.candidates[0].content.parts) {
            if (part.inlineData) {
                editedBase64 = part.inlineData.data;
            }
        }
        
        if (!editedBase64) {
            console.log("Failed to edit image");
            return;
        }
        
        fs.writeFileSync("public/new-after.jpg", Buffer.from(editedBase64, 'base64'));
        console.log("Edited image saved.");
    } catch (e) {
        console.error(e);
    }
}

main();
