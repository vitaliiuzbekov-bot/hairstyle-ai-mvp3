const fs = require('fs');
const content = fs.readFileSync('src/server/routes/generate.ts', 'utf8');
const lines = content.split('\n');
let depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // naive
    for(let j=0; j<line.length; j++){
       // ignore strings and comments if possible, but naive is just chars
    }
}
