const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const topLines = lines.slice(0, 1500); // 0 to 1499
const bottomLines = lines.slice(3390); // 3391 to end

fs.writeFileSync('src/App.tsx', topLines.join('\n') + '\n' + bottomLines.join('\n'));
console.log('Fixed App.tsx for real');
