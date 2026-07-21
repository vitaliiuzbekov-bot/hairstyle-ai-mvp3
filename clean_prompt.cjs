const fs = require('fs');
let content = fs.readFileSync('src/server/utils/promptGenerator.ts', 'utf8');

content = content.replace(/, customHairColor/g, '');
content = content.replace(/  if \(customHairColor && customHairColor !== "Любой"\) \{\n    colorStr = customHairColor;\n  \}\n/g, '');

fs.writeFileSync('src/server/utils/promptGenerator.ts', content);
