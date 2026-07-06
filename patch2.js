import fs from 'fs';
const p = '/app/applet/src/server/routes/generate.ts';
let code = fs.readFileSync(p, 'utf-8');

const regex = /let finalTargetImageUrl = targetImageUrl;[\s\S]*?if \(\!finalTargetImageUrl\.startsWith\('data:'\)\) \{[\s\S]*?console\.log\(\`\[generate-full\] CRITICAL WARNING:[^`]*\`\);[\s\S]*?\}/;

const match = code.match(regex);
if (match) {
    const replacement = `let finalTargetImageUrl = targetImageUrl;
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
        }`;
        
    fs.writeFileSync(p, code.replace(regex, replacement));
    console.log("Patched successfully via regex");
} else {
    console.log("Regex not matched!");
}
