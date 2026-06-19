const fs = require('fs');
const https = require('https');

async function testUri(uri) {
  const data = JSON.stringify({
    modelUri: uri,
    completionOptions: { maxTokens: 10 },
    messages: [{ role: "user", text: "test" }]
  });

  const options = {
    hostname: 'llm.api.cloud.yandex.net',
    port: 443,
    path: '/foundationModels/v1/completion',
    method: 'POST',
    headers: {
      'Authorization': `Api-Key test`, // Not a real token, just want to see if it gives invalid model_uri or invalid auth
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise(resolve => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ uri, status: res.statusCode, body }));
    });
    req.on('error', e => resolve({ uri, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  const uris = [
    'vision://req/yandexvision/latest',
    'vis://req/yandexvision/latest',
    'gpt://req/yandexvision/latest',
    'vis://req/yandex-vision/latest',
    'vision://req/yandexgpt-vision/latest',
    'vis://req/yandexgpt-vision/latest',
    'gpt://req/yandexgpt-vision/latest'
  ];
  for (const uri of uris) {
    const result = await testUri(uri);
    console.log(result.uri, result.body);
  }
}
main();
