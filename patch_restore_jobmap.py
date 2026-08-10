import sys

with open("src/server/routes/generate.ts", "r") as f:
    content = f.read()

# Add jobMap at the top
if 'const jobMap = new Map<string, any>();' not in content:
    content = content.replace('const generateRouter = Router();', 'const generateRouter = Router();\nconst jobMap = new Map<string, any>();\nsetInterval(() => {\n  const now = Date.now();\n  for (const [key, val] of jobMap.entries()) {\n    if (now - (val.createdAt || 0) > 30 * 60 * 1000) jobMap.delete(key);\n  }\n}, 5 * 60 * 1000);\n')

# Add jobMap to /job/:jobId
target_get = 'const doc = await adminDb.collection("jobs").doc(jobId).get();'
replacement_get = """if (jobMap.has(jobId)) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res.json(jobMap.get(jobId));
    }
    const doc = await adminDb.collection("jobs").doc(jobId).get();"""
if 'jobMap.has(jobId)' not in content:
    content = content.replace(target_get, replacement_get)

# Add jobMap to handleGenerateFull
target_set_processing = """      if (adminDb) {
         try {
           await adminDb.collection("jobs").doc(jobId).set({ status: "processing", createdAt: Date.now() });
         } catch (dbErr: any) {
           console.error("[generate-full] Warning: Failed to set job status in Firestore:", dbErr.message);
         }
      }"""
replacement_set_processing = """      jobMap.set(jobId, { status: "processing", createdAt: Date.now() });
      if (adminDb) {
         try {
           await adminDb.collection("jobs").doc(jobId).set({ status: "processing", createdAt: Date.now() });
         } catch (dbErr: any) {
           console.error("[generate-full] Warning: Failed to set job status in Firestore:", dbErr.message);
         }
      }"""
if 'jobMap.set(jobId, { status: "processing"' not in content:
    content = content.replace(target_set_processing, replacement_set_processing)

target_set_error = 'jobErrorMsg = err.message || "Pipeline error";'
replacement_set_error = 'jobErrorMsg = err.message || "Pipeline error";\n      jobMap.set(jobId, { status: "error", error: jobErrorMsg, createdAt: Date.now() });'
if 'jobMap.set(jobId, { status: "error"' not in content:
    content = content.replace(target_set_error, replacement_set_error)

target_set_done = 'await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl });'
replacement_set_done = 'jobMap.set(jobId, { status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl, createdAt: Date.now() });\n             await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl });'
if 'jobMap.set(jobId, { status: "done"' not in content:
    content = content.replace(target_set_done, replacement_set_done)

with open("src/server/routes/generate.ts", "w") as f:
    f.write(content)
