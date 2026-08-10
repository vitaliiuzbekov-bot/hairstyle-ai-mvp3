import sys

with open("src/server/routes/generate.ts", "r") as f:
    content = f.read()

# Remove jobMap interval
import re
content = re.sub(r'const jobMap = new Map<string, any>\(\);\s*// Memory leak prevention.*?}, 30 \* 60 \* 1000\);', '', content, flags=re.DOTALL)

# Replace jobMap.has in generate-full/status
content = content.replace('if (jobMap.has(jobId)) { res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); return res.json(jobMap.get(jobId)); }', '')

# Replace jobMap.has in /job/:jobId
target = """    if (jobMap.has(jobId)) { 
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); 
      const result = jobMap.get(jobId);
      console.log("[GET /job/:jobId] Result from jobMap:", result);
      return res.json(result); 
    }"""
content = content.replace(target, '')

# Modify early return in handleGenerateFull
target2 = """      jobMap.set(jobId, { status: "processing", createdAt: Date.now() });
      if (adminDb) {
         try {
           
           await adminDb.collection("jobs").doc(jobId).set({ status: "processing", createdAt: Date.now() });
           
         } catch (dbErr) {
           console.error("[generate-full] Warning: Failed to set job status in Firestore (using in-memory map instead):", dbErr.message);
         }
      }"""
replacement2 = """      if (adminDb) {
         try {
           await adminDb.collection("jobs").doc(jobId).set({ status: "processing", createdAt: Date.now() });
         } catch (dbErr: any) {
           console.error("[generate-full] Warning: Failed to set job status in Firestore:", dbErr.message);
         }
      }
      
      // Respond early to avoid Render timeout, job continues in background
      res.json({ isAsync: true, jobId });"""
content = content.replace(target2, replacement2)

# Remove jobMap updates in finally block
content = content.replace('        jobMap.set(jobId, { status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob });', '')
content = content.replace('        jobMap.set(jobId, { status: "error", error: jobErrorMsg });', '')
content = content.replace('console.log(\'[generate-full] Saving job status to jobMap/Firestore, jobId:\', jobId);', 'console.log(\'[generate-full] Saving job status to Firestore, jobId:\', jobId);')
content = content.replace('(in-memory map updated successfully):', '(async background):')

with open("src/server/routes/generate.ts", "w") as f:
    f.write(content)
