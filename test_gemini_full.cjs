require('dotenv').config({ path: '.env' });
const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
    console.log("Starting Gemini Test...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY is not set.");
        return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Test 1: Text only
    try {
        console.log("Test 1: Text Generation (gemini-2.5-flash)...");
        const response1 = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Say 'Gemini is working perfectly!' and nothing else.",
        });
        console.log("✅ Response 1:", response1.text);
    } catch (e) {
        console.error("❌ Test 1 Failed:", e.message);
    }

    // Test 2: Image + Text (Vision)
    try {
        console.log("\nTest 2: Vision Analysis (gemini-2.5-flash)...");
        // 1x1 black pixel in base64
        const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        const response2 = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: "Describe this image in a few words." },
                { inlineData: { mimeType: "image/png", data: base64Data } }
            ]
        });
        console.log("✅ Response 2:", response2.text);
    } catch (e) {
        console.error("❌ Test 2 Failed:", e.message);
    }
}

testGemini();
