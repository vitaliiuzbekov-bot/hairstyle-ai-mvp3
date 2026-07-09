const fs = require('fs');
let code = fs.readFileSync('src/server/services/falClient.ts', 'utf8');

code = code.replace(/fal-ai\/flux\/schnell/g, 'fal-ai/flux/dev');
code = code.replace(/num_inference_steps: 4,/g, 'num_inference_steps: 28, guidance_scale: 3.5,');

fs.writeFileSync('src/server/services/falClient.ts', code);
