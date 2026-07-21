const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

// I will match everything from <div className="flex flex-wrap gap-2 sm:gap-3 w-full"> 
// to <span className="hidden sm:inline">Скачать Видео</span>
// and replace it.

const regex = /<div className="flex flex-wrap gap-2 sm:gap-3 w-full">[\s\S]*?<span className="hidden sm:inline">Скачать Видео<\/span>\s*<\/button>/;

const replacement = `<div className="flex flex-wrap gap-2 sm:gap-3 w-full">
             <button
                  onClick={() => downloadImage(displayResultUrl || "", \`hairstyle_result_\${Date.now()}.jpg\`)}
                  className={\`flex-1 py-3 px-2 sm:px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors text-sm sm:text-base \${isLightMode ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'}\`}
               >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Скачать</span>
             </button>
             <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                     const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : \`data:\${mimeType || "image/jpeg"};base64,\${imageBase64}\`);
                     const collageDataUrl = await generateCollage(beforeSrc, displayResultUrl, userRole === 'salon' ? salonName : undefined);
                     const messageText = "Привет! Смотри, какой стиль я подобрал(а) в нейросети. Хочу такую стрижку и цвет!\\nСоздано в @neirostilist_bot";
                     
                     if (navigator.share) {
                        try {
                           const res = await fetch(collageDataUrl);
                           const blob = await res.blob();
                           const file = new File([blob], 'collage.jpg', { type: 'image/jpeg' });
                           await navigator.share({
                               files: [file],
                               title: 'Мой новый стиль',
                               text: messageText
                           });
                        } catch (e) {
                           downloadImage(collageDataUrl, \`hairstyle_collage_\${Date.now()}.jpg\`);
                        }
                     } else {
                         downloadImage(collageDataUrl, \`hairstyle_collage_\${Date.now()}.jpg\`);
                     }
                  } catch (e) {
                      console.error("Collage err", e);
                  }
               }}
               className={\`flex-1 py-3 px-2 sm:px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors text-sm sm:text-base \${isLightMode ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30'}\`}
             >
                <Grid2x2 size={16} />
                <span className="hidden sm:inline">Коллаж</span>
             </button>
             <button
               onClick={async (e) => {
                  e.stopPropagation();
                  if(isExportingVideo) return;
                  setIsExportingVideo(true);
                  try {
                     const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : \`data:\${mimeType || "image/jpeg"};base64,\${imageBase64}\`);
                     const afterSrc = displayResultUrl || "";
                     
                     const tg = (window as any).Telegram?.WebApp;
                     
                     if (tg && tg.showAlert) {
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
                         const data = await res.json();
                         const videoUrl = window.location.origin + data.url;
                         
                         if (tg && tg.openLink) {
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
                         setToastMessage(\`Видео сохранено. Открываем!\`);
                     } else {
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
               }}
               className={\`flex-1 py-3 px-2 sm:px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors text-sm sm:text-base \${isLightMode ? 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100' : 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30'}\`}
             >
                {isExportingVideo ? <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div> : <Video size={16} />}
                <span className="hidden sm:inline">Скачать Видео</span>
             </button>`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
    console.log("Restored VTONPreviewSection.tsx!");
} else {
    console.log("Regex not matched!");
}
