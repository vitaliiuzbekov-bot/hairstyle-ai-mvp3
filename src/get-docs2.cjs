const https = require('https');
https.get('https://raw.githubusercontent.com/yandex-cloud/docs/master/ru/foundation-models/concepts/yandexgpt/models.md', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
