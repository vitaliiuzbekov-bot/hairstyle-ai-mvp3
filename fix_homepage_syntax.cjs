const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// Undo the duplication
code = code.replace(/{!imageBase64 && history && history.length > 0 && \(\n        {!imageBase64 && isProMode && \(/g, '{!imageBase64 && history && history.length > 0 && (');

// Restore PresetsCarousel to what it should be: hidden from regular users, meaning shown for PRO users?
// Actually wait! The user said: "hide professional-only elements (technical details, complex presets, PDF exports) from regular users."
// If PresetsCarousel is the "complex presets", we should show it ONLY when isProMode is true!
code = code.replace(
  /{!imageBase64 && isProMode && \(\n          <div className="fade-in">\n            <PresetsCarousel/g,
  '{!imageBase64 && isProMode && (\n          <div className="fade-in">\n            <PresetsCarousel'
);

fs.writeFileSync('src/components/HomePage.tsx', code);
console.log("Fixed!");
