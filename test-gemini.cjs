require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function run() {
    try {
        const ai = new GoogleGenAI({ 
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const res = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: "Test"
        });
        console.log("Success");
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
