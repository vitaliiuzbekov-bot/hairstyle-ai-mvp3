const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

// Remove the selfie injection into contentsPayload
code = code.replace(
`        if (!finalTargetImageUrl) {
            contentsPayload.push({ text: \`[IMAGE 1: USER'S CURRENT PHOTO]\\nThis is the person whose hairstyle you are modifying. Analyze their face and current hair strictly to ensure the prompt matches their exact physical characteristics (age, face shape, skin, facial hair). Ensure the output prompt retains their core identity exactly as seen.\` });
            contentsPayload.push({
               inlineData: {
                  data: selfieBase64,
                  mimeType: selfieMime
               }
            });
        }`,
`        // Selfie visual analysis removed from prompt generation (relying entirely on text specs + FaceSwap for identity retention)
        // This makes prompt generation 5x faster and removes redundant analysis.`
);

fs.writeFileSync('src/server/routes/generate.ts', code);
