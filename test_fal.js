import * as fal from '@fal-ai/serverless-client';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY || '';
fal.config({ credentials: API_KEY });

async function run() {
    // 1x1 black png
    const base64DataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    
    try {
        const response = await fetch(base64DataUri);
        const blob = await response.blob();
        console.log("Blob size:", blob.size, "type:", blob.type);
        
        const uploadedUrl = await fal.storage.upload(blob);
        console.log("Uploaded URL:", uploadedUrl);
        
        const check = await fetch(uploadedUrl);
        console.log("Check uploaded url status:", check.status, check.headers.get('content-type'));
        const checkBlob = await check.blob();
        console.log("Downloaded blob size:", checkBlob.size);
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
