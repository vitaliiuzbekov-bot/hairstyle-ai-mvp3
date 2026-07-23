export const resolveUrlToDataUri = async (url: string): Promise<string> => {
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
};
