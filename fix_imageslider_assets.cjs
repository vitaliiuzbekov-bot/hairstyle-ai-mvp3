const fs = require('fs');
const file = 'src/components/ImageSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the bad imports
content = content.replace(/import leftImage from "\/split-left-blended.jpg\?url";/g, 'import leftImage from "../assets/split-left-blended.jpg";');
content = content.replace(/import rightImage from "\/split-right-blended.jpg\?url";/g, 'import rightImage from "../assets/split-right-blended.jpg";');

fs.writeFileSync(file, content);
console.log('patched ImageSlider with correct asset imports');
