const fs = require('fs');
let code = fs.readFileSync('src/data/haircutLibrary.ts', 'utf8');

code = code.replace(/export const FEMALE_LIBRARY: HaircutLibraryItem\[,/, 'export const FEMALE_LIBRARY: HaircutLibraryItem[] = [');

fs.writeFileSync('src/data/haircutLibrary.ts', code);
