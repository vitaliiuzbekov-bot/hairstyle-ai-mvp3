const fs = require('fs');
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

content = content.replace(
  '9. Start the prompt with [CRITICAL HAIRSTYLE TRANSFORMATION:] and focus heavily on hair changing.',
  '9. Start the prompt with [CRITICAL HAIRSTYLE TRANSFORMATION:]. \\n10. ABSOLUTELY CRITICAL: The person\\'s head pose, angle, and gaze direction MUST strictly remain EN FACE (front-facing) or exactly as the original image. Never allow side-profile or semi-profile.\\n11. ABSOLUTELY CRITICAL: Describe the exact requested haircut geometry accurately (e.g. if buzz cut, state extremely short cropped hair, no crest, no volume).'
);
content = content.replace(
  '10. CRITICAL: The entire response MUST be entirely in ENGLISH',
  '12. CRITICAL: The entire response MUST be entirely in ENGLISH'
);

fs.writeFileSync('src/server/routes/generate.ts', content);
