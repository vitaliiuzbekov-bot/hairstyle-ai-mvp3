const fs = require('fs');
let content = fs.readFileSync('src/components/BeforeAfterSlider.tsx', 'utf8');

// Add a watermark hider at the bottom right
const hider = `
      {/* Watermark Hider (Retouch Stripe) */}
      <div className="absolute bottom-0 right-0 w-32 h-8 bg-black/40 backdrop-blur-md rounded-tl-xl pointer-events-none z-0"></div>
`;

content = content.replace(
    /\{\/\* Slider Line & Handle \*\/\}/,
    hider + '\n      {/* Slider Line & Handle */}'
);

fs.writeFileSync('src/components/BeforeAfterSlider.tsx', content);
console.log("Added watermark hider");
