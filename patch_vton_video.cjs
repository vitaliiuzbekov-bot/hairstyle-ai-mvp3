const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /const data = await res\.json\(\);\s*const videoUrl = window\.location\.origin \+ data\.url;[\s\S]*?setToastIsError\(false\);\s*setToastMessage\(\`Видео сохранено\. Открываем\!\`\);/g;

const replacement = `const data = await res.json();
                         // data.url is likely /tmp/out_...mp4
                         // extract the filename
                         const filename = data.url.split('/').pop();
                         const videoUrl = window.location.origin + \`/api/download-local?file=\${filename}&filename=style_transformation_\${Date.now()}.mp4\`;
                         
                         if (tg && tg.initData && tg.downloadFile) {
                             tg.downloadFile({ url: videoUrl, file_name: \`style_transformation_\${Date.now()}.mp4\` });
                         } else if (tg && tg.initData && tg.openLink) {
                             tg.openLink(videoUrl);
                         } else {
                             const a = document.createElement('a');
                             a.href = videoUrl;
                             a.target = '_blank';
                             a.download = \`style_transformation_\${Date.now()}.mp4\`;
                             document.body.appendChild(a);
                             a.click();
                             document.body.removeChild(a);
                         }
                         
                         setToastIsError(false);
                         setToastMessage(\`Видео отправлено на скачивание!\`);`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
    console.log("Patched VTONPreviewSection video download!");
} else {
    console.log("Regex not matched in VTON!");
}
