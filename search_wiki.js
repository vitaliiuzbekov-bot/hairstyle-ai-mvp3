import https from "https";

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=before%20and%20after%20haircut%20filetype:bitmap&utf8=&format=json';
  const data = await fetchUrl(url);
  console.log(data);
}
run();
