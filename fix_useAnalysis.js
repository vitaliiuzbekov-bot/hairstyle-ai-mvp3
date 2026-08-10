const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const target = `          let parsedResults: AnalysisResult;
          if (isProMode && localStats) {
             console.log("PRO MODE: Bypassing server analysis for speed.");
             parsedResults = { ...localStats, recommendations: [] };
             const { FEMALE_LIBRARY, MALE_LIBRARY } = await import("../data/haircutLibrary");
             const lib = parsedResults.gender === "male" ? MALE_LIBRARY : FEMALE_LIBRARY;
             parsedResults.recommendations = lib.slice(0, 4).map(h => ({ name: h.name, imageKeyword: h.name, description: h.description, stylingTips: h.stylingTips }));
          } else {
            try {
              parsedResults = await analyzeImageApi(formData, telegramInitData) as AnalysisResult;
} catch (apiErr: any) {`;

const replacement = `          let parsedResults: AnalysisResult;
          try {
            parsedResults = await analyzeImageApi(formData, telegramInitData) as AnalysisResult;
          } catch (apiErr: any) {`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  // We also need to remove the closing brace of the else block.
  // Let's find it. It's after the catch block of analyzeImageApi.
  fs.writeFileSync('src/hooks/useAnalysis.ts', code);
  console.log('Successfully replaced first part');
} else {
  console.log('Target not found in useAnalysis!');
}
