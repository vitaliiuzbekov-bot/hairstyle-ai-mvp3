const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

// Find the block from `let uiStrength` down to `if (finalTargetImageUrl) {`
const startUiStrength = code.indexOf('let uiStrength = Number(vtonStrength) || 45;');
const geminiStart = code.indexOf('const promptRes = await geminiQueue.add(async () => {');

if (startUiStrength !== -1 && geminiStart !== -1) {
    const originalBlock = code.substring(startUiStrength, geminiStart);
    
    // We want to completely replace how the prompt is generated.
    // Instead of using Gemini to generate the prompt at runtime, let's just construct a strong, deterministic prompt using the parameters!
    // Gemini takes ~3-5 seconds and can be unreliable.
    // If we have keyword, description, gender, ageRange, hairColor, etc. we can just template it!
    // But wait, if they uploaded a custom image, they might just have keyword="Свой референс" and description="", so we wouldn't have a good description.
    // BUT we removed the image upload to Gemini anyway! So if it's "Свой референс", Gemini ALSO wouldn't have a description if it can't see the image!
    // Oh! If it's a custom image, Gemini WAS relying on [IMAGE 2] to describe it.
    // So if we remove [IMAGE 2], custom image hairstyles won't work well!
    console.log("Found bounds. Original block length: " + originalBlock.length);
}
