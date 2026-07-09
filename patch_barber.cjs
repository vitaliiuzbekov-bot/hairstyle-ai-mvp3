const fs = require('fs');
const file = 'src/components/BarberBlueprintModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useModalBackButton')) {
    content = content.replace('import React', "import { useModalBackButton } from '../hooks/useTelegramBackButton';\nimport React");
    content = content.replace(
        `  isLightMode
}) => {`,
        `  isLightMode
}) => {
  useModalBackButton(!!tryOnStyle, () => setTryOnStyle(null));`
    );
    fs.writeFileSync(file, content);
    console.log('patched BarberBlueprintModal');
} else {
    console.log('already patched');
}
