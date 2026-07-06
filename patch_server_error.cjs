const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  /app\.listen\(PORT, "0\.0\.0\.0", \(\) => {/g,
  `  // Global error handler to prevent HTML proxy errors on API routes
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
  });\n\n  app.listen(PORT, "0.0.0.0", () => {`
);
fs.writeFileSync('server.ts', code);
