import { serverDb } from '../firebaseClient';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    if (!serverDb) return;
    const sessionsRef = collection(serverDb, 'sessions');
    const q = query(sessionsRef, where('expiresAt', '<', Date.now()));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return;

    const batch = writeBatch(serverDb);
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
