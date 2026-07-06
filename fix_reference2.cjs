const fs = require('fs');

let content = fs.readFileSync('src/server/routes/reference.ts', 'utf-8');

// The string we want to insert
const newBlock = `
    let prompt = \`Hyper-real selfie, ordinary \${isMale ? 'man' : 'woman'}. \${ageProps}. \${faceProps}\${colorProps}\${eyeProps}\${skinProps}\${hairDensProps}\${hairlineProps}\${beardProps} \${extraBaldInjunction}Style: \${finalKeyword}. Raw, unretouched, no studio light.\`;

    const imageUrl = await generateReference(prompt);
`;

// Remove the old stuff starting from `let prompt = ...` up to `});` just before `await setCachedValue`
const startIdx = content.indexOf('let prompt =');
const endIdx = content.indexOf('await setCachedValue');

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newBlock + "    " + content.substring(endIdx);
}

// Remove duplicate `imageUrl` declaration if any
content = content.replace(/const imageUrl = await callYandexART.*?;/s, "");

fs.writeFileSync('src/server/routes/reference.ts', content);
