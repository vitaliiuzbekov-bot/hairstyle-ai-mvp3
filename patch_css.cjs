const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/html, body \{\n    -webkit-overflow-scrolling: touch;\n    width: 100%;\n    min-height: 100vh;\n    min-height: var\(--tg-viewport-height, 100vh\);\n    max-width: 100vw;\n    -webkit-tap-highlight-color: transparent;\n    background-color: #050508;\n  \}/, `html, body {
    -webkit-overflow-scrolling: touch;
    width: 100%;
    min-height: 100vh;
    min-height: var(--tg-viewport-height, 100vh);
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
    background-color: #050508;
  }`);
  
fs.writeFileSync('src/index.css', css);
