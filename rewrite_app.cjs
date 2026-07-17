const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /    const finalImg = img \|\| imgFromHash;\n    if \(finalImg\) \{\n      console\.log\("Setting result image to:", finalImg\);\n      setResultImage\(finalImg\);\n      \/\/ We will show a toast in HomePage instead\n    \}/;

const replacement = `    const finalImg = img || imgFromHash;
    if (finalImg) {
      console.log("Setting result image to:", finalImg);
      setResultImage(finalImg);
      // We will show a toast in HomePage instead
    } else {
      const lastResultStr = localStorage.getItem('lastResult');
      if (lastResultStr) {
        try {
          const lastResult = JSON.parse(lastResultStr);
          if (lastResult.imageUrl) {
            console.log("Setting result image from localStorage:", lastResult.imageUrl);
            setResultImage(lastResult.imageUrl);
          }
        } catch(e) {}
      }
    }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Rewrote App.tsx");
