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
  '{/* Hidden image for aspect ratio */}\n      <img src={beforeImage} alt="" className="w-full h-auto opacity-0 pointer-events-none block" />\n\n      {/* After Image (Background) */}\n      <CachedImage\n        src={afterImage}\n        alt="После"\n        className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-cover object-center"\n      />'
);

content = content.replace(
  'className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-contain object-center"\n        />\n      </div>\n      \n      {/* Watermark Hider',
  'className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-cover object-center"\n        />\n      </div>\n      \n      {/* Watermark Hider'
);

fs.writeFileSync(file, content);
