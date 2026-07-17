const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/isDeveloper=\{isDeveloper\}\n            resultImage=\{resultImage\}/g, 'isDeveloper={isDeveloper}');

code = code.replace(/telegramInitData=\{telegramInitData\}\n            isLightMode=\{isLightMode\}\n            isDeveloper=\{isDeveloper\}/, `telegramInitData={telegramInitData}
            isLightMode={isLightMode}
            isDeveloper={isDeveloper}
            resultImage={resultImage}`);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx");
