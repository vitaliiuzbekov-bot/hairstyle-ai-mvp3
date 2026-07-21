const fs = require('fs');
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

// If finalTargetImageUrl is provided, we should just use it as finalImageUrl and skip Flux
content = content.replace(
  /      let baseImageForFlux = selfieImageFull;/g,
  `      let baseImageForFlux = finalTargetImageUrl || selfieImageFull;`
);

content = content.replace(
  /      fluxStrength = 0\.75 \+ \(uiStrength \/ 100\) \* 0\.20; \/\/ 0\.75 to 0\.95 range\n      if \(keyword && keyword\.includes\("same exact current hairstyle"\)\) \{\n          fluxStrength = 0\.35; \/\/ keep original structure\n      \}/,
  `      fluxStrength = 0.75 + (uiStrength / 100) * 0.20; // 0.75 to 0.95 range
      if (keyword && keyword.includes("same exact current hairstyle")) {
          fluxStrength = 0.35; // keep original structure
      }
      
      // If we have a target image (reference), we just want to face-swap onto it.
      // No need to run Flux unless they are doing something else.
      if (finalTargetImageUrl) {
          fluxStrength = 0; 
      }`
);

fs.writeFileSync('src/server/routes/generate.ts', content);
