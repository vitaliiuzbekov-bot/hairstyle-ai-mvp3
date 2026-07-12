import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const keyStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!keyStr) {
  console.log("No FIREBASE_SERVICE_ACCOUNT_KEY");
  process.exit(1);
}

const serviceAccount = JSON.parse(keyStr);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const users = await db.collection('users').get();
  console.log(`Found ${users.docs.length} users`);
  users.docs.forEach(d => {
    console.log(d.id, d.data());
  });
}
run();
