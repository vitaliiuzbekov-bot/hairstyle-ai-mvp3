const fs = require('fs');
let content = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

content = content.replace(/          customHairColor=\{customHairColor\}\n/g, '');
content = content.replace(/          setCustomHairColor=\{setCustomHairColor\}\n/g, '');

fs.writeFileSync('src/components/HomePage.tsx', content);
