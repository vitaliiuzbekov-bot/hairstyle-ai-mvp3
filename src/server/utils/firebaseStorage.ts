import { adminStorage } from "../firebase";
import crypto from "crypto";

export async function uploadBufferToFirebase(buffer: Buffer, contentType: string = 'image/jpeg'): Promise<string> {
  const ext = contentType.includes('webp') ? '.webp' : contentType.includes('png') ? '.png' : '.jpg';
  const fileName = `generations/${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
  const base64Url = `data:${contentType};base64,${buffer.toString('base64')}`;
  
  if (!adminStorage) {
    console.warn("adminStorage is not initialized, falling back to base64");
    return base64Url;
  }
  
  try {
      const bucket = adminStorage.bucket();
      if (!bucket || !bucket.name) {
        console.warn("Firebase storage bucket is not configured, falling back to base64");
        return base64Url;
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
  } catch (err) {
      console.warn("Failed to upload to Firebase Storage, falling back to base64.", err.message);
      return base64Url;
  }
}
