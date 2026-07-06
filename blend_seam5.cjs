const sharp = require('sharp');
const fs = require('fs');

async function removeStripe(inputFile, outputFile) {
    const { data, info } = await sharp(inputFile).raw().toBuffer({ resolveWithObject: true });
    
    const w = info.width;
    const h = info.height;
    const channels = info.channels;
    const cx = Math.floor(w / 2);
    
    // The dark line might be slightly wider. Let's make stripeWidth 10.
    const stripeWidth = 10; 
    
    const outData = Buffer.from(data);
    
    for (let y = 0; y < h; y++) {
        // We will interpolate between left edge and right edge of the stripe
        const leftEdgeX = cx - stripeWidth;
        const rightEdgeX = cx + stripeWidth;
        
        let idxLeft = (y * w + leftEdgeX) * channels;
        let idxRight = (y * w + rightEdgeX) * channels;
        
        for (let x = leftEdgeX + 1; x < rightEdgeX; x++) {
            let idx = (y * w + x) * channels;
            
            // Linear interpolation + slight blur from neighborhood
            const t = (x - leftEdgeX) / (rightEdgeX - leftEdgeX);
            
            for (let c = 0; c < channels; c++) {
                // simple linear interpolation across the seam
                outData[idx + c] = Math.round(data[idxLeft + c] * (1 - t) + data[idxRight + c] * t);
            }
        }
    }
    
    await sharp(outData, { raw: { width: w, height: h, channels: channels } })
        .jpeg({ quality: 95 })
        .toFile(outputFile);
    console.log("Removed stripe from", outputFile);
}

async function run() {
    await removeStripe("public/split-left.jpg", "public/split-left-blended.jpg");
    await removeStripe("public/split-right.jpg", "public/split-right-blended.jpg");
}
run();
