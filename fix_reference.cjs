const fs = require('fs');

let content = fs.readFileSync('src/server/routes/reference.ts', 'utf-8');

// Replace the long prompt generation
const oldPromptStr = 'const prompt = `Hyper-realistic, unedited, authentic amateur smartphone selfie of an ordinary ${isMale ? \'man\' : \'woman\'}. ${ageProps}. ${faceProps}${colorProps}${eyeProps}${skinProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Hairstyle: ${finalKeyword}. Typical indoor room lighting or natural window light, asymmetric raw facial features, natural uneven skin texture with visible pores and slight blemishes. NOT a professional model, very casual daily look, no airbrushing, no studio lighting, completely raw unretouched photo. Cannot look like a GQ or Vogue model.`;';

const newPromptStr = `let prompt = \`Hyper-real selfie, ordinary \${isMale ? 'man' : 'woman'}. \${ageProps}. \${faceProps}\${colorProps}\${eyeProps}\${skinProps}\${hairDensProps}\${hairlineProps}\${beardProps} \${extraBaldInjunction}Style: \${finalKeyword}. Raw, unretouched, no studio light.\`;

    if (prompt.length > 490) {
      prompt = prompt.substring(0, 490);
    }
    if (negativePrompt.length > 490) {
      negativePrompt = negativePrompt.substring(0, 490);
    }`;

content = content.replace(oldPromptStr, newPromptStr);

// Restore the catch block to original
content = content.replace(/res\.status\(500\)\.json\(\{ error: err\.message, stack: err\.stack \}\);/, 'res.status(500).json({ error: "Ошибка при генерации референса." });');

fs.writeFileSync('src/server/routes/reference.ts', content);
