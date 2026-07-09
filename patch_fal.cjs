const fs = require('fs');
let code = fs.readFileSync('src/server/services/falClient.ts', 'utf8');

code = code.replace(/'fal-ai\/flux\/dev'/, "'fal-ai/flux/schnell'");
code = code.replace(/num_inference_steps: 28, guidance_scale: 3\.5,/, 'num_inference_steps: 4,');

fs.writeFileSync('src/server/services/falClient.ts', code);
