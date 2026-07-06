const fs = require('fs');
const file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '{/* Hidden image for aspect ratio */}            {/* After Image (Background) */}      <CachedImage',
  '{/* Hidden image for aspect ratio */}      <img src={afterImage} alt="" className="w-full h-auto opacity-0 pointer-events-none block select-none" />      {/* After Image (Background) */}      <CachedImage'
);

fs.writeFileSync(file, content);
