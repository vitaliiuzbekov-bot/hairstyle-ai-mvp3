const fs = require('fs');
let code = fs.readFileSync('src/components/ImageSlider.tsx', 'utf8');

code = code.replace(/let localResult = null;[\s\S]*?\} catch\(e\) \{\}/, 'let localResult = null;');

fs.writeFileSync('src/components/ImageSlider.tsx', code);
console.log('Fixed ImageSlider');
