const fs = require('fs');
let content = fs.readFileSync('src/components/BeforeAfterSlider.tsx', 'utf8');

content = content.replace(
    /className="relative w-full aspect-\[3\/4\] max-h-\[65vh\] sm:max-h-\[70vh\] mx-auto overflow-hidden rounded-2xl border border-white\/10 select-none cursor-ew-resize touch-none group bg-black\/40 shadow-2xl"/,
    'className="relative w-full aspect-square mx-auto overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize touch-none group bg-black/40 shadow-2xl"'
);

content = content.replace(
    /imageClassName="w-full h-full object-cover object-center scale-\[1\.02\]"/g,
    'imageClassName="w-full h-full object-contain object-center"'
);

fs.writeFileSync('src/components/BeforeAfterSlider.tsx', content);
console.log("Fixed slider aspect ratio and image fitting");
