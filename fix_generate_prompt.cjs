const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

// Replace the entire contentsPayload array initialization to only include system text and NOT the selfie
const startIdx = code.indexOf('let contentsPayload: any = [{ text: systemInstruction }];');
const endIdx = code.indexOf('if (finalTargetImageUrl) {');

if (startIdx !== -1 && endIdx !== -1) {
    const originalBlock = code.substring(startIdx, endIdx);
    const newBlock = `let contentsPayload: any = [{ text: systemInstruction }];\n\n        `;
    code = code.replace(originalBlock, newBlock);
    fs.writeFileSync('src/server/routes/generate.ts', code);
    console.log("Replaced contentsPayload logic");
} else {
    console.log("Could not find bounds");
}
