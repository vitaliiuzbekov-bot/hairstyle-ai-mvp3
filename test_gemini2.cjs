require('dotenv').config({ path: '.env' });
const { GoogleGenAI } = require("@google/genai");

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const contentsPayload = [ { text: "Say hello." } ];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: contentsPayload } // testing this specific format!
        });
        console.log("Success!");
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
