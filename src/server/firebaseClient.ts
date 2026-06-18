import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import fs from 'fs';
import path from 'path';

setLogLevel('silent');

const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const app = initializeApp(config);
export const serverDb = getFirestore(app, (config as any).firestoreDatabaseId || '(default)');
export const serverStorage = getStorage(app);
