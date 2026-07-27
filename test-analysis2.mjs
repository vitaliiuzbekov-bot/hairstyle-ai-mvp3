const dummyBase64 = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'local-user', skipVision: true, localSkinTone: 'fair', imageBase64: dummyBase64 })
}).then(r => r.text()).then(console.log).catch(console.error);
