export const resolveUrlToDataUri = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    
    try {
        // We use proxy by default for http/https to completely bypass iOS Safari canvas CORS cache bugs
        let fetchUrl = url;
        if (url.startsWith('http')) {
             fetchUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
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
};
