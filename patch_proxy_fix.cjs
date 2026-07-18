const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /app\.get\("\/api\/proxy-image"[\s\S]*?\}\);/;
code = code.replace(regex, `app.get("/api/proxy-image", async (req, res) => {
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
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`Failed to fetch remote image: \${response.statusText}\`);

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      
      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error('[Proxy Error] Ошибка проксирования:', error.message);
      res.status(500).send('Error proxying image');
    }
  });`);

fs.writeFileSync('server.ts', code);
console.log("Done");
