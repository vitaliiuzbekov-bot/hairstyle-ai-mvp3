import fs from 'fs';
import { detectFaceAndHairline } from './src/server/services/yandexVision';
import 'dotenv/config';

async function run() {
  console.log("Downloading a face image...");
  try {
    const res = await fetch("https://thispersondoesnotexist.com");
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    console.log("Downloaded image, length:", base64.length);
    
    console.log("Testing Yandex Vision...");
    const data = await detectFaceAndHairline(base64);
    console.log("Result:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.error("Caught error:", e);
  }
}
run();
