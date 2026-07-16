const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

// 1. Start uploads early
const injectionPoint = `      let baseImageForFlux = finalTargetImageUrl || selfieImageFull;`;
const injectionCode = `      let baseImageForFlux = finalTargetImageUrl || selfieImageFull;
      
      // PARALLEL: Start Fal uploads immediately
      let fluxBaseImageUrlPromise = baseImageForFlux.startsWith('data:') ? uploadImageToFal(baseImageForFlux) : Promise.resolve(baseImageForFlux);
      let normalizedSelfie = selfieImageFull;
      if (typeof normalizedSelfie === 'string' && !normalizedSelfie.startsWith('data:') && !normalizedSelfie.startsWith('http')) {
          normalizedSelfie = 'data:image/jpeg;base64,' + normalizedSelfie;
      }
      let swapImageUrlForFalPromise = normalizedSelfie.startsWith('data:') ? uploadImageToFal(normalizedSelfie) : Promise.resolve(normalizedSelfie);
`;
code = code.replace(injectionPoint, injectionCode);

// 2. Await flux base image
const fluxUploadPoint = `const fluxBaseImageUrl = baseImageForFlux.startsWith('data:') ? await uploadImageToFal(baseImageForFlux) : baseImageForFlux;`;
const fluxUploadReplacement = `const fluxBaseImageUrl = await fluxBaseImageUrlPromise;`;
code = code.replace(fluxUploadPoint, fluxUploadReplacement);

// 3. Await swap image
const swapUploadPoint = `         let normalizedSelfie = selfieImageFull;
         if (typeof normalizedSelfie === 'string' && !normalizedSelfie.startsWith('data:') && !normalizedSelfie.startsWith('http')) {
             normalizedSelfie = 'data:image/jpeg;base64,' + normalizedSelfie;
         }
         const swapImageUrlForFal = normalizedSelfie.startsWith('data:') ? await uploadImageToFal(normalizedSelfie) : normalizedSelfie;`;
const swapUploadReplacement = `         const swapImageUrlForFal = await swapImageUrlForFalPromise;`;
code = code.replace(swapUploadPoint, swapUploadReplacement);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log('Promises patched');
