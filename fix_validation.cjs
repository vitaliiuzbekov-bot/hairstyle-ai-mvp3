const fs = require('fs');
let code = fs.readFileSync('src/server/routes/reference.ts', 'utf8');

code = code.replace(
  /const existsInLibrary = library\.some\(item => item\.imageKeyword === keyword\);/,
  'const existsInLibrary = library.some(item => item.name === req.body.haircutName || item.name === keyword);'
);

fs.writeFileSync('src/server/routes/reference.ts', code);
