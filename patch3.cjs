const fs = require('fs');
const content = fs.readFileSync('src/components/UploadZone.tsx', 'utf8');
const newContent = content.replace(
  /import \{ (.*?) \} from "lucide-react";/,
  (match, p1) => {
    if (p1.includes('Info')) return match;
    return `import { ${p1}, Info } from "lucide-react";`;
  }
);
fs.writeFileSync('src/components/UploadZone.tsx', newContent);
