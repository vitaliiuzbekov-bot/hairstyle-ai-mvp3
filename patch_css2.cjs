const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/@layer base \{[\s\S]*?\}[\s\S]*?#root \{[\s\S]*?\}/, `@layer base {
  html, body {
    -webkit-overflow-scrolling: touch;
    width: 100%;
    min-height: 100vh;
    min-height: var(--tg-viewport-height, 100vh);
    -webkit-tap-highlight-color: transparent;
    background-color: #050508;
    overflow-x: hidden;
  }
  
  #root {
    width: 100%;
    min-height: 100vh;
    min-height: var(--tg-viewport-height, 100vh);
    overflow-x: hidden;
  }`);
  
fs.writeFileSync('src/index.css', css);
