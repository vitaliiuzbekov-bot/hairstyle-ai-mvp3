const fs = require('fs');
let file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add touchcancel
content = content.replace(
  `window.addEventListener('touchend', handleDragEnd);`,
  `window.addEventListener('touchend', handleDragEnd);
      window.addEventListener('touchcancel', handleDragEnd);`
);

content = content.replace(
  `window.removeEventListener('touchend', handleDragEnd);`,
  `window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('touchcancel', handleDragEnd);`
);

// We have multiple occurrences of removeEventListener
content = content.replace(
  /window\.removeEventListener\('touchend', handleDragEnd\);/g,
  `window.removeEventListener('touchend', handleDragEnd);\n      window.removeEventListener('touchcancel', handleDragEnd);`
);

fs.writeFileSync(file, content);
