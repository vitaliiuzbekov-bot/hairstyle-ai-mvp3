const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const finalImg = img \|\| imgFromHash;\n    if \(finalImg\) \{\n      console.log\("Setting result image to:", finalImg\);\n      setResultImage\(finalImg\);\n    \}/,
  `const finalImg = img || imgFromHash;
    if (finalImg) {
      console.log("Setting result image to:", finalImg);
      setResultImage(finalImg);
      // addToast("Открыт результат по ссылке!", "success"); // can't easily call addToast here safely inside useEffect without deps, but we can do it.
    } else {
      // addToast("Ссылка пуста: " + window.location.href, "info");
    }`
);
fs.writeFileSync('src/App.tsx', code);
