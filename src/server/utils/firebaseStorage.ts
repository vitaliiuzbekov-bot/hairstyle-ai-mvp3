import { adminStorage } from "../firebase";
import crypto from "crypto";

export async function uploadBufferToFirebase(buffer: Buffer, contentType: string = 'image/jpeg'): Promise<string> {
  if (!adminStorage) {
    throw new Error("adminStorage is not initialized");
  }
  const bucket = adminStorage.bucket();
  if (!bucket || !bucket.name) {
    throw new Error("Firebase storage bucket is not configured");
  }

  const ext = contentType.includes('webp') ? '.webp' : contentType.includes('png') ? '.png' : '.jpg';
  const fileName = `generations/${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
  const file = bucket.file(fileName);
  const uuid = crypto.randomUUID();
  
  await file.save(buffer, {
    metadata: {
      contentType: contentType,
      metadata: { firebaseStorageDownloadTokens: uuid }
    }
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
}
