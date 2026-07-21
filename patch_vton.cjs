const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /onClick=\{async \(e\) => \{\s*e\.stopPropagation\(\);\s*if\(isExportingVideo\) return;\s*setIsExportingVideo\(true\);[\s\S]*?finally \{\s*setIsExportingVideo\(false\);\s*\}\s*\}\}/;

const replacement = `onClick={async (e) => {
                  e.stopPropagation();
                  if(isExportingVideo) return;
                  setIsExportingVideo(true);
                  try {
                     const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : \`data:\${mimeType || "image/jpeg"};base64,\${imageBase64}\`);
                     const afterSrc = displayResultUrl || "";
                     
                     const tg = (window as any).Telegram?.WebApp;
                     
                     if (tg && tg.showAlert) {
                         // Telegram environment
                         setToastMessage("Генерируем видео на сервере (около 10 сек)...");
                     } else {
                         setToastMessage("Генерируем видео на сервере...");
                     }
                     
                     const res = await fetch('/api/generate-video', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                             beforeImage: beforeSrc,
                             afterImage: afterSrc
                         })
                     });
                     
                     if (res.ok) {
                         const blob = await res.blob();
                         const blobUrl = window.URL.createObjectURL(blob);
                         
                         const a = document.createElement('a');
                         a.href = blobUrl;
                         a.target = '_blank';
                         a.download = \`style_transformation_\${Date.now()}.mp4\`;
                         document.body.appendChild(a);
                         a.click();
                         document.body.removeChild(a);
                         
                         setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                         
                         setToastIsError(false);
                         setToastMessage(\`Видео сохранено на ваше устройство.\`);
                     } else {
                         // Fallback to local generation
                         console.warn("Server generation failed, falling back to local");
                         const videoBlob = await generateBeforeAfterVideo(beforeSrc, afterSrc);
                         const videoUrl = URL.createObjectURL(videoBlob);
                         
                         const a = document.createElement('a');
                         a.href = videoUrl;
                         a.target = '_blank';
                         a.download = \`style_transformation_\${Date.now()}.\${videoBlob.type.includes('mp4') ? 'mp4' : 'webm'}\`;
                         document.body.appendChild(a);
                         a.click();
                         document.body.removeChild(a);
                         
                         setTimeout(() => URL.revokeObjectURL(videoUrl), 10000);
                         
                         setToastIsError(false);
                         setToastMessage(\`Видео сохранено на ваше устройство.\`);
                     }
                  } catch (err) {
                     console.error("Video export failed", err);
                     setToastIsError(true);
                     setToastMessage(\`Ошибка экспорта: \${(err as Error).message}\`);
                  } finally {
                     setIsExportingVideo(false);
                  }
               }}`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
    console.log("Patched VTONPreviewSection.tsx!");
} else {
    console.log("Regex not matched!");
}
