import fs from "fs";
import https from "https";

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  const seed = 12345;
  const url1 = `https://image.pollinations.ai/prompt/a%20highly%20realistic%20beautiful%20young%20woman%20with%20messy%20frizzy%20unstyled%20hair,%20perfectly%20centered%20portrait,%20facing%20camera,%20neutral%20expression,%20studio%20lighting?nologo=true&seed=${seed}&width=800&height=1000`;
  const url2 = `https://image.pollinations.ai/prompt/a%20highly%20realistic%20beautiful%20young%20woman%20with%20an%20elegant%20smooth%20professional%20bob%20haircut,%20perfectly%20centered%20portrait,%20facing%20camera,%20neutral%20expression,%20studio%20lighting?nologo=true&seed=${seed}&width=800&height=1000`;
  
  await download(url1, "left.jpg");
  await download(url2, "right.jpg");
  console.log("Downloaded.");
}

run();
