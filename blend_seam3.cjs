const sharp = require('sharp');

async function blendSeam(inputFile, outputFile) {
    const { data: origData, info } = await sharp(inputFile).raw().toBuffer({ resolveWithObject: true });
    const { data: blurredData } = await sharp(inputFile).blur(15).raw().toBuffer({ resolveWithObject: true });
    
    const w = info.width;
    const h = info.height;
    const channels = info.channels;
    const cx = Math.floor(w / 2);
    const blendRadius = 40; 
    
    const outData = Buffer.from(origData);
    
    for (let y = 0; y < h; y++) {
        for (let x = cx - blendRadius; x <= cx + blendRadius; x++) {
            // Distance from center
            const dist = Math.abs(x - cx);
            // Alpha: 1 at center, 0 at blendRadius
            // Use smoothstep or simple linear
            const t = dist / blendRadius;
            const alpha = 1 - (t * t * (3 - 2 * t)); // Smoothstep
            
            let idx = (y * w + x) * channels;
            for (let c = 0; c < channels; c++) {
                outData[idx + c] = Math.round(blurredData[idx + c] * alpha + origData[idx + c] * (1 - alpha));
            }
        }
    }
    
    await sharp(outData, { raw: { width: w, height: h, channels: channels } })
        .jpeg({ quality: 95 })
        .toFile(outputFile);
    console.log("Blended beautifully", outputFile);
}

async function run() {
    await blendSeam("public/split-left.jpg", "public/split-left-blended.jpg");
    await blendSeam("public/split-right.jpg", "public/split-right-blended.jpg");
}
run();
