const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
let homeCode = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// Fix App.tsx
appCode = appCode.replace(/useEffect\(\(\) => \{\s*try \{\s*const saved = localStorage\.getItem\('lastGenerationResult'\)[\s\S]*?\}\s*\}, \[\]\);/, '');
fs.writeFileSync('src/App.tsx', appCode);

// Fix HomePage.tsx
homeCode = homeCode.replace(/useEffect\(\(\) => \{\s*const saved = localStorage\.getItem\('lastGeneratedImage'\);[\s\S]*?\}, \[setVtonResultUrl, setImageUrl\]\);/, '');
fs.writeFileSync('src/components/HomePage.tsx', homeCode);

console.log('Fixed auto-load');
