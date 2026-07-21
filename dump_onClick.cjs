const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /onClick=\{\s*async\s*\(\)\s*=>\s*\{[\s\S]*?setIsExportingVideo\s*\(\s*false\s*\)\s*;\s*\}\s*\}\s*\}/;
const match = content.match(regex);
if (match) {
    console.log(match[0]);
} else {
    console.log("NOT FOUND");
}
