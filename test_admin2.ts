import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let projectId = '';
let databaseId = '';
try {
  const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
  projectId = config.projectId;
  databaseId = config.firestoreDatabaseId || '';
} catch (e) {
  projectId = 'ai-studio-hairstyleaimvp';
}

if (!admin.apps.length) {
  admin.initializeApp({
    projectId
  });
}

import { getFirestore } from 'firebase-admin/firestore';
const testDb = databaseId ? getFirestore(admin.app(), databaseId) : getFirestore(admin.app());

async function run() {
  try {
    await testDb.collection('test').doc('1').set({ test: 1 });
    console.log('db set success');
  } catch (e: any) {
    console.error('db set fail:', e.message);
  }
}
run();
