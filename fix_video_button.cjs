const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /const videoBlob = await generateBeforeAfterVideo\(beforeSrc, afterSrc\);\s*const videoUrl = URL\.createObjectURL\(videoBlob\);\s*const a = document\.createElement\('a'\);\s*a\.href = videoUrl;\s*a\.target = '_blank';\s*a\.download = `style_transformation_\$\{Date\.now\(\)\}\.\$\{videoBlob\.type\.includes\('mp4'\) \? 'mp4' : 'webm'\}\`;\s*document\.body\.appendChild\(a\);\s*a\.click\(\);\s*document\.body\.removeChild\(a\);\s*setTimeout\(\(\) => URL\.revokeObjectURL\(videoUrl\), 10000\);\s*setToastIsError\(false\);\s*setToastMessage\(`Видео сохранено на ваше устройство\.\`\);/;

const replacement = `
                     let fallbackSuccess = false;
                     try {
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
                     } catch(localErr) {
                        const tg = (window as any).Telegram?.WebApp;
                        const tgUserId = tg?.initDataUnsafe?.user?.id;
                        if (tgUserId) {
                            tg.showAlert("Генерируем видео на сервере и отправляем в чат, подождите 10-15 секунд...");
                            const res = await fetch('/api/send-to-telegram', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    tgUserId: tgUserId.toString(),
                                    type: 'video',
                                    beforeImage: beforeSrc,
                                    afterImage: afterSrc
                                })
                            });
                            if (res.ok) {
                                tg.showAlert("Готово! Видео отправлено вам в личные сообщения бота.");
                                fallbackSuccess = true;
                            } else {
                                throw new Error("Сервер не смог сгенерировать видео");
                            }
                        } else {
                            throw localErr;
                        }
                     }
                     if (fallbackSuccess) return;
`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
