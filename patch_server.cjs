const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

if (!code.includes("import axios")) {
    code = code.replace('import express from "express";', 'import express from "express";\nimport axios from "axios";');
}

const oldProxy = `  app.get("/api/proxy-image", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) return res.status(400).send("No url provided");

      const allowedDomains = [
        "fal.media",
        "v3.fal.media",
        "storage.yandexcloud.net",
        "firebasestorage.googleapis.com",
        "images.unsplash.com"
      ];

      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "https:") {
          return res.status(403).send("Forbidden: Only HTTPS is allowed");
        }
        if (!allowedDomains.includes(parsedUrl.hostname)) {
          return res.status(403).send("Forbidden: Domain not allowed");
        }
      } catch (err) {
        return res.status(400).send("Invalid url");
      }

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
  });`;

const newProxy = `  app.get("/api/proxy-image", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) return res.status(400).send("No url provided");

      const allowedDomains = [
        "fal.media",
        "v3.fal.media",
        "storage.yandexcloud.net",
        "firebasestorage.googleapis.com",
        "images.unsplash.com"
      ];

      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "https:") {
          return res.status(403).send("Forbidden: Only HTTPS is allowed");
        }
        if (!allowedDomains.includes(parsedUrl.hostname) && !parsedUrl.hostname.endsWith('.fal.media') && !parsedUrl.hostname.endsWith('.fal.run')) {
          return res.status(403).send("Forbidden: Domain not allowed");
        }
      } catch (err) {
        return res.status(400).send("Invalid url");
      }

      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
      res.setHeader("Cache-Control", "public, max-age=31536000");
      
      response.data.pipe(res);
    } catch (error: any) {
      console.error('[Proxy Error] Не удалось проксировать изображение:', error.message);
      res.status(500).send('Error proxying remote image');
    }
  });`;

code = code.replace(oldProxy, newProxy);
fs.writeFileSync('server.ts', code);
console.log('server.ts patched');
