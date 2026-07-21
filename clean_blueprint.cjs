const fs = require('fs');
let content = fs.readFileSync('src/components/BarberBlueprintModal.tsx', 'utf8');

content = content.replace(/  customHairColor: string \| null;\n/g, '');
content = content.replace(/  setCustomHairColor: \(val: string \| null\) => void;\n/g, '');
content = content.replace(/  customHairColor,\n/g, '');
content = content.replace(/  setCustomHairColor,\n/g, '');
content = content.replace(/              customHairColor=\{customHairColor\}\n/g, '');

fs.writeFileSync('src/components/BarberBlueprintModal.tsx', content);
