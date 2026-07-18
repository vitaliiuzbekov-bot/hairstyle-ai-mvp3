const fs = require('fs');

let code = fs.readFileSync('src/server/routes/generate.ts', 'utf-8');

const helperCode = `
function getProxiedUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http')) {
        return \`/api/proxy-image?url=\${encodeURIComponent(url)}\`;
    }
    return url;
}
`;

if (!code.includes('function getProxiedUrl')) {
    code = code.replace('import { isAuthorizedDeveloper } from "../utils/tgAuth";', 'import { isAuthorizedDeveloper } from "../utils/tgAuth";\n' + helperCode);
}

// 814:             res.json({ 
//                 status: 'completed', 
//                 result: { 
//                   imageUrl: swappedImageUrlForJob,
//                   originalUrl: originalImageUrl,
//                   referenceImage: finalImageUrlForJob
//                 } 
//              });

code = code.replace(
    /res\.json\(\{\s*status:\s*'completed',\s*result:\s*\{\s*imageUrl:\s*swappedImageUrlForJob,\s*originalUrl:\s*originalImageUrl,\s*referenceImage:\s*finalImageUrlForJob\s*\}\s*\}\);/g,
    `res.json({ 
                status: 'completed', 
                result: { 
                  imageUrl: getProxiedUrl(swappedImageUrlForJob),
                  originalUrl: getProxiedUrl(originalImageUrl),
                  referenceImage: getProxiedUrl(finalImageUrlForJob)
                } 
             });`
);

code = code.replace(
    /return res\.json\(\{ imageUrl: cachedImage \}\);/g,
    `return res.json({ imageUrl: getProxiedUrl(cachedImage) });`
);

code = code.replace(
    /res\.json\(\{ imageUrl: finalImageUrl, debugError: lastError \}\);/g,
    `res.json({ imageUrl: getProxiedUrl(finalImageUrl), debugError: lastError });`
);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log('generate.ts patched');
