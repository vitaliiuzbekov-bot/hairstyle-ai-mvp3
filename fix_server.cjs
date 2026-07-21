const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('telegramExportRouter')) {
    content = content.replace(
        /import \{ generateRouter \} from "\.\/src\/server\/routes\/generate";/,
        `import { generateRouter } from "./src/server/routes/generate";
import telegramExportRouter from "./src/server/routes/telegramExport";`
    );
    
    content = content.replace(
        /  app\.use\("\/api", generateRouter\);/,
        `  app.use("/api", generateRouter);
  app.use("/api", telegramExportRouter);`
    );
    fs.writeFileSync('server.ts', content);
}
