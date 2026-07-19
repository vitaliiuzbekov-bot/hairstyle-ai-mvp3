const fs = require('fs');
let code = fs.readFileSync('src/components/BeforeAfterSlider.tsx', 'utf8');

const target = `  // Пропускаем входящие URL через наш CORS-прокси на бэкенде
  const proxyBeforeUrl = beforeImage ? \`/api/proxy-image?url=\${encodeURIComponent(beforeImage)}\` : '';
  const proxyAfterUrl = afterImage ? \`/api/proxy-image?url=\${encodeURIComponent(afterImage)}\` : '';`;

const replacement = `  // Пропускаем входящие URL через наш CORS-прокси на бэкенде
  const getProxyUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    return \`/api/proxy-image?url=\${encodeURIComponent(url)}\`;
  };
  const proxyBeforeUrl = getProxyUrl(beforeImage);
  const proxyAfterUrl = getProxyUrl(afterImage);`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/BeforeAfterSlider.tsx', code.replace(target, replacement));
  console.log('Patched proxy in BeforeAfterSlider successfully');
} else {
  console.log('Target not found in BeforeAfterSlider for proxy');
}
