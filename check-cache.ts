import dotenv from "dotenv";
dotenv.config();
import { adminDb } from "./src/server/firebase.js";

async function run() {
  if (!adminDb) {
    console.log("No adminDb");
    return;
  }
  const snap = await adminDb.collection("generation_cache").limit(500).get();
  console.log("Found", snap.size, "documents");
  let routes = new Set();
  snap.docs.forEach(doc => {
    try {
      const data = JSON.parse(doc.id);
      if (data.route) routes.add(data.route);
    } catch (e) {
      if (doc.id.includes("reference")) {
        routes.add(doc.id.split("_")[0]);
      }
    }
  });
  console.log("Routes found:", Array.from(routes));
}
run().catch(console.error);
