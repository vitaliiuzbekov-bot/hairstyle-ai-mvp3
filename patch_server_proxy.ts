import fs from 'fs';

const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `  app.get("/api/proxy-image", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) return res.status(400).send("No url provided");
      const response = await fetch(url);`;

const replacement = `  app.get("/api/proxy-image", async (req, res) => {
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

      const response = await fetch(url);`;

code = code.replace(target, replacement);

fs.writeFileSync(file, code);
console.log("Successfully patched proxy-image in server.ts");
