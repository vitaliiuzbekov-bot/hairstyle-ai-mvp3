import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountStr) {
    console.error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
    process.exit(1);
}
const serviceAccount = JSON.parse(serviceAccountStr);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.project_id + ".appspot.com"
});

async function run() {
    const bucket = admin.storage().bucket();
    // Test base64 image
    const base64Str = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    const buffer = Buffer.from(base64Str, 'base64');
    const file = bucket.file("test_upload.jpg");
    await file.save(buffer, {
        metadata: { contentType: 'image/jpeg' }
    });
    const url = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
    console.log("Uploaded URL:", url[0]);
}
run();
