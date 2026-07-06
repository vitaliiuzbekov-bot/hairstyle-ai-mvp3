const sharp = require('sharp');
const fs = require('fs');

async function blendSeam(inputFile, outputFile) {
    const { data, info } = await sharp(inputFile).raw().toBuffer({ resolveWithObject: true });
    const w = info.width;
    const h = info.height;
    const channels = info.channels;
    const cx = w / 2;
    const blendRadius = 15; // Increased radius
    
    const outData = Buffer.from(data);
    
    // Gaussian-like blur approximation
    for (let y = 0; y < h; y++) {
        for (let x = cx - blendRadius; x < cx + blendRadius; x++) {
            let sum = [0, 0, 0];
            let count = 0;
            // sample neighborhood
            for (let k = -8; k <= 8; k++) {
                let px = x + k;
                if (px >= 0 && px < w) {
                    let idx = (y * w + px) * channels;
                    sum[0] += data[idx];
                    sum[1] += data[idx+1];
                    sum[2] += data[idx+2];
                    count++;
                }
            }
            let idx = (y * w + x) * channels;
            outData[idx] = sum[0] / count;
            outData[idx+1] = sum[1] / count;
            outData[idx+2] = sum[2] / count;
        }
    }
    
    await sharp(outData, { raw: { width: w, height: h, channels: channels } })
        .jpeg({ quality: 95 })
        .toFile(outputFile);
    console.log("Blended strongly", outputFile);
}

async function run() {
    await blendSeam("public/split-left.jpg", "public/split-left-blended.jpg");
    await blendSeam("public/split-right.jpg", "public/split-right-blended.jpg");
}
run();
