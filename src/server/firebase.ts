import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";

let adminApp: any = null;
let dbId = "(default)";

try {
  const configStr = fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8");
  const config = JSON.parse(configStr);
  
  if (config.firestoreDatabaseId) {
    dbId = config.firestoreDatabaseId;
  }

  if (getApps().length === 0) {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
    let credential;
    if (serviceAccountStr) {
        try {
            credential = cert(JSON.parse(serviceAccountStr));
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON", e);
        }
    }
    
    adminApp = initializeApp({ 
      projectId: config.projectId, 
      storageBucket: config.storageBucket,
      ...(credential ? { credential } : {})
    });
  } else {
    adminApp = getApps()[0];
  }
} catch (e) {
  console.error("Could not init firebase admin:", e);
}

export const adminDb = adminApp ? getFirestore(adminApp, dbId) : null;
export const adminStorage = adminApp ? getStorage(adminApp) : null;
export { adminApp, dbId };
