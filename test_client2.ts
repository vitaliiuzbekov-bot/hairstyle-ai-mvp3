import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || '(default)');

async function run() {
  try {
    const snap = await getDoc(doc(db, 'test', 'client'));
    console.log('client db get success', snap.exists() ? snap.data() : 'no data');
  } catch (e: any) {
    console.error('client db get fail:', e.message);
  }
  process.exit(0);
}
run();
