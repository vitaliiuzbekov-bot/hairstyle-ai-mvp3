import fs from 'fs';

const filePath = 'src/server/routes/generate.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the jobMap definition with a new robust updateJobStatus
content = content.replace(
  "const jobMap = new Map<string, { status: 'processing' | 'completed' | 'error', result?: any, error?: string }>();",
  `const jobMap = new Map<string, { status: 'processing' | 'completed' | 'error' | string, result?: any, error?: string }>();

async function updateJobStatus(jobId: string, statusObj: { status: string, result?: any, error?: string, [key: string]: any }) {
  jobMap.set(jobId, statusObj);
  // Optional: clear memory after 5 minutes if it's a final state
  if (['completed', 'error'].includes(statusObj.status)) {
    setTimeout(() => jobMap.delete(jobId), 5 * 60 * 1000);
  }
  
  // Persist to Firestore for robust pipeline tracking
  if (adminDb) {
    try {
      await adminDb.collection("generations").doc(jobId).set({
        ...statusObj,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Failed to save job status to Firestore:", e);
    }
  }
}`
);

// Replace polling job route to check Firestore
const oldRoute = `generateRouter.get("/job/:jobId", (req, res) => {
  const jobId = req.params.jobId;
  if (!jobMap.has(jobId)) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(jobMap.get(jobId));
});`;

const newRoute = `generateRouter.get("/job/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  if (jobMap.has(jobId)) {
    return res.json(jobMap.get(jobId));
  }
  if (adminDb) {
    try {
      const doc = await adminDb.collection("generations").doc(jobId).get();
      if (doc.exists) {
        return res.json(doc.data());
      }
    } catch (e) {}
  }
  return res.status(404).json({ error: "Job not found" });
});`;

content = content.replace(oldRoute, newRoute);

// Now replace jobMap.set occurrences in /generate-full
content = content.replace(
  /jobMap\.set\(jobId, { status: 'processing' }\);/g,
  `updateJobStatus(jobId, { status: 'processing', stage: 'started' });`
);

content = content.replace(
  /jobMap\.set\(jobId, { status: 'completed', result: { imageUrl: swappedImageUrl, referenceImage: finalImageUrl, debugError: lastError } }\);\s*setTimeout\(\(\) => jobMap\.delete\(jobId\), 5 \* 60 \* 1000\);/g,
  `updateJobStatus(jobId, { status: 'completed', result: { imageUrl: swappedImageUrl, referenceImage: finalImageUrl, debugError: lastError } });`
);

content = content.replace(
  /jobMap\.set\(jobId, { status: 'error', error: err\.message \|\| "Pipeline error" }\);\s*setTimeout\(\(\) => jobMap\.delete\(jobId\), 5 \* 60 \* 1000\);/g,
  `updateJobStatus(jobId, { status: 'error', error: err.message || "Pipeline error" });`
);

// Add some detailed stages in the try block of generate-full
// E.g. right before FAL.AI
content = content.replace(
  /console\.log\("Generating target blueprint via FAL\.AI/g,
  `updateJobStatus(jobId, { status: 'processing', stage: 'fal_flux_started' });\n            console.log("Generating target blueprint via FAL.AI`
);

content = content.replace(
  /console\.log\("Starting Virtual Try-On FaceSwap via FAL\.AI/g,
  `updateJobStatus(jobId, { status: 'processing', stage: 'fal_faceswap_started' });\n         console.log("Starting Virtual Try-On FaceSwap via FAL.AI`
);

// Improve validation logic before Telegram
content = content.replace(
  /if \(imageRes\.ok\) \{\s*imageBuffer = Buffer\.from\(await imageRes\.arrayBuffer\(\)\);\s*contentType = imageRes\.headers\.get\('content-type'\) \|\| 'image\/jpeg';\s*\}/g,
  `if (imageRes.ok) {
           imageBuffer = Buffer.from(await imageRes.arrayBuffer());
           contentType = imageRes.headers.get('content-type') || 'image/jpeg';
           if (!contentType.startsWith('image/') || imageBuffer.byteLength < 5000) {
               throw new Error("FAL вернул невалидный файл (слишком маленький размер или неверный формат).");
           }
           updateJobStatus(jobId, { status: 'processing', stage: 'fal_done' });
        }`
);

// Track Telegram success
content = content.replace(
  /if \(tgFileId\) \{\s*sentViaTelegram = true;\s*\}/g,
  `if (tgFileId) {
          sentViaTelegram = true;
          updateJobStatus(jobId, { status: 'processing', stage: 'telegram_sent' });
        } else {
          updateJobStatus(jobId, { status: 'processing', stage: 'telegram_failed' });
        }`
);

fs.writeFileSync(filePath, content);
console.log("Patched successfully!");
