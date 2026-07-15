import fs from 'fs';

let code = fs.readFileSync('storage.rules', 'utf8');
const target = `    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }`;
const replacement = `    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 15 * 1024 * 1024 && request.resource.contentType.matches('image/.*');
    }`;
code = code.replace(target, replacement);
fs.writeFileSync('storage.rules', code);
console.log('Successfully patched storage.rules');
