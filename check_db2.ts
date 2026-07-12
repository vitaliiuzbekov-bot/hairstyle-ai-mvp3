import { adminDb } from "./src/server/firebase";

async function run() {
  if (!adminDb) { console.log("No DB"); return; }
  const users = await adminDb.collection('users').get();
  console.log(`Found ${users.docs.length} users`);
  users.docs.forEach(d => {
    console.log(d.id, d.data());
  });
}
run();
