const sharp = require('sharp');

async function blendSeam(inputFile, outputFile) {
    const { width, height } = await sharp(inputFile).metadata();
    const stripWidth = 40;
    const cx = Math.floor(width / 2);
    
    // Extract center strip
    const strip = await sharp(inputFile)
        .extract({ left: cx - stripWidth/2, top: 0, width: stripWidth, height: height })
        .blur(8) // strong blur
        .toBuffer();
        
    // Composite blurred strip back onto original
    await sharp(inputFile)
        .composite([{ input: strip, left: cx - stripWidth/2, top: 0 }])
        .jpeg({ quality: 95 })
        .toFile(outputFile);
        
    console.log("Blended with sharp blur", outputFile);
}

async function run() {
    await blendSeam("public/split-left.jpg", "public/split-left-blended.jpg");
    await blendSeam("public/split-right.jpg", "public/split-right-blended.jpg");
}
run();
