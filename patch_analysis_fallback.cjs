const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const targetStr = `          parsedResults = await analyzeImageApi(formData, telegramInitData) as AnalysisResult;

          // Only inject initial library styles if this is a fresh analysis.
          // Otherwise, we keep the previously generated or assigned styles.
          if (!localStats) {
            try {`;
            
const replacementStr = `          try {
            parsedResults = await analyzeImageApi(formData, telegramInitData) as AnalysisResult;
          } catch (apiErr: any) {
            console.warn("Server AI Analysis failed, using local stats fallback!", apiErr);
            if (localStats) {
               // Use local stats as fallback
               parsedResults = {
                 ...localStats,
                 color: "Brunette", // Generic fallback
                 recommendations: []
               };
            } else {
               throw apiErr; // No local stats, must throw
            }
          }

          // Inject initial library styles if we used localStats (or if it's a fresh analysis)
          if (parsedResults && (!parsedResults.recommendations || parsedResults.recommendations.length === 0)) {
            try {`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/hooks/useAnalysis.ts', code);
console.log("Patched analysis fallback");
