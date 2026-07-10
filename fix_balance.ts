import { adminDb } from "./src/server/firebase";
import * as dotenv from "dotenv";
dotenv.config();

async function run() {
  if (!adminDb) {
     console.log("No adminDb");
     return;
  }
  const users = await adminDb.collection("users").get();
  for (const doc of users.docs) {
     console.log("Updating", doc.id);
     await doc.ref.update({ generationsLeft: 9999 });
  }
  console.log("Done");
  process.exit(0);
}
run();
