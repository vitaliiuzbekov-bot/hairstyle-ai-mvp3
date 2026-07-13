sed -i -e '/let mediaBlob: Blob;/,/alert(\`Функция '\''В сторис'\'' работает только внутри приложения Telegram.\\n\\nФайл (видео или фото) был запрошен на скачивание (или открыт в новой вкладке).\\n\\nПримечание: в некоторых веб-браузерах (например, в песочнице Google) скачивание может быть заблокировано.\`);/c\
                     let publicUrl = "";\
                     let isVideo = true;\
                     try {\
                        const getBase64 = async (src: string) => {\
                           if (src.startsWith('\''data:'\'')) return src;\
                           const res = await fetch(src);\
                           const blob = await res.blob();\
                           return new Promise<string>((resolve, reject) => {\
                              const reader = new FileReader();\
                              reader.onloadend = () => resolve(reader.result as string);\
                              reader.onerror = reject;\
                              reader.readAsDataURL(blob);\
                           });\
                        };\
                        const beforeBase64 = await getBase64(beforeSrc);\
                        const afterBase64 = await getBase64(displayResultUrl || "");\
                        \
                        const response = await fetch('\''/api/generate/render-video'\'', {\
                           method: '\''POST'\'',\
                           headers: { '\''Content-Type'\'': '\''application/json'\'' },\
                           body: JSON.stringify({ beforeBase64, afterBase64 })\
                        });\
                        const data = await response.json();\
                        if (data.url) publicUrl = data.url;\
                        else throw new Error("No URL returned from video render");\
                     } catch(videoErr) {\
                        console.warn("Video generation failed on server, falling back to collage", videoErr);\
                        isVideo = false;\
                        const collageDataUrl = await generateCollage(beforeSrc, displayResultUrl || "", userRole === '\''salon'\'' ? salonName : undefined);\
                        const res = await fetch(collageDataUrl);\
                        const mediaBlob = await res.blob();\
                        const blobToBase64 = (b: Blob): Promise<string> => new Promise((resolve, reject) => {\
                           const reader = new FileReader();\
                           reader.onloadend = () => resolve(reader.result as string);\
                           reader.onerror = reject;\
                           reader.readAsDataURL(b);\
                        });\
                        const base64data = await blobToBase64(mediaBlob);\
                        const response = await fetch('\''/api/generate/upload-video'\'', {\
                           method: '\''POST'\'',\
                           headers: { '\''Content-Type'\'': '\''application/json'\'' },\
                           body: JSON.stringify({ videoBase64: base64data, mimeType: '\''image/jpeg'\'' })\
                        });\
                        const data = await response.json();\
                        if (data.url) publicUrl = data.url;\
                        else throw new Error("No image URL available for story");\
                     }\
                     \
                     if (tg && tg.shareToStory && tg.platform !== '\''unknown'\'') {\
                        tg.shareToStory(publicUrl, {\
                           text: "Мой новый стиль от нейросети! 💇‍♀️✨",\
                           widget_link: {\
                              url: "https://t.me/neirostilist_bot",\
                              name: "Примерить тоже"\
                           }\
                        });\
                     } else {\
                        const a = document.createElement('\''a'\'');\
                        a.href = publicUrl;\
                        a.target = '\''_blank'\'';\
                        a.download = \`before_after_\${Date.now()}.\${isVideo ? '\''mp4'\'' : '\''jpg'\''}\`;\
                        document.body.appendChild(a);\
                        a.click();\
                        document.body.removeChild(a);\
                        \
                        if (!tg || tg.platform === '\''unknown'\'') {\
                           alert(\`Видео успешно создано. Файл открыт в новой вкладке.\`);\
                        }' src/components/VTONPreviewSection.tsx
