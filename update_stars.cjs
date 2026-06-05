const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, increment } = require('firebase/firestore');
const fs = require('fs');

async function run() {
  const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  const userRef = doc(db, 'users', '8585130589');
  await setDoc(userRef, {
    generationsLeft: increment(100),
    fullAccess: true
  }, { merge: true });
  console.log("Stars added.");
  process.exit(0);
}

run().catch(console.error);
