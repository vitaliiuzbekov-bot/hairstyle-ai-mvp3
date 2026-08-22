import { adminStorage } from "../firebase";
import crypto from "crypto";
import fs from "fs";
import path from "path";

async function saveToLocalTmp(buffer: Buffer, fileName: string): Promise<string> {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    const safeName = fileName.replace(/\//g, '_');
    const filePath = path.join(tmpDir, safeName);
    fs.writeFileSync(filePath, buffer);
    return `/tmp/${safeName}`;
}

export async function uploadBufferToFirebase(buffer: Buffer, contentType: string = 'image/jpeg'): Promise<string> {
  const ext = contentType.includes('webp') ? '.webp' : contentType.includes('png') ? '.png' : '.jpg';
  const fileName = `generations/${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
  
  if (!adminStorage) {
    console.warn("adminStorage is not initialized, falling back to local /tmp storage");
    return saveToLocalTmp(buffer, fileName);
  }
  
  try {
      const bucket = adminStorage.bucket();
      if (!bucket || !bucket.name) {
        console.warn("Firebase storage bucket is not configured, falling back to local /tmp storage");
        return saveToLocalTmp(buffer, fileName);
      }
      const file = bucket.file(fileName);
      const uuid = crypto.randomUUID();
      
      await file.save(buffer, {
        metadata: {
          contentType: contentType,
          metadata: { firebaseStorageDownloadTokens: uuid }
        }
      });
      return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
  } catch (err: any) {
      let errMsg = err?.message || 'Unknown error';
      console.warn("Failed to upload to Firebase Storage, falling back to local /tmp storage. Reason:", errMsg);
      return saveToLocalTmp(buffer, fileName);
  }
}
