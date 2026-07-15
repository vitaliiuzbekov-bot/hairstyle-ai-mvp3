import * as fal from '@fal-ai/serverless-client';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY || '';
fal.config({ credentials: API_KEY || 'mock-key' });

async function uploadImageToFal(base64DataUri: string): Promise<string> {
  try {
    const matches = base64DataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 data URI');
    }
    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const blob = new Blob([buffer], { type });
    const uploadedUrl = await fal.storage.upload(blob);
    return uploadedUrl;
  } catch (err: any) {
    console.warn("Failed to upload to FAL storage, returning base64", err.message);
    return base64DataUri;
  }
}

async function run() {
  const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const url = await uploadImageToFal(dummyBase64);
  console.log("Result:", url);
}

run();
