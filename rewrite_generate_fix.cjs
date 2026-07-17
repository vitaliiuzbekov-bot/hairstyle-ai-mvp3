const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

code = code.replace(
  /         \} catch \(dbErr: any\) \{\n           console\.error\("\[generate-full\] Failed to save job status to Firestore \(in-memory map updated successfully\):", dbErr\.message\);\n         \}\n      \}\n    \}\n  \}\)\(\);\n  \} catch \(outerErr: any\) \{/m,
  `         } catch (dbErr: any) {
           console.error("[generate-full] Failed to save job status to Firestore (in-memory map updated successfully):", dbErr.message);
         }
      }
      
      if (!res.headersSent) {
          if (jobStatus === "done") {
             res.json({ 
                status: 'completed', 
                result: { 
                  imageUrl: swappedImageUrlForJob,
                  originalUrl: originalImageUrl,
                  referenceImage: finalImageUrlForJob
                } 
             });
          } else {
             res.status(500).json({ error: jobErrorMsg });
          }
      }
    }
  } catch (outerErr: any) {`
);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Rewrote generate.ts fix");
