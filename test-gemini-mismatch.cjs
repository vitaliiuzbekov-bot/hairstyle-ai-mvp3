require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function run() {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
        const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: {
                 parts: [
                     { text: "What is this?" },
                     { inlineData: { mimeType: "image/jpeg", data: pixel } }
                 ]
             }
        });
        console.log("Success:", response.text);
    } catch(e) {
        console.error("Error:", e.message);
    }
}
run();
