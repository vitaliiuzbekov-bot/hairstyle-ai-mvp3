const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const helper = `
const resolveUrlToDataUri = async (url: string): Promise<string> => {
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
`;

const regex = /const res = await fetch\('\/api\/generate-video'/;
const replacement = `                     if (tg && tg.showAlert) {
                         setToastMessage("Генерируем видео на сервере (около 10 сек)...");
                     } else {
                         setToastMessage("Генерируем видео на сервере...");
                     }
                     
                     const resolvedBeforeSrc = await resolveUrlToDataUri(beforeSrc);
                     const resolvedAfterSrc = await resolveUrlToDataUri(afterSrc);

                     const res = await fetch('/api/generate-video'`;

if (!content.includes('resolveUrlToDataUri')) {
    content = content.replace("export function VTONPreviewSection", helper + "\nexport function VTONPreviewSection");
}

if (content.match(regex)) {
    content = content.replace(/if \(tg && tg\.showAlert\) {[\s\S]*?const res = await fetch\('\/api\/generate-video'/, replacement);
    
    // Also replace beforeSrc, afterSrc with resolved versions in the fetch and generateBeforeAfterVideo
    content = content.replace(/beforeImage: beforeSrc,\s*afterImage: afterSrc/, 'beforeImage: resolvedBeforeSrc,\n                             afterImage: resolvedAfterSrc');
    content = content.replace(/generateBeforeAfterVideo\(beforeSrc, afterSrc\)/, 'generateBeforeAfterVideo(resolvedBeforeSrc, resolvedAfterSrc)');
    
    fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
    console.log("Patched VTONPreviewSection for blob URLs!");
} else {
    console.log("Regex not matched in VTON!");
}
