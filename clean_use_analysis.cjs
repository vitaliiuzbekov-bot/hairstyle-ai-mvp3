const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

content = content.replace(/  const \[customHairColor, setCustomHairColor\] = useState<string \| null>\(null\);\n/g, '');
content = content.replace(/          if \(selectedColor\) formData.append\("customHairColor", encodeURIComponent\(selectedColor\)\);\n/g, '');
content = content.replace(/        customHairColor,\n/g, '');

content = content.replace(/generateVirtualTryOn: \(kw: string, name: string, desc: string, customColor: string \| null, imgUrl\?: string\)/g, 'generateVirtualTryOn: (kw: string, name: string, desc: string, imgUrl?: string)');
content = content.replace(/            customHairColor: customColor || undefined,\n/g, '');

fs.writeFileSync('src/hooks/useAnalysis.ts', content);
