const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const replacement = `
// Re-added for backward compatibility with old cached clients
generateRouter.get('/job/:jobId', async (req, res) => {
  res.setHeader('Expires', '0');
  try {
    const { jobId } = req.params;
    console.log("[GET /job/:jobId] Polling for jobId:", jobId);
    if (!jobId || typeof jobId !== 'string') return res.status(400).json({ error: "Missing jobId" });

    if (jobMap.has(jobId)) { 
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); 
      const result = jobMap.get(jobId);
      console.log("[GET /job/:jobId] Result from jobMap:", result);
      return res.json(result); 
    }
    
    if (!adminDb) return res.status(500).json({ error: "DB not initialized" });
    
    const doc = await adminDb.collection("jobs").doc(jobId).get();
    if (!doc.exists) {
      console.log("[GET /job/:jobId] Job not found in Firestore:", jobId);
      return res.status(404).json({ error: "Job not found" });
    }
    
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); 
    const result = doc.data();
    console.log("[GET /job/:jobId] Result from Firestore:", result);
    res.json(result);
  } catch (err) {
    console.error("[GET /job/:jobId] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const handleGenerateFull = async (req, res) => {`;

code = code.replace("const handleGenerateFull = async (req, res) => {", replacement);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Added GET /job/:jobId");
