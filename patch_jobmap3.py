import sys

with open("src/server/routes/generate.ts", "r") as f:
    content = f.read()

target = """      clearTimeout(timeoutId);
      console.log('[generate-full] Saving job status to Firestore, jobId:', jobId);
      if (jobStatus === "done") {
      } else {
      }
      
      if (adminDb) {"""
replacement = """      clearTimeout(timeoutId);
      console.log('[generate-full] Saving job status to Firestore/jobMap, jobId:', jobId);
      if (jobStatus === "done") {
          jobMap.set(jobId, { status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl, createdAt: Date.now() });
      } else {
          jobMap.set(jobId, { status: "error", error: jobErrorMsg, createdAt: Date.now() });
      }
      
      if (adminDb) {"""
content = content.replace(target, replacement)

with open("src/server/routes/generate.ts", "w") as f:
    f.write(content)
