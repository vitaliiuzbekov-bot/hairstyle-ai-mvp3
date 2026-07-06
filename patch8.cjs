const fs = require('fs');
const file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<img src={afterImage} alt="" className="w-full h-auto opacity-0 pointer-events-none block select-none" />',
  ''
);

content = content.replace(
  'className="relative w-full mx-auto overflow-hidden rounded-2xl',
  'className="relative w-full mx-auto aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl'
);

fs.writeFileSync(file, content);
