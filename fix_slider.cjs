const fs = require('fs');
let content = fs.readFileSync('src/components/BeforeAfterSlider.tsx', 'utf8');

// Revert to object-cover and a nice aspect ratio to keep it centered and looking good
content = content.replace(
    /className="relative w-full aspect-\[3\/4\] max-h-\[70vh\] mx-auto overflow-hidden rounded-xl border border-white\/10 select-none cursor-ew-resize touch-none group bg-black\/40"/,
    'className="relative w-full aspect-[3/4] max-h-[65vh] sm:max-h-[70vh] mx-auto overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize touch-none group bg-black/40 shadow-2xl"'
);

// Scale images slightly to hide edge artifacts/stripes (1.02 scale) and use object-cover
// The user wants photos to fit the card. If we use object-contain, there's no edge to crop if the container is bigger.
// Let's use object-cover so it fills the card perfectly, and scale-105 to crop edges.
content = content.replace(
    /imageClassName="w-full h-full object-contain object-center"/g,
    'imageClassName="w-full h-full object-cover object-center scale-[1.02]"'
);

fs.writeFileSync('src/components/BeforeAfterSlider.tsx', content);
console.log("Fixed BeforeAfterSlider.tsx");
