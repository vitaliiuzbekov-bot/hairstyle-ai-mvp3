const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

content = content.replace(/const COLOR_BRANDS: Record<string, {name: string, shade: string}\[\]> = {[\s\S]*?};\n/m, '');
content = content.replace(/  customHairColor: string \| null;\n/g, '');
content = content.replace(/  setCustomHairColor: \(val: string \| null\) => void;\n/g, '');
content = content.replace(/  customHairColor,\n/g, '');
content = content.replace(/  setCustomHairColor,\n/g, '');
content = content.replace(/                  customHairColor,\n/g, '');
content = content.replace(/generateVirtualTryOn: \(kw: string, name: string, desc: string, customColor: string \| null, imgUrl\?: string\) => void;/g, 'generateVirtualTryOn: (kw: string, name: string, desc: string, imgUrl?: string) => void;');

fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
