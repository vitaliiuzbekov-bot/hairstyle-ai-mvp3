const fs = require('fs');

let content = fs.readFileSync('src/components/HomePage.tsx', 'utf-8');
content = content.replace(
  '<div className="flex justify-center mb-6 max-w-[280px] sm:max-w-[320px] mx-auto">',
  '<div className="flex justify-center mb-6 w-full max-w-[320px] mx-auto">'
);
fs.writeFileSync('src/components/HomePage.tsx', content);
