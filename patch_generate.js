const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

code = code.replace(/const falRes = await fetch\("https:\/\/fal\.run\/fal-ai\/flux\/dev\/image-to-image"/g, 
                    `const falRes = await fetch("https://fal.run/fal-ai/flux/schnell"`);

// Let's also fix the inference steps back for schnell
code = code.replace(/image_size: "portrait_4_3",\s*seed: seedValue,\s*num_inference_steps: 28/g,
                    `image_size: "portrait_4_3",\n                seed: seedValue,\n                num_inference_steps: 4`);

fs.writeFileSync('src/server/routes/generate.ts', code);
