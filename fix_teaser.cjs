const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

code = code.replace(
    /keyword: rec\.imageKeyword,/,
    `keyword: rec.imageKeyword,\n                    isLibrary: true,\n                    haircutName: rec.name,`
);

fs.writeFileSync('src/hooks/useAnalysis.ts', code);
