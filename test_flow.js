import fs from 'fs';
import * as fal from '@fal-ai/serverless-client';
import dotenv from 'dotenv';
dotenv.config();

fal.config({ credentials: process.env.FAL_API_KEY || process.env.FAL_KEY });

async function run() {
    // Simulate req.file.buffer.toString('base64')
    // 1x1 black png
    const rawBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    
    // Simulate what generate.ts does:
    const imageUrl = rawBase64;
    
    let resolved;
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/') && imageUrl.length > 10) {
        resolved = `data:image/jpeg;base64,${imageUrl}`;
    }
    
    console.log("Resolved starts with:", resolved.substring(0, 30));
    
    try {
        const response = await fetch(resolved);
        const blob = await response.blob();
        console.log("Blob type:", blob.type, "size:", blob.size);
        
        const uploadedUrl = await fal.storage.upload(blob);
        console.log("Uploaded URL:", uploadedUrl);
        
        const check = await fetch(uploadedUrl);
        console.log("Check downloaded status:", check.status, "type:", check.headers.get('content-type'));
        const checkBlob = await check.blob();
        console.log("Downloaded blob size:", checkBlob.size);
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
