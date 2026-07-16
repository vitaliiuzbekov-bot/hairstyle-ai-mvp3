const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

// 1. Initial set
code = code.replace(
  /if \(adminDb\) \{\s+await adminDb\.collection\("jobs"\)\.doc\(jobId\)\.set\(\{ status: "processing", createdAt: Date\.now\(\) \}\);\s+\}/,
  `jobMap.set(jobId, { status: "processing", createdAt: Date.now() });
      if (adminDb) {
         try {
           await adminDb.collection("jobs").doc(jobId).set({ status: "processing", createdAt: Date.now() });
         } catch (dbErr) {
           console.error("[generate-full] Warning: Failed to set job status in Firestore (using in-memory map instead):", dbErr.message);
         }
      }`
);

// 2. Final updates
code = code.replace(
  /if \(adminDb\) \{\s+try \{\s+if \(jobStatus === "done"\) \{\s+await adminDb\.collection\("jobs"\)\.doc\(jobId\)\.update\(\{ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob \}\);\s+\} else \{\s+await adminDb\.collection\("jobs"\)\.doc\(jobId\)\.update\(\{ status: "error", error: jobErrorMsg \}\);\s+\}\s+\} catch \(dbErr: any\) \{\s+console\.error\("\[generate-full\] Failed to save job status to Firestore:", dbErr\);\s+\}\s+\}/,
  `if (jobStatus === "done") {
        jobMap.set(jobId, { status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob });
      } else {
        jobMap.set(jobId, { status: "error", error: jobErrorMsg });
      }
      
      if (adminDb) {
         try {
           if (jobStatus === "done") {
             await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob });
           } else {
             await adminDb.collection("jobs").doc(jobId).update({ status: "error", error: jobErrorMsg });
           }
         } catch (dbErr: any) {
           console.error("[generate-full] Failed to save job status to Firestore (in-memory map updated successfully):", dbErr.message);
         }
      }`
);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log('done');
