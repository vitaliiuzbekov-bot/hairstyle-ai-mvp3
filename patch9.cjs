const fs = require('fs');
const file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="relative w-full mx-auto aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize touch-none group bg-black/40 shadow-2xl"',
  'className="relative w-full mx-auto overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize touch-none group bg-black/40 shadow-2xl"'
);

content = content.replace(
  '{/* Hidden image for aspect ratio */}      {/* After Image (Background) */}      <CachedImage',
  '{/* Hidden image for aspect ratio */}      <img src={afterImage} alt="" className="w-full h-auto opacity-0 pointer-events-none block select-none" />      {/* After Image (Background) */}      <CachedImage'
);

content = content.replace(
  /imageClassName="w-full h-full object-cover object-center"/g,
  'imageClassName="w-full h-full object-contain object-center"'
);

fs.writeFileSync(file, content);
