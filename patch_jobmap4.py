import sys
import re

with open("src/server/routes/generate.ts", "r") as f:
    content = f.read()

pattern = r'console\.log\(\'\[generate-full\] Saving job status to Firestore, jobId:\', jobId\);\s*if \(jobStatus === "done"\) \{\s*\} else \{\s*\}\s*if \(adminDb\) \{'
replacement = """console.log('[generate-full] Saving job status to Firestore/jobMap, jobId:', jobId);
      if (jobStatus === "done") {
          jobMap.set(jobId, { status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl, createdAt: Date.now() });
      } else {
          jobMap.set(jobId, { status: "error", error: jobErrorMsg, createdAt: Date.now() });
      }
      
      if (adminDb) {"""

content = re.sub(pattern, replacement, content)

with open("src/server/routes/generate.ts", "w") as f:
    f.write(content)
