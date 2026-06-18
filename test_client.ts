import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || '(default)');

async function run() {
  try {
    await setDoc(doc(db, 'test', 'client'), { test: 1 });
    console.log('client db set success');
  } catch (e: any) {
    console.error('client db set fail:', e.message);
  }
}
run();
