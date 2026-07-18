const fs = require('fs');
let code = fs.readFileSync('src/server/services/yandex.ts', 'utf8');

const replacementCall = `export async function callYandexGPT(systemText: string, userText: string): Promise<string> {
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      console.log("Using Gemini API for callYandexGPT...");
      const res = await geminiQueue.add(() => withRetry(() => gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
           { role: "user", parts: [{ text: systemText }] },
           { role: "model", parts: [{ text: "Got it. I will follow your instructions strictly." }] },
           { role: "user", parts: [{ text: userText }] }
        ],
        config: {
            temperature: 0.85
        }
      })));
      return res?.text || "";
    } catch (e: any) {
      console.error("Gemini failed in callYandexGPT, falling back to Yandex:", e.message);
    }
  }`;

const replacementChat = `export async function callYandexGPTChat(systemText: string, messages: {role: string, text: string}[]): Promise<string> {
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      console.log("Using Gemini API for callYandexGPTChat...");
      const history = [
         { role: "user", parts: [{ text: systemText }] },
         { role: "model", parts: [{ text: "Got it. I will follow your instructions strictly." }] }
      ];
      
      const geminiMessages = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
      }));
      
      const res = await geminiQueue.add(() => withRetry(() => gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...history, ...geminiMessages],
        config: {
            temperature: 0.85
        }
      })));
      return res?.text || "";
    } catch (e: any) {
      console.error("Gemini failed in callYandexGPTChat, falling back to Yandex:", e.message);
    }
  }`;

code = code.replace(/export async function callYandexGPT\(systemText: string, userText: string\): Promise<string> \{/, replacementCall);
code = code.replace(/export async function callYandexGPTChat\(systemText: string, messages: \{role: string, text: string\}\[\]\): Promise<string> \{/, replacementChat);

fs.writeFileSync('src/server/services/yandex.ts', code);
console.log("Rewrote yandex.ts");
