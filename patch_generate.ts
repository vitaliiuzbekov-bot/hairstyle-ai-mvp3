import fs from 'fs';

const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

const resolverFn = `
async function resolveImageToBase64(imageUrl: string | undefined): Promise<string | undefined> {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('data:')) return imageUrl;
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
    return imageUrl;
}
`;

// Insert the resolverFn at the top
if (!code.includes('resolveImageToBase64')) {
    code = code.replace('export const generateRouter = Router();', resolverFn + '\nexport const generateRouter = Router();');
}

// Fix finalTargetImageUrl and selfieImageFull
const searchFinalTarget = `      let finalTargetImageUrl = targetImageUrl;
      if (finalTargetImageUrl) {
        let isLocalUrl = false;
        let parsedPath = finalTargetImageUrl;
        
        if (finalTargetImageUrl.startsWith('http')) {
            try {
                const urlObj = new URL(finalTargetImageUrl);
                if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1') || urlObj.hostname.includes('0.0.0.0')) {
                    parsedPath = urlObj.pathname;
                    isLocalUrl = true; 
                }
            } catch(e) {}
        } else if (finalTargetImageUrl.startsWith('/') || finalTargetImageUrl.startsWith('golden_base/')) {
            isLocalUrl = true;
        }
        let normalizePath = parsedPath;
        if (isLocalUrl && (parsedPath.startsWith('/') || parsedPath.startsWith('golden_base/'))) {
            normalizePath = parsedPath.startsWith('/') ? parsedPath : '/' + parsedPath;
            if (normalizePath.includes('?')) {
                normalizePath = normalizePath.split('?')[0];
            }
            
            const safePath = normalizePath.replace(/^\\/+/, '');
            const path = await import('path');
            let localPath = path.join(process.cwd(), 'dist', safePath);
            
            if (!fs.existsSync(localPath)) {
                localPath = path.join(process.cwd(), 'public', safePath);
            }
            if (!fs.existsSync(localPath) && normalizePath.startsWith('/src/')) {
                localPath = path.join(process.cwd(), safePath);
            }
            if (fs.existsSync(localPath)) {
                const buf = fs.readFileSync(localPath);
                const ext = path.extname(localPath).toLowerCase();
                const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                finalTargetImageUrl = \`data:\${mime};base64,\${buf.toString('base64')}\`;
                console.log(\`[generate-full] Successfully loaded local target image \${localPath}\`);
            } else {
                try {
                    const localUrl = \`http://0.0.0.0:3000\${normalizePath}\`;
                    console.log(\`[generate-full] Fetching target image from local dev server: \${localUrl}\`);
                    const imgRes = await fetch(localUrl);
                    if (imgRes.ok) {
                        const arrayBuffer = await imgRes.arrayBuffer();
                        const buf = Buffer.from(arrayBuffer);
                        const ext = path.extname(normalizePath).toLowerCase();
                        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                        finalTargetImageUrl = \`data:\${mime};base64,\${buf.toString('base64')}\`;
                        console.log(\`[generate-full] Successfully loaded local target image from dev server: \${normalizePath}\`);
                    } else {
                        console.log(\`[generate-full] WARNING: Could not fetch local target image from dev server. Status: \${imgRes.status}\`);
                    }
                } catch (e) {
                    console.error(\`[generate-full] Error fetching local target image from dev server:\`, e);
                }
            }
        }
        if (!finalTargetImageUrl.startsWith('data:') && !finalTargetImageUrl.startsWith('http')) {
            console.log(\`[generate-full] CRITICAL WARNING: targetImageUrl could not be resolved to base64. Using original path: \${normalizePath}\`);
        }
      }`;

const replaceFinalTarget = `      let finalTargetImageUrl = await resolveImageToBase64(targetImageUrl);`;

code = code.replace(searchFinalTarget, replaceFinalTarget);

const searchSelfie = `const selfieImageFull = selfieImage.startsWith('http') || selfieImage.startsWith('data:') ? selfieImage : \`data:image/jpeg;base64,\${selfieImage}\`;`;
const replaceSelfie = `const resolvedSelfie = await resolveImageToBase64(selfieImage);
      const selfieImageFull = resolvedSelfie || (selfieImage.startsWith('http') || selfieImage.startsWith('data:') ? selfieImage : \`data:image/jpeg;base64,\${selfieImage}\`);`;

code = code.replace(searchSelfie, replaceSelfie);

const searchStorageErr = `} catch (storageErr: any) {
             console.warn("Storage upload failed, using fallback URL.", storageErr?.message || storageErr);`;
const replaceStorageErr = `} catch (storageErr: any) {
             const errMsg = storageErr?.error?.message || storageErr?.message || "Unknown storage error";
             console.warn("Firebase Storage upload failed, using fallback URL. Reason:", errMsg);`;

code = code.replace(searchStorageErr, replaceStorageErr);

fs.writeFileSync(file, code);
