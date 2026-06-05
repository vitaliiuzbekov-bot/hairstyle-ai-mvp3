const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

// The new top part is from line 0 to line 1500. Note: line index 1500 is line 1501 
const topLines = lines.slice(0, 1500);

// We need to find the rest of the original file. Since content.substring(-1) appended the entire original file, 
// the original file's marker is in the second half.
const secondHalf = lines.slice(1500).join('\n');
const marker = '      {/* User Support/Expert UI */}';
const markerIndex = secondHalf.indexOf(marker);

const bottomContent = secondHalf.substring(markerIndex);

fs.writeFileSync('src/App.tsx', topLines.join('\n') + '\n' + bottomContent);
console.log('Fixed App.tsx');
