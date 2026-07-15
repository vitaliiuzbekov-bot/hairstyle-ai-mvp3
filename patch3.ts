import fs from 'fs';

const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

const target = "const selfieImageFull = selfieImage.startsWith('http') || selfieImage.startsWith('data:') ? selfieImage : `data:image/jpeg;base64,${selfieImage}`;";
const replace = `const resolvedSelfie = await resolveImageToBase64(selfieImage);
      const selfieImageFull = resolvedSelfie || (selfieImage.startsWith('http') || selfieImage.startsWith('data:') ? selfieImage : \`data:image/jpeg;base64,\${selfieImage}\`);`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced selfieImageFull logic");
} else {
  console.log("Could not find selfieImageFull logic");
}
