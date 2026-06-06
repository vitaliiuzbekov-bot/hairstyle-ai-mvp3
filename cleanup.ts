import fs from "fs";

let genCode = fs.readFileSync("src/server/routes/generate.ts", "utf-8");

const endIndex = genCode.indexOf(`import express from "express";`);
if (endIndex > -1) {
    genCode = genCode.substring(0, endIndex);
}

genCode += `
generateRouter.post("/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64 || !mimeType) {
        return res.status(400).json({ error: "Missing audioBase64 or mimeType" });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [
          {
            text: "Транскрибируй это аудио на русском языке. Верни только текст и ничего больше."
          },
          {
              inlineData: {
                  mimeType,
                  data: audioBase64
              }
          }
        ]
      });
      const transcribedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.json({ text: transcribedText });
    } catch (err: any) {
      console.error("Transcribe error:", err);
      res.status(500).json({ error: err.message || "Ошибка транскрибации" });
    }
});
`;

fs.writeFileSync("src/server/routes/generate.ts", genCode);

// auth.ts also had duplicate code if it failed block extraction
let authCode = fs.readFileSync("src/server/routes/auth.ts", "utf-8");
const authEndIndex = authCode.indexOf(`if (process.env.NODE_ENV !== "production") {`);
if (authEndIndex > -1) {
    authCode = authCode.substring(0, authEndIndex);
}
fs.writeFileSync("src/server/routes/auth.ts", authCode);

// The paths in generate.ts must be /generate-reference instead of /api/generate-reference, because app.use("/api", generateRouter)
let newGenCode = fs.readFileSync("src/server/routes/generate.ts", "utf-8");
newGenCode = newGenCode.replace(/generateRouter\.post\("\/api\//g, 'generateRouter.post("/');
fs.writeFileSync("src/server/routes/generate.ts", newGenCode);

let newAuthCode = fs.readFileSync("src/server/routes/auth.ts", "utf-8");
newAuthCode = newAuthCode.replace(/authRouter\.post\("\/api\//g, 'authRouter.post("/');
fs.writeFileSync("src/server/routes/auth.ts", newAuthCode);
console.log("Cleanup done.");
