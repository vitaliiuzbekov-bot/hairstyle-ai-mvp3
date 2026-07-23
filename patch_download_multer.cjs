const fs = require('fs');
let code = fs.readFileSync('src/utils/telegramDownload.ts', 'utf8');

const targetStr = `const resUpload = await fetch('/api/send-video-to-chat', {
                          method: 'POST',
                          headers: { 
                              'Content-Type': 'application/json',
                              'x-telegram-init-data': tg.initData
                          },
                          body: JSON.stringify({ base64: base64data, ext })
                      });`;
                      
const replacementStr = `
                      const formData = new FormData();
                      formData.append('video', videoBlob, filename);
                      formData.append('ext', ext);
                      
                      const resUpload = await fetch('/api/send-video-to-chat', {
                          method: 'POST',
                          headers: { 
                              'x-telegram-init-data': tg.initData
                          },
                          body: formData
                      });
`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/utils/telegramDownload.ts', code);
console.log("Patched client download logic");
