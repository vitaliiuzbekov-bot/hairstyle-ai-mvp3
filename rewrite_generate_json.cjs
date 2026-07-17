const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

code = code.replace(
  /res\.json\(\{\s*status: 'completed',\s*result: \{\s*imageUrl: swappedImageUrlForJob,\s*originalUrl: originalImageUrl\s*\}\s*\}\);/,
  `res.json({ 
                status: 'completed', 
                result: { 
                  imageUrl: swappedImageUrlForJob,
                  originalUrl: originalImageUrl,
                  referenceImage: finalImageUrlForJob
                } 
             });`
);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Rewrote generate.ts json");
