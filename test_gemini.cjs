require('dotenv').config({ path: '.env' });
const { GoogleGenAI } = require("@google/genai");

async function test() {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        console.error("No API key");
        return;
    }
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const contentsPayload = [
        { text: "Respond with exactly one word: 'hello'." }
    ];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contentsPayload,
            config: {
                temperature: 0.7,
                maxOutputTokens: 500
            }
        });
        console.log("Success:", response.text);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
