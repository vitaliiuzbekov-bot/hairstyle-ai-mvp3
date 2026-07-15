import fs from 'fs';
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf-8');

const regex = /const swapImageUrlForFal = selfieImageFull\.startsWith\('data:'\) \? await uploadImageToFal\(selfieImageFull\) : selfieImageFull;/g;

const replacement = `let normalizedSelfie = selfieImageFull;
         if (typeof normalizedSelfie === 'string' && !normalizedSelfie.startsWith('data:') && !normalizedSelfie.startsWith('http')) {
             normalizedSelfie = 'data:image/jpeg;base64,' + normalizedSelfie;
         }
         const swapImageUrlForFal = normalizedSelfie.startsWith('data:') ? await uploadImageToFal(normalizedSelfie) : normalizedSelfie;`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/server/routes/generate.ts', content, 'utf-8');
    console.log("Patched successfully");
} else {
    console.log("Regex not found!");
}
