import { adminDb } from '../firebase';

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    if (!adminDb) return;
    const sessionsRef = adminDb.collection('sessions');
    const snapshot = await sessionsRef.where('expiresAt', '<', Date.now()).get();
    
    if (snapshot.empty) return;

    const batch = adminDb.batch();
    snapshot.docs.forEach((d: any) => {
      batch.delete(d.ref);
    });
    
    await batch.commit();
    console.log(`Cleaned up ${snapshot.size} expired sessions`);
  } catch (err: any) {
    if (!err.message?.includes('PERMISSION_DENIED')) {
      console.error('Error cleaning up sessions:', err.message);
    }
  }
}
