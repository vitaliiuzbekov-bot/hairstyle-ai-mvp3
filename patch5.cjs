const fs = require('fs');
const file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'imageClassName="w-full h-full object-cover object-center"',
  'imageClassName="w-full h-full object-contain object-center"'
);

content = content.replace(
  'imageClassName="w-full h-full object-cover object-center scale-[1.02]"',
  'imageClassName="w-full h-full object-contain object-center"'
);

fs.writeFileSync(file, content);
