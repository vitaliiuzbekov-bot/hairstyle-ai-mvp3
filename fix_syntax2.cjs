const fs = require('fs');
let code = fs.readFileSync('src/data/haircutLibrary.ts', 'utf8');

code = code.replace(/\] = \[/, ',');

fs.writeFileSync('src/data/haircutLibrary.ts', code);
