import fs from 'fs';
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf-8');

const regex = /\/\/ For all other remote URLs, download them to base64 to prevent FAL "file_download_error"[\s\S]*?return imageUrl;\n\}/g;

const replacement = `// For all other remote URLs, download them to base64 to prevent FAL "file_download_error"
    try {
        console.log("[resolveImageToBase64] Attempting to download remote URL:", imageUrl);
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            const buf = Buffer.from(arrayBuffer);
            let mime = imgRes.headers.get('content-type') || 'image/jpeg';
            if (!mime.startsWith('image/')) mime = 'image/jpeg';
            return \`data:\${mime};base64,\${buf.toString('base64')}\`;
        } else {
            console.error("[resolveImageToBase64] HTTP Error downloading image:", imgRes.status);
            throw new Error(\`Не удалось загрузить изображение по ссылке (HTTP \${imgRes.status})\`);
        }
    } catch (e: any) {
        console.error(\`[resolveImage] Could not download remote image to base64:\`, e.message);
        throw new Error(\`Ошибка загрузки изображения: \${e.message}\`);
    }
}`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/server/routes/generate.ts', content, 'utf-8');
    console.log("Patched successfully");
} else {
    console.log("Regex not found!");
}
