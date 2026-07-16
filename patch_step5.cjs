const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

// The original finally block:
/*
    } finally {
      clearTimeout(timeoutId);
      console.log('[generate-full] Saving job status to jobMap/Firestore, jobId:', jobId);
      if (adminDb) {
         try {
           if (jobStatus === "done") {
             await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob });
           } else {
             await adminDb.collection("jobs").doc(jobId).update({ status: "error", error: jobErrorMsg });
           }
         } catch (dbErr: any) {
           console.error("[generate-full] Failed to save job status to Firestore:", dbErr);
         }
      }
*/

const targetStart = `    } catch (err: any) {
      console.error("Full pipeline error:", err);`;

const newCode = `      // ASYNC BACKGROUND: Do not block returning response
      // Move Telegram & Firebase saving out of the critical path to speed up job status update
      Promise.all([
        (async () => {
          if (imageBuffer && req.body.tgUserId) {
            try {
              const tgFileId = await sendPhotoToTelegramUser(
                req.body.tgUserId, 
                imageBuffer, 
                \`💇 Твоя стрижка готова!\\n\\n<i>\${keyword || 'Примерка'}</i>\`,
                controller.signal
              );
              console.log("Telegram async send complete:", !!tgFileId);
            } catch (e) { console.error("Async telegram error", e); }
          }
        })(),
        (async () => {
          if (adminStorage && imageBuffer) {
             try {
                 const bucket = adminStorage.bucket();
                 if (bucket.name) {
                     const ext = contentType.includes('webp') ? '.webp' : contentType.includes('png') ? '.png' : '.jpg';
                     const fileName = \`generations/\${Date.now()}_\${Math.random().toString(36).substring(7)}\${ext}\`;
                     const file = bucket.file(fileName);
                     const uuid = crypto.randomUUID();
                     await file.save(imageBuffer, {
                         metadata: { 
                           contentType: contentType,
                           metadata: { firebaseStorageDownloadTokens: uuid }
                         }
                     });
                     console.log("Firebase async storage complete");
                 }
             } catch (storageErr: any) {
                 console.warn("Async firebase storage error", storageErr?.message);
             }
          }
        })()
      ]).catch(console.error);

    } catch (err: any) {
      console.error("Full pipeline error:", err);`;

// Delete old synchronous firebase/telegram logic
const blockToReplace1 = `      // Try sending to Telegram
      if (imageBuffer && req.body.tgUserId) {
        tgFileId = await sendPhotoToTelegramUser(
          req.body.tgUserId, 
          imageBuffer, 
          \`💇 Твоя стрижка готова!\\n\\n<i>\${keyword || 'Примерка'}</i>\`,
          controller.signal
        );
        if (tgFileId) {
          sentViaTelegram = true;
            } else {
            }
      }`;

const blockToReplace2 = `      // Upload to Firebase Storage for a reliable CDN URL
      if (adminStorage && imageBuffer) {
         try {
             const bucket = adminStorage.bucket();
             if (bucket.name) {
                 const ext = contentType.includes('webp') ? '.webp' : contentType.includes('png') ? '.png' : '.jpg';
                 const fileName = \`generations/\${Date.now()}_\${Math.random().toString(36).substring(7)}\${ext}\`;
                 const file = bucket.file(fileName);
                 const uuid = crypto.randomUUID();
                 await file.save(imageBuffer, {
                     metadata: { 
                       contentType: contentType,
                       metadata: {
                         firebaseStorageDownloadTokens: uuid
                       }
                     }
                 });
                 swappedImageUrl = \`https://firebasestorage.googleapis.com/v0/b/\${bucket.name}/o/\${encodeURIComponent(fileName)}?alt=media&token=\${uuid}\`;
                        }
         } catch (storageErr: any) {
             const errMsg = storageErr?.error?.message || storageErr?.message || "Unknown storage error";
             console.warn("Firebase Storage upload failed, using fallback URL. Reason:", errMsg);
             // swappedImageUrl remains the fal.ai URL, which is valid for 24 hours.
         }
      }`;

code = code.replace(blockToReplace1, '');
code = code.replace(blockToReplace2, '');
code = code.replace(targetStart, newCode);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log('Step 5 patched');
