const fs = require('fs');
const file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="relative w-full aspect-square mx-auto overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize touch-none group bg-black/40 shadow-2xl"',
  'className="relative w-full mx-auto overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize touch-none group bg-black/40 shadow-2xl"'
);

// We need to add the hidden image right after the <div> opens and its props end.
// Let's replace the After Image comment block.
content = content.replace(
  '{/* After Image (Background) */}\n      <CachedImage\n        src={afterImage}\n        alt="После"\n        className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-contain object-center"\n      />',
  '{/* Hidden image for aspect ratio */}\n      <img src={afterImage} alt="" className="w-full h-auto opacity-0 pointer-events-none block select-none" />\n\n      {/* After Image (Background) */}\n      <CachedImage\n        src={afterImage}\n        alt="После"\n        className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-cover object-center"\n      />'
);

content = content.replace(
  '{/* Before Image (Foreground/Clipped) */}\n      <div \n        className="absolute inset-0 pointer-events-none overflow-hidden"\n        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}\n      >\n        <CachedImage\n          src={beforeImage}\n          alt="До"\n          className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-contain object-center"\n        />\n      </div>',
  '{/* Before Image (Foreground/Clipped) */}\n      <div \n        className="absolute inset-0 pointer-events-none overflow-hidden"\n        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}\n      >\n        <CachedImage\n          src={beforeImage}\n          alt="До"\n          className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-cover object-center scale-[1.02]"\n        />\n      </div>'
);

fs.writeFileSync(file, content);
