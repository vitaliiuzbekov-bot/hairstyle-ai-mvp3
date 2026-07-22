const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

// Replace the old import to include resolveUrlToDataUri
content = content.replace(
  'import { generateBeforeAfterVideo } from "../utils/videoExport";',
  'import { generateBeforeAfterVideo, resolveUrlToDataUri } from "../utils/videoExport";'
);

fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
console.log("Patched VTONPreviewSection import!");
