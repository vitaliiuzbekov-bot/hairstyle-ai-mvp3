const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes("app.use('/tmp'")) {
    content = content.replace('app.use(express.static(distPath));', "app.use(express.static(distPath));\n    app.use('/tmp', express.static(path.join(process.cwd(), 'tmp')));");
    // Wait, the distPath static is inside process.env.NODE_ENV === 'production' branch!
    // I should put it globally.
    content = content.replace('app.use("/api/health"', "app.use('/tmp', express.static(path.join(process.cwd(), 'tmp')));\n  app.use(\"/api/health\"");
    fs.writeFileSync('server.ts', content);
    console.log("Patched server!");
}
