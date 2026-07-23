const fs = require('fs');
let code = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

code = code.replace(
  'await downloadVideoInTelegram(videoBlob, filename);',
  'const filename = `style_transformation_${Date.now()}.${extension}`;\n                     await downloadVideoInTelegram(videoBlob, filename);'
);

fs.writeFileSync('src/components/VTONPreviewSection.tsx', code);
console.log("Patched filename in VTONPreviewSection.tsx");
