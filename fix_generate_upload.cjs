const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const replacement = `
      // Upload the user's original selfie to Firebase Storage so we can show it in the slider
      let originalImageUrl = "";
      if (adminStorage && selfieImage) {
        try {
          const match = selfieImage.match(/^data:image\\/(\\w+);base64,(.+)$/);
          if (match) {
            const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
            const buffer = Buffer.from(match[2], 'base64');
            const bucket = adminStorage.bucket();
            if (bucket.name) {
              const fileName = \`originals/\${Date.now()}_\${Math.random().toString(36).substring(7)}.\${ext}\`;
              const file = bucket.file(fileName);
              const uuid = crypto.randomUUID();
              await file.save(buffer, {
                metadata: {
                  contentType: \`image/\${match[1]}\`,
                  metadata: { firebaseStorageDownloadTokens: uuid }
                }
              });
              originalImageUrl = \`https://firebasestorage.googleapis.com/v0/b/\${bucket.name}/o/\${encodeURIComponent(fileName)}?alt=media&token=\${uuid}\`;
            }
          }
        } catch (e) {
          console.warn("Failed to upload original selfie", e);
        }
      }
      
      const billingCheck = await checkAndDeductGeneration`;

code = code.replace("const billingCheck = await checkAndDeductGeneration", replacement);

const historyRegex = /historyCache\.unshift\(\{\s*url: swappedImageUrlForJob,\s*originalUrl: req\.body\.imageUrl, \/\/ from the client\s*keyword: "Стиль",\s*timestamp: Date\.now\(\)\s*\}\);/;

const historyReplacement = `historyCache.unshift({
                     url: swappedImageUrlForJob,
                     originalUrl: originalImageUrl, // Saved URL
                     keyword: "Стиль",
                     timestamp: Date.now()
                   });`;

code = code.replace(historyRegex, historyReplacement);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Updated generate.ts with selfie upload");
