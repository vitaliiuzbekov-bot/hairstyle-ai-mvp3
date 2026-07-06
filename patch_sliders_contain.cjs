const fs = require('fs');
let file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/object-cover/g, 'object-contain');
fs.writeFileSync(file, content);

file = '/app/applet/src/components/BarberBlueprintModal.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/object-cover/g, 'object-contain');
fs.writeFileSync(file, content);

file = '/app/applet/src/components/ColorChangeOnlyCard.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/object-cover/g, 'object-contain');
fs.writeFileSync(file, content);
