import fs from "fs";
import path from "path";

export function getProxiedUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http')) {
        return `/api/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
}

export async function resolveImageToBase64(imageUrl: string | undefined): Promise<string | undefined> {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    if (imageUrl.includes('fal.media') || imageUrl.includes('fal.run')) {
        return imageUrl;
    }
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
        } catch(e) { console.error("Ignored error:", e); }
    } else if (imageUrl.startsWith('/')) {
        isLocalUrl = true;
    }
    
    if (isLocalUrl) {
        const normalizePath = parsedPath.startsWith('/') ? parsedPath : '/' + parsedPath;
        const cleanPath = normalizePath.split('?')[0];
        try {
            const localUrl = `http://0.0.0.0:3000${normalizePath}`;
            const imgRes = await fetch(localUrl);
            if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                const buf = Buffer.from(arrayBuffer);
                let mime = imgRes.headers.get('content-type') || 'image/jpeg';
                if (!mime.startsWith('image/')) mime = 'image/jpeg';
                return `data:${mime};base64,${buf.toString('base64')}`;
            }
        } catch (e) {}
        
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
        return imageUrl;
    }
    
    try {
        console.log("[resolveImageToBase64] Attempting to download remote URL:", imageUrl);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(new Error("Timeout downloading image")), 15000);
        const imgRes = await fetch(imageUrl, {
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        clearTimeout(timeout);
        if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            let buf = Buffer.from(arrayBuffer);
            let mime = imgRes.headers.get('content-type') || 'image/jpeg';
            if (!mime.startsWith('image/')) mime = 'image/jpeg';
            try {
                const sharp = (await import('sharp')).default;
                buf = await sharp(buf).resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
                mime = 'image/jpeg';
            } catch (e: any) {
                console.warn("[resolveImageToBase64] Failed to resize, using original:", e.message);
            }
            return `data:${mime};base64,${buf.toString('base64')}`;
        } else {
            console.error("[resolveImageToBase64] HTTP Error downloading image:", imgRes.status);
            throw new Error(`Не удалось загрузить изображение по ссылке (HTTP ${imgRes.status})`);
        }
    } catch (e: any) {
        console.error(`[resolveImage] Could not download remote image to base64:`, e.message);
        throw new Error(`Ошибка загрузки изображения: ${e.message}`);
    }
}
