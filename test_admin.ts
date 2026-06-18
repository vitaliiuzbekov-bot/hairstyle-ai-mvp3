import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
admin.initializeApp({ projectId: 'gen-lang-client-0405788365' });
const db = getFirestore(admin.app(), 'ai-studio-hairstyleaimvp-0640fe2b-9f22-4893-8020-7953053ab2bd');
db.collection('test').doc('1').set({ test: 1 }).then(() => console.log('success')).catch(e => console.error('fail:', e.message));
