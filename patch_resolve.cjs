const fs = require('fs');
const path = 'src/server/routes/generate.ts';
let code = fs.readFileSync(path, 'utf8');

const target = `    // For all other remote URLs, download them to base64 to prevent FAL "file_download_error"
    try {
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {`;
const replacement = `    // For all other remote URLs, download them to base64 to prevent FAL "file_download_error"
    try {
        console.log("[resolveImageToBase64] Attempting to download remote URL:", imageUrl);
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(path, code);
    console.log("Success patching resolveImageToBase64");
} else {
    console.log("Target not found");
}
