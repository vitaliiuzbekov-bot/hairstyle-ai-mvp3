const fs = require('fs');
const file = 'firebase-applet-config.json';
let config = JSON.parse(fs.readFileSync(file, 'utf8'));
config.storageBucket = 'gen-lang-client-0405788365.firebasestorage.app';
fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf8');
console.log('patched');
