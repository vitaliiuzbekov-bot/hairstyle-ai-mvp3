fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'local-user', skipVision: true, localSkinTone: 'fair' })
}).then(r => r.text()).then(console.log).catch(console.error);
