const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\} else \{\s*const saved = localStorage\.getItem\('lastGeneratedImage'\);[\s\S]*?\}\s*\}/;
if (regex.test(code)) {
    code = code.replace(regex, `}`);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Replaced else block");
} else {
    console.log("Not matched");
}
