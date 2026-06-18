import fs from 'fs';
const dbg = fs.readFileSync('face.jpg');
console.log(dbg.slice(0, 10));
