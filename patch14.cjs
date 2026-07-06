const fs = require('fs');
const file = '/app/applet/src/components/BarberBlueprintModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"',
  'className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"'
);

fs.writeFileSync(file, content);
