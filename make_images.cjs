const fs = require('fs');
const left = fs.readFileSync('left.jpg', 'base64');
const right = fs.readFileSync('right.jpg', 'base64');
const out = `
export const leftImage = "data:image/jpeg;base64,${left}";
export const rightImage = "data:image/jpeg;base64,${right}";
`;
fs.writeFileSync('src/assets/slider-images.ts', out);
