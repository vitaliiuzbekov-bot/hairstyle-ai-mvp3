import fs from 'fs';
let content = fs.readFileSync('src/server/services/falClient.ts', 'utf-8');
content = content.replace(
  'export async function uploadImageToFal(base64DataUri: string): Promise<string> {',
  `export async function uploadImageToFal(base64DataUri: string): Promise<string> {
  let finalUri = base64DataUri;
  if (typeof finalUri === 'string' && !finalUri.startsWith('data:') && !finalUri.startsWith('http')) {
      finalUri = 'data:image/jpeg;base64,' + finalUri;
  }`
);
content = content.replace(
  'const response = await fetch(base64DataUri);',
  'const response = await fetch(finalUri);'
);
content = content.replace(
  'return base64DataUri; // Cannot upload, fallback to base64',
  'return finalUri; // Cannot upload, fallback to base64'
);
fs.writeFileSync('src/server/services/falClient.ts', content, 'utf-8');
console.log("Patched falClient.ts");
