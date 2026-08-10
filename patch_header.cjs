const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  '<button onClick={onOpenLibrary}',
  '{isProMode && <button onClick={onOpenLibrary}'
);
code = code.replace(
  '<span className="hidden sm:inline">Каталог</span>\n            </button>',
  '<span className="hidden sm:inline">Каталог</span>\n            </button>}'
);

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Header patched!");
