const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

const regex = /                     let fallbackSuccess = false;[\s\S]*?                     if \(fallbackSuccess\) return;/m;

const replacement = `
                     const tg = (window as any).Telegram?.WebApp;
                     const tgUserId = tg?.initDataUnsafe?.user?.id;
                     
                     if (tgUserId) {
                        try {
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
                                setToastIsError(false);
                                setToastMessage(\`Видео отправлено в чат!\`);
                                return;
                            } else {
                                console.error("Сервер не смог сгенерировать видео", await res.text());
                                // Fallback to local generation below
                            }
                        } catch(err) {
                            console.error("Telegram send error", err);
                        }
                     }
                     
                     // Local generation fallback
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
`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
