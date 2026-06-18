import fs from 'fs';
import { detectFaceAndHairline } from './src/server/services/yandexVision';
import 'dotenv/config';

// Generate a valid tiny JPEG base64 (a valid 1x1 black pixel JPEG)
const validJpegBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

async function run() {
  console.log("Testing with valid JPEG base64...");
  try {
    const data = await detectFaceAndHairline(validJpegBase64);
    console.log("Result:", data);
  } catch(e) {
    console.error("Caught error:", e);
  }
}
run();
