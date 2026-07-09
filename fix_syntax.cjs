const fs = require('fs');
let code = fs.readFileSync('src/data/haircutLibrary.ts', 'utf8');

code = code.replace(/export const MALE_LIBRARY: HaircutLibraryItem\[\s*\{"name"/, 'export const MALE_LIBRARY: HaircutLibraryItem[] = [\n  {"name"');
fs.writeFileSync('src/data/haircutLibrary.ts', code);
