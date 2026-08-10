import { adminDb } from "./src/server/firebase";

async function check() {
    if (!adminDb) {
        console.log("No DB");
        return;
    }
    const snapshot = await adminDb.collection('jobs').orderBy('createdAt', 'desc').limit(5).get();
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log("Job:", doc.id);
        console.log("  Status:", data.status);
        console.log("  Created:", data.createdAt ? new Date(data.createdAt).toISOString() : 'unknown');
        console.log("  Error:", data.error || 'none');
        console.log("  Image URL length:", data.imageUrl ? data.imageUrl.length : 0);
    });
}
check().then(() => process.exit(0)).catch(console.error);
