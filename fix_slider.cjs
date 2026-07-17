const fs = require('fs');
let code = fs.readFileSync('src/components/ImageSlider.tsx', 'utf8');

code = code.replace(`import { leftImage, rightImage } from "../assets/slider-images";`, `import { leftImage as defaultLeft, rightImage as defaultRight } from "../assets/slider-images";`);

code = code.replace(`export const ImageSlider = ({ isLightMode }: { isLightMode?: boolean }) => {`, `export const ImageSlider = ({ isLightMode, resultImage, history }: { isLightMode?: boolean, resultImage?: string | null, history?: any[] }) => {`);

fs.writeFileSync('src/components/ImageSlider.tsx', code);
console.log("Updated ImageSlider.tsx");
