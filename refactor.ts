import fs from "fs";

let serverCode = fs.readFileSync("server.ts", "utf-8");

function extractBlock(startMarker: string, nextMarker: string) {
    const startIndex = serverCode.indexOf(startMarker);
    if (startIndex === -1) return "";
    const nextIndex = nextMarker ? serverCode.indexOf(nextMarker, startIndex + startMarker.length) : serverCode.length;
    return serverCode.substring(startIndex, nextIndex);
}

const savePurchaseBlock = extractBlock(`app.post("/api/save-purchase"`, `app.post("/api/has-purchase"`);
const hasPurchaseBlock = extractBlock(`app.post("/api/has-purchase"`, `if (process.env.NODE_ENV !== "production") {`);

fs.writeFileSync("src/server/routes/auth.ts", `
import { Request, Response, Router } from "express";
import { logToTelegram } from "../services/logger";
import { parseInitData } from "@telegram-apps/init-data-node";

export const authRouter = Router();

${savePurchaseBlock.replace(/app\.post\(/g, "authRouter.post(")}
${hasPurchaseBlock.replace(/app\.post\(/g, "authRouter.post(")}
`);

// Now rewrite server.ts
// We'll remove all the extracted blocks, including the Yandex ones.

// 1. the Yandex functions bounds
const yandexStart = serverCode.indexOf(`let cachedIamToken: string`);
const yandexEnd = serverCode.indexOf(`export async function logToTelegram`)

// 2. The log function bound
const logStart = serverCode.indexOf(`export async function logToTelegram`);
const logEnd = serverCode.indexOf(`async function startServer() {`);

// 3. fetchImageAsBase64
const fetchImgStart = serverCode.indexOf(`async function fetchImageAsBase64`);
const fetchImgEnd = serverCode.indexOf(`app.post("/api/log"`);

// 4. all the routes within startServer
const routesStart = serverCode.indexOf(`app.post("/api/log"`);
const routesEnd = serverCode.indexOf(`if (process.env.NODE_ENV !== "production") {`);

const newServerCode = 
serverCode.substring(0, yandexStart) +
`
import { analysisRouter } from "./src/server/routes/analysis";
import { generateRouter } from "./src/server/routes/generate";
import { authRouter } from "./src/server/routes/auth";
import { logToTelegram } from "./src/server/services/logger";
` + 
serverCode.substring(logEnd, fetchImgStart) + 
`
  app.post("/api/log", async (req, res) => {
    try {
      const { level = 'info', message, userId } = req.body;
      const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
      await logToTelegram(\`<b>[Client \${emoji}]</b> \${userId ? \`User: <code>\${userId}</code>\\n\` : ''}\${message}\`);
      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to log" });
    }
  });

  app.use("/api", analysisRouter);
  app.use("/api", generateRouter);
  app.use("/api", authRouter);

` + 
serverCode.substring(routesEnd);

fs.writeFileSync("server.ts", newServerCode);

console.log("Rewritten server.ts");
