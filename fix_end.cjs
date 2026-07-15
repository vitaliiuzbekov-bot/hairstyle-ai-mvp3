const fs = require('fs');
const lines = fs.readFileSync('src/server/routes/analysis.ts', 'utf8').split('\n');

let newLines = [];
let i = 0;
while (i < lines.length) {
    if (lines[i].includes('    })(); // end IIFE') || lines[i].includes('})();')) {
        // We stop including from here to the end!
        break;
    }
    newLines.push(lines[i]);
    i++;
}

// We need to close the main try/catch if we cut off the IIFE closure
if (!newLines[newLines.length - 1].includes('});')) {
    newLines.push('});');
}
fs.writeFileSync('src/server/routes/analysis.ts', newLines.join('\n'));
