import fs from 'fs';
console.log(process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'Has KEY' : 'No KEY');
console.log(process.env.FIREBASE_SERVICE_ACCOUNT ? 'Has Account' : 'No Account');
