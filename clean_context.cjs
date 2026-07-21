const fs = require('fs');
let content = fs.readFileSync('src/context/AnalysisContext.tsx', 'utf8');

content = content.replace(/  customHairColor: string \| null;\n/g, '');
content = content.replace(/  setCustomHairColor: \(val: string \| null\) => void;\n/g, '');
content = content.replace(/  const \[customHairColor, setCustomHairColor\] = useState<string \| null>\(null\);\n/g, '');
content = content.replace(/        customHairColor, setCustomHairColor,\n/g, '');

fs.writeFileSync('src/context/AnalysisContext.tsx', content);
