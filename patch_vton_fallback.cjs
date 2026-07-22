const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /const videoUrl = URL\.createObjectURL\(videoBlob\);[\s\S]*?setToastIsError\(false\);\s*setToastMessage\(\`Видео сохранено на ваше устройство\.\`\);/g;

const replacement = `const tgEnv = (window as any).Telegram?.WebApp;
                         let finalUrl = URL.createObjectURL(videoBlob);
                         const filename = \`style_transformation_\${Date.now()}.\${videoBlob.type.includes('mp4') ? 'mp4' : 'webm'}\`;
                         
                         if (tgEnv && tgEnv.initData) {
                             // Upload blob to get public URL
                             const reader = new FileReader();
                             reader.readAsDataURL(videoBlob);
                             await new Promise<void>((resolve, reject) => {
                                 reader.onloadend = async () => {
                                     try {
                                         const base64data = reader.result as string;
                                         const resUpload = await fetch('/api/upload-temp', {
                                             method: 'POST',
                                             headers: { 'Content-Type': 'application/json' },
                                             body: JSON.stringify({ base64: base64data, ext: 'mp4' })
                                         });
                                         if (resUpload.ok) {
                                             const upData = await resUpload.json();
                                             finalUrl = window.location.origin + \`/api/download-local?file=\${upData.file}&filename=\${filename}\`;
                                         }
                                         resolve();
                                     } catch(e) { resolve(); }
                                 };
                             });
                         }

                         if (tgEnv && tgEnv.initData && tgEnv.downloadFile && !finalUrl.startsWith('blob:')) {
                             tgEnv.downloadFile({ url: finalUrl, file_name: filename });
                         } else if (tgEnv && tgEnv.initData && tgEnv.openLink && !finalUrl.startsWith('blob:')) {
                             tgEnv.openLink(finalUrl);
                         } else {
                             const a = document.createElement('a');
                             a.href = finalUrl;
                             a.target = '_blank';
                             a.download = filename;
                             document.body.appendChild(a);
                             a.click();
                             document.body.removeChild(a);
                             if (finalUrl.startsWith('blob:')) {
                                 setTimeout(() => URL.revokeObjectURL(finalUrl), 10000);
                             }
                         }
                         
                         setToastIsError(false);
                         setToastMessage(\`Видео отправлено на скачивание!\`);`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
    console.log("Patched VTONPreviewSection fallback download!");
} else {
    console.log("Regex not matched in VTON fallback!");
}
