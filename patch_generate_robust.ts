import fs from 'fs';

const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

const newResolver = `
async function resolveImageToBase64(imageUrl: string | undefined): Promise<string | undefined> {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    // If it's already a fal.media URL, FAL can definitely access it
    if (imageUrl.includes('fal.media') || imageUrl.includes('fal.run')) {
        return imageUrl;
    }

    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/') && imageUrl.length > 1000) {
        return \`data:image/jpeg;base64,\${imageUrl}\`;
    }
    
    let isLocalUrl = false;
    let parsedPath = imageUrl;
    if (imageUrl.startsWith('http')) {
        try {
            const urlObj = new URL(imageUrl);
            if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1') || urlObj.hostname.includes('0.0.0.0')) {
                parsedPath = urlObj.pathname + urlObj.search;
                isLocalUrl = true; 
            }
        } catch(e) {}
    } else if (imageUrl.startsWith('/')) {
        isLocalUrl = true;
    }
    
    if (isLocalUrl) {
        const normalizePath = parsedPath.startsWith('/') ? parsedPath : '/' + parsedPath;
        const cleanPath = normalizePath.split('?')[0];
        try {
            const localUrl = \`http://0.0.0.0:3000\${normalizePath}\`;
            const imgRes = await fetch(localUrl);
            if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                const buf = Buffer.from(arrayBuffer);
                let mime = imgRes.headers.get('content-type') || 'image/jpeg';
                if (!mime.startsWith('image/')) mime = 'image/jpeg';
                return \`data:\${mime};base64,\${buf.toString('base64')}\`;
            }
        } catch (e) {}
        
        const path = await import('path');
        const safePath = cleanPath.replace(/^\\/+/, '');
        let localPath = path.join(process.cwd(), 'dist', safePath);
        if (!fs.existsSync(localPath)) localPath = path.join(process.cwd(), 'public', safePath);
        if (!fs.existsSync(localPath) && cleanPath.startsWith('/src/')) localPath = path.join(process.cwd(), safePath);
        
        if (fs.existsSync(localPath)) {
            const buf = fs.readFileSync(localPath);
            const ext = path.extname(localPath).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
            return \`data:\${mime};base64,\${buf.toString('base64')}\`;
        }
        return imageUrl;
    }
    
    // For all other remote URLs, download them to base64 to prevent FAL "file_download_error"
    try {
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            const buf = Buffer.from(arrayBuffer);
            let mime = imgRes.headers.get('content-type') || 'image/jpeg';
            if (!mime.startsWith('image/')) mime = 'image/jpeg';
            return \`data:\${mime};base64,\${buf.toString('base64')}\`;
        }
    } catch (e) {
        console.warn(\`[resolveImage] Could not download remote image \${imageUrl} to base64:\`, e.message);
    }

    return imageUrl;
}
`;

// Replace the old resolver
const oldResolverStart = 'async function resolveImageToBase64(imageUrl: string | undefined): Promise<string | undefined> {';
const oldResolverEnd = 'export const generateRouter = Router();';
const startIdx = code.indexOf(oldResolverStart);
const endIdx = code.indexOf(oldResolverEnd);

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newResolver + '\n' + code.substring(endIdx);
    fs.writeFileSync(file, code);
    console.log("Successfully updated resolveImageToBase64");
} else {
    console.log("Could not find old resolver to replace");
}
