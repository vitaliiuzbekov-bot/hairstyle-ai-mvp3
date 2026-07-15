import * as fal from '@fal-ai/serverless-client';

const API_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY || '';
fal.config({
  credentials: API_KEY || 'mock-key',
});
async function run() {
    const b64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAGBAQABAAAA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwA=";
    const response = await fetch(b64);
    const blob = await response.blob();
    const url = await fal.storage.upload(blob);
    console.log("Uploaded URL:", url);
}
run();
