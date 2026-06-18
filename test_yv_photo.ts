import fs from 'fs';
import { detectFaceAndHairline } from './src/server/services/yandexVision';
import 'dotenv/config';

async function run() {
  const fileBuffer = fs.readFileSync('face.jpg');
  const base64 = fileBuffer.toString('base64');
  console.log('Sending pure base64. Length:', base64.length);

  try {
    const data = await detectFaceAndHairline(base64);
    console.log(data);
  } catch(e) {
    console.error(e);
  }
}
run();
