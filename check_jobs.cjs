const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
let app;
if (base64ServiceAccount) {
    const serviceAccount = JSON.parse(Buffer.from(base64ServiceAccount, 'base64').toString('utf-8'));
    app = initializeApp({
        credential: cert(serviceAccount)
    });
} else {
    console.error("No service account!");
    process.exit(1);
}

const db = getFirestore(app);

async function check() {
    const snapshot = await db.collection('jobs').orderBy('createdAt', 'desc').limit(5).get();
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log("Job:", doc.id);
        console.log("  Status:", data.status);
        console.log("  Created:", new Date(data.createdAt).toISOString());
        console.log("  Error:", data.error || 'none');
        console.log("  Image URL length:", data.imageUrl ? data.imageUrl.length : 0);
        console.log("  Telegram User ID:", data.tgUserId || 'not saved');
    });
}

check().catch(console.error);
