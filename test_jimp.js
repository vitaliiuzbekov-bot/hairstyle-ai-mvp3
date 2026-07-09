import { Jimp } from "jimp";

async function run() {
  const image = await Jimp.read('raw_split.jpg');
  console.log(`Image dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
}
run();
