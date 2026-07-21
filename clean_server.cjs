const fs = require('fs');
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

content = content.replace(/, customHairColor/g, '');
content = content.replace(/ customHairColor,/g, '');
content = content.replace(/        const colorDesc = customHairColor && customHairColor !== "Любой" \? " Color: " \+ customHairColor : "";\n/g, '        const colorDesc = "";\n');
content = content.replace(/      const customHairColor = req.body.customHairColor \? decodeURIComponent\(req.body.customHairColor\) : undefined;\n/g, '');
content = content.replace(/      const isCustomColorRequested = customHairColor && customHairColor !== "Любой";\n/g, '      const isCustomColorRequested = false;\n');
content = content.replace(/      const targetHairColor = isCustomColorRequested \? customHairColor : hairColor;\n/g, '      const targetHairColor = hairColor;\n');

fs.writeFileSync('src/server/routes/generate.ts', content);
