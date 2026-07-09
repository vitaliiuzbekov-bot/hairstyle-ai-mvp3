import fs from "fs";
import https from "https";

function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        fs.writeFileSync(filename, Buffer.concat(data));
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  await download("https://cdn3.pixelcut.app/pixa_cms/media/3ba0ae1b-cb7a-4ab8-93d2-2331f2f0e5d6_hero_image_cd7e5c3a.webp", "ddg_1.webp");
  await download("https://www.hairstyletryon.ai/assets/blog/the-fluttery-layers-youve-been-waiting-for-the-butterfly-haircut-explained/haircut-comparison-split-screen.jpg", "ddg_3.jpg");
  await download("https://ruinmyweek.com/wp-content/uploads/2022/10/thumb-womens-haircuts-before-after-comparison-kristina-katsabina-1024x536.jpg", "ddg_4.jpg");
  await download("https://freerangestock.com/sample/139712/half-and-half-before-and-after-split-screen-view-of-woman.jpg", "ddg_5.jpg");
  console.log("Downloaded.");
}
run();
