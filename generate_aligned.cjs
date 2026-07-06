const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
    const imgBuffer = fs.readFileSync("public/source-half-half.jpg");
    
    // Size is 768x768
    const width = 768;
    const height = 768;
    const halfWidth = width / 2; // 384
    
    // Extract left half
    const leftHalf = await sharp(imgBuffer)
        .extract({ left: 0, top: 0, width: halfWidth, height: height })
        .toBuffer();
        
    // Mirror left half
    const leftHalfMirrored = await sharp(leftHalf)
        .flop()
        .toBuffer();
        
    await sharp({
        create: { width, height, channels: 3, background: {r:255,g:255,b:255} }
    }).composite([
        { input: leftHalf, left: 0, top: 0 },
        { input: leftHalfMirrored, left: halfWidth, top: 0 }
    ]).toFile("public/split-left.jpg");
    
    // Extract right half
    const rightHalf = await sharp(imgBuffer)
        .extract({ left: halfWidth, top: 0, width: halfWidth, height: height })
        .toBuffer();
        
    // Mirror right half
    const rightHalfMirrored = await sharp(rightHalf)
        .flop()
        .toBuffer();
        
    await sharp({
        create: { width, height, channels: 3, background: {r:255,g:255,b:255} }
    }).composite([
        { input: rightHalfMirrored, left: 0, top: 0 },
        { input: rightHalf, left: halfWidth, top: 0 }
    ]).toFile("public/split-right.jpg");
    
    console.log("Done generating perfect split images!");
}

processImage();
