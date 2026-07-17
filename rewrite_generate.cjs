const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const regex = /res\.json\(\{ jobId, status: 'processing' \}\);\s*\/\/\s*RETURN IMMEDIATELY!\s*\/\/\s*RUN IN BACKGROUND\s*\(async \(\) => \{/;

code = code.replace(regex, "");

const endRegex = /          \} catch \(dbErr: any\) \{\s*console\.error\("\[generate-full\] Failed to save job status to Firestore \(in-memory map updated successfully\):", dbErr\.message\);\s*\}\s*\}\s*\}\s*\}\)\(\);\s*\} catch \(outerErr: any\) \{/m;

const endReplacement = `          } catch (dbErr: any) {
           console.error("[generate-full] Failed to save job status to Firestore (in-memory map updated successfully):", dbErr.message);
         }
      }
      
      if (!res.headersSent) {
          if (jobStatus === "done") {
             res.json({ 
                status: 'completed', 
                result: { 
                  imageUrl: swappedImageUrlForJob,
                  originalUrl: originalImageUrl 
                } 
             });
          } else {
             res.status(500).json({ error: jobErrorMsg });
          }
      }
    }
  } catch (outerErr: any) {`;

code = code.replace(endRegex, endReplacement);
fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Rewrote generate.ts");
