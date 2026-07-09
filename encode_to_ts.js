import fs from "fs";
const b64_1 = fs.readFileSync('left.jpg').toString('base64');
const b64_2 = fs.readFileSync('right.jpg').toString('base64');
const content = `
export const leftImage = "data:image/jpeg;base64,${b64_1}";
export const rightImage = "data:image/jpeg;base64,${b64_2}";
`;
fs.writeFileSync('src/assets/slider-images.ts', content);
console.log("Encoded successfully.");
