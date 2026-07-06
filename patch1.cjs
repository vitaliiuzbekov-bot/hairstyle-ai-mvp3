const fs = require('fs');
const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

const mapCode = `export const generateRouter = Router();

const jobMap = new Map<string, { status: 'processing' | 'completed' | 'error', result?: any, error?: string }>();

generateRouter.get("/job/:jobId", (req, res) => {
  const jobId = req.params.jobId;
  if (!jobMap.has(jobId)) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(jobMap.get(jobId));
});

`;

code = code.replace("export const generateRouter = Router();\n\n", mapCode);

// now replace the generate-full start logic
const targetFullStart = `  generateRouter.post("/generate-full", async (req, res) => {
    const controller = new AbortController();
    req.on('close', () => {
      // controller.abort(); // Removed: Let the process finish in background to send to Telegram Bot
      console.log(\`[generate-full] Client disconnected, but processing will continue in background.\`);
    });

    try {
      const { 
        userId, gender, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        vtonStrength, // Number from 50 to 100
        targetImageUrl, // Optional, generated reference image URL
        hairlineStatus, hairQuality, idempotencyKey
      } = req.body;`;

const newFullStart = `  generateRouter.post("/generate-full", async (req, res) => {
    const controller = new AbortController();
    
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
      }
      
      // We do not set processing yet, we validate parameters first
`;

code = code.replace(targetFullStart, newFullStart);

fs.writeFileSync(file, code);
