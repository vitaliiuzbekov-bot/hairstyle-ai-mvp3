const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');
content = content.replace(/const matches = data.match\(\/\^data:\[A-Za-z-\+\\\/\]\+;base64,\(\.\+\)\$\/\);/g, "const matches = data.match(/^data:.*base64,(.+)$/);");
content = content.replace(/if \(\!matches \|\| matches.length !== 3\) \{/g, "if (!matches || matches.length < 2) {");
content = content.replace(/return Buffer\.from\(matches\[2\], 'base64'\);/g, "return Buffer.from(matches[1], 'base64');");
fs.writeFileSync('src/server/routes/telegramExport.ts', content);
