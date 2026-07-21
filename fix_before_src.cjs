const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /const beforeSrc = imageUrl \|\| `data:\$\{mimeType \|\| "image\/jpeg"\};base64,\$\{imageBase64\}`;/g;

content = content.replace(regex, `const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : \`data:\${mimeType || "image/jpeg"};base64,\${imageBase64}\`);`);

// Also fix the first occurrence which is slightly different
const regex1 = /const beforeSrc = imageUrl \|\| \(imageBase64\?\.startsWith\('data:'\) \? imageBase64 : `data:\$\{mimeType \|\| "image\/jpeg"\};base64,\$\{imageBase64\}`\);/g;
content = content.replace(regex1, `const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : \`data:\${mimeType || "image/jpeg"};base64,\${imageBase64}\`);`);


fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
