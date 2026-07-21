const fs = require('fs');
let content = fs.readFileSync('src/components/ColorChangeOnlyCard.tsx', 'utf8');

content = content.replace(/  onGenerationSuccess,[\s\S]*?  setShowBuyModal: \(show: boolean\) => void;\n}/m, `  onGenerationSuccess?: () => void;
  checkLimits: () => Promise<boolean>;
  consumeToken: () => Promise<boolean>;
  setShowBuyModal: (show: boolean) => void;
}`);

content = content.replace(/      if \(onGenerationSuccess\) {\n        onGenerationSuccess,[\s\S]*?        setShowBuyModal\(\);\n      }/m, `      if (onGenerationSuccess) {\n        onGenerationSuccess();\n      }`);

fs.writeFileSync('src/components/ColorChangeOnlyCard.tsx', content);
