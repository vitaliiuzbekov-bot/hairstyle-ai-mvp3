const fs = require('fs');
const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace the full start
const regex = /generateRouter\.post\("\/generate-full", async \(req, res\) => \{[\s\S]*?\} = req\.body;/;
const newCode = `generateRouter.post("/generate-full", async (req, res) => {
    try {
      const { 
        userId, gender, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        vtonStrength, // Number from 50 to 100
        targetImageUrl, // Optional, generated reference image URL
        hairlineStatus, hairQuality, idempotencyKey
      } = req.body;
      
      const jobId = idempotencyKey || crypto.randomUUID();
      
      if (jobMap.has(jobId) && jobMap.get(jobId).status === 'processing') {
          return res.json({ jobId, status: 'processing' });
      }`;

code = code.replace(regex, newCode);

// Next we need to find `// 🚨 DEDUCT GENERATIONS ON THE BACKEND 🚨` 
// and after it, start the jobMap logic and return `{ jobId }`.
const regex2 = /(\/\/ 🚨 DEDUCT GENERATIONS ON THE BACKEND 🚨[\s\S]*?if \(!billingCheck\.ok\) \{[\s\S]*?return res\.status\(403\)\.json\(\{ error: billingCheck\.error \}\);\n\s*\})/;

const newCode2 = `$1

      // Set job processing
      jobMap.set(jobId, { status: 'processing' });
      res.json({ jobId, status: 'processing' });

      // Run background
      (async () => {
        try {`;

code = code.replace(regex2, newCode2);

// Finally, we need to find the end of `generate-full` and set status completed or error.
// We look for: `res.json({ \n        imageUrl: swappedImageUrl,`
const regex3 = /(res\.json\(\{\s*imageUrl: swappedImageUrl,\s*\/\/ Final processed image[\s\S]*?debugError: lastError\s*\}\);)/;
const newCode3 = `jobMap.set(jobId, { status: 'completed', result: { imageUrl: swappedImageUrl, referenceImage: finalImageUrl, debugError: lastError } });`;
code = code.replace(regex3, newCode3);

// Replace the catch block for generate-full
const regex4 = /(\/\/ 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨\s*await refundGeneration\(req\.body\.userId\);\s*)(res\.status\(500\)\.json\(\{ error: err\.message \|\| "Pipeline error" \}\);)/;
const newCode4 = `$1 jobMap.set(jobId, { status: 'error', error: err.message || "Pipeline error" });`;
code = code.replace(regex4, newCode4);

// Close the async IIFE
const regex5 = /jobMap\.set\(jobId, \{ status: 'error', error: err\.message \|\| "Pipeline error" \}\);\s*\}\s*\}\);/g;
const newCode5 = `jobMap.set(jobId, { status: 'error', error: err.message || "Pipeline error" });\n        }\n      })();\n  });`;
code = code.replace(regex5, newCode5);

fs.writeFileSync(file, code);
