const fs = require('fs');
let code = fs.readFileSync('src/components/ImageSlider.tsx', 'utf8');

const regex = /  let localResult = null;\n  if \(\!resultImage\) \{\n    try \{\n      const lastResultStr = localStorage\.getItem\('lastResult'\);\n      if \(lastResultStr\) \{\n        localResult = JSON\.parse\(lastResultStr\);\n      \}\n    \} catch\(e\) \{\}\n  \}/;

const replacement = `  let localResult = null;
  try {
    const lastResultStr = localStorage.getItem('lastResult');
    if (lastResultStr) {
      localResult = JSON.parse(lastResultStr);
    }
  } catch(e) {}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/ImageSlider.tsx', code);
console.log("Rewrote ImageSlider.tsx again");
