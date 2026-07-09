require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function run() {
    try {
        const ai = new GoogleGenAI({ 
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        console.log("Instantiated");
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
