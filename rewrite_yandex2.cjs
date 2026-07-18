const fs = require('fs');
let code = fs.readFileSync('src/server/services/yandex.ts', 'utf8');

const replacementCall = `export async function callYandexGPT(systemText: string, userText: string): Promise<string> {
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      console.log("Using Gemini API for callYandexGPT...");
      const res = await geminiQueue.add(() => withRetry(() => gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userText,
        config: {
            systemInstruction: systemText,
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
      
      const geminiMessages = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
      }));
      
      const res = await geminiQueue.add(() => withRetry(() => gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: geminiMessages,
        config: {
            systemInstruction: systemText,
            temperature: 0.85
        }
      })));
      return res?.text || "";
    } catch (e: any) {
      console.error("Gemini failed in callYandexGPTChat, falling back to Yandex:", e.message);
    }
  }`;

code = code.replace(/export async function callYandexGPT\(systemText: string, userText: string\): Promise<string> \{[\s\S]*?console\.error\("Gemini failed in callYandexGPT, falling back to Yandex:", e\.message\);\n    \}\n  \}/, replacementCall);
code = code.replace(/export async function callYandexGPTChat\(systemText: string, messages: \{role: string, text: string\}\[\]\): Promise<string> \{[\s\S]*?console\.error\("Gemini failed in callYandexGPTChat, falling back to Yandex:", e\.message\);\n    \}\n  \}/, replacementChat);

fs.writeFileSync('src/server/services/yandex.ts', code);
console.log("Rewrote yandex.ts again");
