const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const regex = /if \(adminDb\) \{\s*try \{\s*if \(jobStatus === "done"\) \{\s*await adminDb\.collection\("jobs"\)\.doc\(jobId\)\.update\(\{ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob \}\);/;

const replacement = `if (adminDb) {
         try {
           if (jobStatus === "done") {
             await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob });
             
             // Update user historyCache so the slider can find the original image
             if (userId) {
               try {
                 const userRef = adminDb.collection("users").doc(userId);
                 const userDoc = await userRef.get();
                 if (userDoc.exists) {
                   const data = userDoc.data();
                   let historyCache = [];
                   if (data.historyCache) {
                     historyCache = JSON.parse(data.historyCache);
                   }
                   historyCache.unshift({
                     url: swappedImageUrlForJob,
                     originalUrl: req.body.imageUrl, // from the client
                     keyword: "Стиль",
                     timestamp: Date.now()
                   });
                   await userRef.update({ historyCache: JSON.stringify(historyCache) });
                   console.log("Updated user historyCache for", userId);
                 }
               } catch (histErr) {
                 console.error("Failed to update user historyCache:", histErr);
               }
             }
             `;

code = code.replace(regex, replacement);
fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Updated generate.ts with history sync");
