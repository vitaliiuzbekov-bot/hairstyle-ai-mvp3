const { getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp({ projectId: "gen-lang-client-0405788365" });
const db = getFirestore(app, "ai-studio-hairstyleaimvp-0640fe2b-9f22-4893-8020-7953053ab2bd");
db.collection('test').doc('test').set({a: 1}).then(() => console.log('success')).catch(e => console.error(e));
