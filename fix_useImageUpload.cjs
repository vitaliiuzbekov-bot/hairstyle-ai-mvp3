const fs = require('fs');
let code = fs.readFileSync('src/hooks/useImageUpload.ts', 'utf8');

// We want to replace the initial states to just return null or empty string, instead of reading localStorage.
code = code.replace(/useState<string \| null>\(\(\) => \{[\s\S]*?return localStorage\.getItem\("persistent_imageBase64"\) \|\| null;[\s\S]*?\}\)/, 'useState<string | null>(null)');
code = code.replace(/useState<string \| null>\(\(\) => \{[\s\S]*?return localStorage\.getItem\("persistent_imageUrl"\) \|\| null;[\s\S]*?\}\)/, 'useState<string | null>(null)');
code = code.replace(/useState<string>\(\(\) => \{[\s\S]*?return localStorage\.getItem\("persistent_mimeType"\) \|\| "";[\s\S]*?\}\)/, 'useState<string>("")');
code = code.replace(/useState<string \| null>\(\(\) => \{[\s\S]*?return localStorage\.getItem\("persistent_rawImageBase64"\) \|\| null;[\s\S]*?\}\)/, 'useState<string | null>(null)');

fs.writeFileSync('src/hooks/useImageUpload.ts', code);
console.log('Fixed useImageUpload');
