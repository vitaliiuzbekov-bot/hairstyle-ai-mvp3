const fs = require('fs');

let content = fs.readFileSync('src/server/routes/reference.ts', 'utf-8');

// Replace imports
content = content.replace('import { callYandexART } from "../services/yandex";', 'import { generateReference } from "../services/falClient";');

const newPromptStr = `    let prompt = \`Hyper-real selfie, ordinary \${isMale ? 'man' : 'woman'}. \${ageProps}. \${faceProps}\${colorProps}\${eyeProps}\${skinProps}\${hairDensProps}\${hairlineProps}\${beardProps} \${extraBaldInjunction}Style: \${finalKeyword}. Raw, unretouched, no studio light.\`;

    const imageUrl = await generateReference(prompt);`;

content = content.replace(/let prompt = `Hyper-real selfie.*?;/, newPromptStr);

fs.writeFileSync('src/server/routes/reference.ts', content);
