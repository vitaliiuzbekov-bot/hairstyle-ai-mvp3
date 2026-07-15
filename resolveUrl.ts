import fs from 'fs';
import path from 'path';

export async function resolveImageToBase64(imageUrl: string | undefined): Promise<string | undefined> {
    if (!imageUrl) return undefined;
    
    // Already base64 data URI
    if (imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    
    // Check if it's a raw base64 string
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/') && imageUrl.length > 1000) {
        return `data:image/jpeg;base64,${imageUrl}`;
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
            const localUrl = `http://0.0.0.0:3000${normalizePath}`;
            console.log(`[resolveImage] Fetching local image: ${localUrl}`);
            const imgRes = await fetch(localUrl);
            if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                const buf = Buffer.from(arrayBuffer);
                let mime = imgRes.headers.get('content-type') || 'image/jpeg';
                if (!mime.startsWith('image/')) mime = 'image/jpeg';
                return `data:${mime};base64,${buf.toString('base64')}`;
            } else {
                console.warn(`[resolveImage] WARNING: local fetch failed: ${imgRes.status}`);
            }
        } catch (e) {
            console.error(`[resolveImage] Error fetching local image:`, e);
        }
        
        // Fallback to local FS check
        const safePath = cleanPath.replace(/^\/+/, '');
        let localPath = path.join(process.cwd(), 'dist', safePath);
        if (!fs.existsSync(localPath)) localPath = path.join(process.cwd(), 'public', safePath);
        if (!fs.existsSync(localPath) && cleanPath.startsWith('/src/')) localPath = path.join(process.cwd(), safePath);
        
        if (fs.existsSync(localPath)) {
            const buf = fs.readFileSync(localPath);
            const ext = path.extname(localPath).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
            return `data:${mime};base64,${buf.toString('base64')}`;
        }
        
        console.warn(`[resolveImage] Could not resolve local image to base64: ${imageUrl}`);
        return imageUrl;
    }
    
    // It's a remote URL, we can leave it as is if FAL can reach it.
    // BUT what if it's a telegram file URL `https://api.telegram.org/file/bot...`?
    // FAL CAN access external URLs, so we don't necessarily need to download it.
    return imageUrl;
}
