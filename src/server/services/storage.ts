import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export async function uploadToStorage(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/png'
): Promise<string> {
  const accessKeyId = (process.env.YANDEX_STORAGE_KEY || '').trim();
  const secretAccessKey = (process.env.YANDEX_STORAGE_SECRET || '').trim();
  const bucketName = (process.env.YANDEX_BUCKET_NAME || '').trim();

  // Если ключи S3 есть, используем S3
  if (accessKeyId && secretAccessKey && bucketName) {
    try {
      const s3 = new S3Client({
        region: 'ru-central1',
        endpoint: 'https://storage.yandexcloud.net',
        forcePathStyle: true,
        credentials: { accessKeyId, secretAccessKey },
      });

      const key = `${uuidv4()}_${filename}`;
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }));
      return `https://${bucketName}.storage.yandexcloud.net/${key}`;
    } catch (error: any) {
      console.error(`[Storage] S3 upload failed for ${filename}: ${error.message}. Falling back to base64.`);
    }
  }
  
  // Storage fallback: use data URIs directly so fal.ai can consume them
  try {
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (localError: any) {
    console.error(`[Storage] base64 fallback failed: ${localError.message}`);
    return '';
  }
}
