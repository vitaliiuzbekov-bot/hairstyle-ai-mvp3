const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const fetchBlockRegex = /const promptRes = await geminiQueue\.add\(async \(\) => \{[\s\S]*?return \{ text: data\?.candidates\?\.\[0\]\?.content\?.parts\?\.\[0\]\?.text \};[\s\S]*?\} catch \(e: any\) \{[\s\S]*?throw e;[\s\S]*?\}[\s\S]*?\}\);[\s\S]*?\}\);/g;

code = code.replace(fetchBlockRegex, `const promptRes = await geminiQueue.add(async () => {
           return withRetry(async () => {
               try {
                   const response = await ai.models.generateContent({
                       model: 'gemini-2.5-flash',
                       contents: contentsPayload,
                       config: {
                           temperature: 0.7,
                           maxOutputTokens: 500
                       }
                   });
                   return { text: response.text };
               } catch (e: any) {
                   throw e;
               }
           });
        });`);

fs.writeFileSync('src/server/routes/generate.ts', code);
