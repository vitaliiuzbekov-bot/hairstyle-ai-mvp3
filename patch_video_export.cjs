const fs = require('fs');
let code = fs.readFileSync('src/utils/videoExport.ts', 'utf8');

const targetFunction = `export const resolveUrlToDataUri = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    if (url.startsWith('blob:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read blob URL"));
            reader.readAsDataURL(blob);
        });
    }
    return url;
};`;

const replacementFunction = `export const resolveUrlToDataUri = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    
    try {
        // We use proxy by default for http/https to completely bypass iOS Safari canvas CORS cache bugs
        let fetchUrl = url;
        if (url.startsWith('http')) {
             fetchUrl = \`/api/proxy-image?url=\${encodeURIComponent(url)}\`;
        }
        
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error("Fetch response was not ok");
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read URL to Data URI"));
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn("Proxy/Direct fetch failed, returning original URL...", e);
        return url; // fallback
    }
};`;

code = code.replace(targetFunction, replacementFunction);
fs.writeFileSync('src/utils/videoExport.ts', code);
console.log("Patched resolveUrlToDataUri");
