const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /const a = document\.createElement\('a'\);[\s\S]*?document\.body\.removeChild\(a\);/;

const replacement = `if (tg && tg.openLink) {
                             tg.openLink(videoUrl);
                         } else {
                             const a = document.createElement('a');
                             a.href = videoUrl;
                             a.target = '_blank';
                             a.download = \`style_transformation_\${Date.now()}.mp4\`;
                             document.body.appendChild(a);
                             a.click();
                             document.body.removeChild(a);
                         }`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
    console.log("Patched VTONPreviewSection.tsx openLink logic!");
} else {
    console.log("Regex not matched!");
}
