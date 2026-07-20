const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\s*if \(userId && !resultImage && window\.location\.pathname === '\/' && !window\.location\.hash\.includes\('image='\)\) {[\s\S]*?},\s*\[userId\]\);/;
if (regex.test(code)) {
    code = code.replace(regex, `// Removed auto-loading last generation from backend API`);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Replaced");
} else {
    console.log("Not matched");
}
