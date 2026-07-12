import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import compression from "compression";
import "dotenv/config";


import { analysisRouter } from "./src/server/routes/analysis";
import { generateRouter } from "./src/server/routes/generate";
import { authRouter } from "./src/server/routes/auth";
import { referenceRouter } from "./src/server/routes/reference";
import { tgStorageRouter } from "./src/server/routes/tgStorage";
import { logToTelegram } from "./src/server/services/logger";
import crypto from "crypto";
import multer from "multer";

const telegramValidationMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const initData = req.headers['x-telegram-init-data'] as string;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const isDev = process.env.NODE_ENV !== "production";
  
  const userId = req.body?.userId;

  // В режиме разработки или если токена нет - разрешаем
  // В ПРОДАКШЕНЕ запрещаем обход через local-user!
  if (!botToken || (isDev && userId === "local-user")) {
     return next();
  }

  // Если мы в Telegram (бота токен есть), то initData ОБЯЗАТЕЛЕН
  if (!initData) {
    res.status(400).json({ error: "Access Denied: Telegram Init Data is required" });
    return;
  }

  try {
    const parsedData = new URLSearchParams(initData);
    const hash = parsedData.get('hash');
    if (!hash) {
      res.status(400).json({ error: "Invalid Telegram Init Data: Missing hash" });
      return;
    }

    parsedData.delete('hash');
    const keys = Array.from(parsedData.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${parsedData.get(key)}`).join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash) {
      res.status(400).json({ error: "Invalid Telegram Init Data: Signature mismatch" });
      return;
    }
    
        const userParam = parsedData.get('user');
    if (userParam) {
      const userObj = JSON.parse(userParam);
      if (req.body) {
        req.body.tgUserId = userObj.id.toString();
      }
    } else {
      res.status(400).json({ error: "Invalid Telegram Init Data: Missing user" });
      return;
    }

    next();
  } catch (e) {
    console.error("Telegram Validation Error:", e);
    res.status(400).json({ error: "Telegram Validation Exception" });
    return;
  }
};

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const PORT = 3000;

  // Enhance security with Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev with inline styles/scripts and third-party APIs
    crossOriginEmbedderPolicy: false
  }));

  // Compress responses for better performance
  app.use(compression());

  // Middleware for parsing JSON with a larger limit for images
  app.use(express.json({ limit: "50mb" }));

  // Rate Limiter to prevent bankruptcy from GenAI usage overhead
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60, // Limit each user/IP to 60 requests per windowMs
    keyGenerator: (req, res) => {
      if (req.body?.tgUserId) {
        return `tg_${req.body.tgUserId}`;
      }
      if (req.body?.userId && req.body.userId !== "local-user") {
        return `user_${req.body.userId}`;
      }
      const initData = req.headers['x-telegram-init-data'];
      try {
        if (initData && typeof initData === 'string') {
          const params = new URLSearchParams(initData);
          const userStr = params.get('user');
          if (userStr) {
            const userObj = JSON.parse(userStr);
            if (userObj?.id) return `tg_${userObj.id}`;
          }
        }
      } catch (e) {}
      const ip = req.ip || req.socket.remoteAddress || "unknown"; return ipKeyGenerator(ip);
    },
    message: { 
      error: "Слишком много запросов от вашего аккаунта. Пожалуйста, подождите немного.",
      fallback: true
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { 
      fileSize: 15 * 1024 * 1024,
      fieldSize: 15 * 1024 * 1024
    }
  });

  // Setup middlewares for protected API routes
  app.post("/api/log", async (req, res) => {
    try {
      const { level = 'info', message, userId } = req.body;
      const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
      await logToTelegram(`<b>[Client ${emoji}]</b> ${userId ? `User: <code>${userId}</code>\n` : ''}${message}`);
      res.json({ success: true });
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Failed to log" });
    }
  });

  app.use("/api/analyze", apiLimiter, upload.single("image"), telegramValidationMiddleware);
  app.use("/api/generate-reference", telegramValidationMiddleware, apiLimiter);
  app.use("/api/reference", telegramValidationMiddleware, apiLimiter);
  app.use("/api/send-pdf", telegramValidationMiddleware, apiLimiter);
  app.use("/api/generate-full", apiLimiter, upload.single("image"), telegramValidationMiddleware);
  app.use("/api/generate-ar", telegramValidationMiddleware, apiLimiter);
  app.use("/api/chat-stylist", telegramValidationMiddleware, apiLimiter);
  app.use("/api/transcribe", telegramValidationMiddleware, apiLimiter);
  app.use("/api/load-more", telegramValidationMiddleware, apiLimiter);
  app.use("/api/create-invoice", telegramValidationMiddleware, apiLimiter);
  app.use("/api/set-telegram-webhook", apiLimiter);
  
  app.get("/api/proxy-image", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) return res.status(400).send("No url provided");
      const response = await fetch(url);
      if (!response.ok) throw new Error("Fetch failed");
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = response.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(buffer);
    } catch (e) {
      console.error("Proxy error", e);
      res.status(500).send("Failed to proxy image");
    }
  });

  app.use("/api", analysisRouter);
  app.use("/api", generateRouter);
  app.use("/api", authRouter);
  app.use("/api", referenceRouter);
  app.use("/api/tg", tgStorageRouter);

  // Kill old service worker
  app.get("/sw.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.send("self.addEventListener('install', () => { self.skipWaiting(); }); self.addEventListener('activate', () => { self.registration.unregister(); self.clients.claim(); });");
  });

  // Global API Error Handler
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express API Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error", fallback: !!err.fallback });
  });

if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Add fallback for dev mode to serve index.html
    const fs = await import("fs");
    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        console.log("SPA fallback triggered for:", url);
        if (url.startsWith('/api/')) {
           return res.status(404).json({ error: "API route not found" });
        }
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

    // Global error handler to prevent HTML proxy errors on API routes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Error Handler:", err.message || err);
    if (req.originalUrl.startsWith('/api/')) {
      res.status(err.status || 500).json({ 
        error: err.message || "Internal Server Error", 
        fallback: true 
      });
      return;
    }
    next(err);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
