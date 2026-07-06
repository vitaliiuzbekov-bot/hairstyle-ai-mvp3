const fs = require('fs');

let lazyFile = fs.readFileSync('src/components/LazyImage.tsx', 'utf8');
lazyFile = lazyFile.replace(
  'gender: gender || results?.gender || "unknown"',
  'gender: gender || results?.gender || ""'
);
fs.writeFileSync('src/components/LazyImage.tsx', lazyFile);
