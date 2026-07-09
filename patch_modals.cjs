const fs = require('fs');

function patchModal(file, isOpenVar, onCloseExpr) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('useModalBackButton')) return;
    
    // add import
    content = content.replace(/import React/, "import { useModalBackButton } from '../hooks/useTelegramBackButton';\nimport React");
    
    // add hook call inside the component
    // we find the first "{" after "=> {" or "){" or "{\n"
    let match = content.match(/const \w+.*?=>\s*{/);
    if (!match) match = content.match(/function \w+.*?\)\s*{/);
    if (!match) match = content.match(/export const \w+.*?=>\s*{/);
    
    if (match) {
        const insertPos = match.index + match[0].length;
        const insertText = `\n  useModalBackButton(${isOpenVar}, ${onCloseExpr});\n`;
        content = content.slice(0, insertPos) + insertText + content.slice(insertPos);
        fs.writeFileSync(file, content);
        console.log('patched ' + file);
    } else {
        console.log('could not patch ' + file);
    }
}

patchModal('src/components/BarberBlueprintModal.tsx', '!!tryOnStyle', "() => setTryOnStyle(null)");
patchModal('src/components/CameraModal.tsx', 'isCameraModalOpen', "stopCamera");
patchModal('src/components/ImageEditorModal.tsx', 'isOpen', "onClose");
patchModal('src/components/ProfileModal.tsx', 'true', "onClose"); // rendered conditionally
patchModal('src/components/WelcomeModal.tsx', 'showWelcome', "() => setShowWelcome(false)");
patchModal('src/components/BuyModal.tsx', 'showBuyModal', "() => setShowBuyModal(false)");
patchModal('src/components/ShareModal.tsx', 'true', "() => {}"); // Actually ShareModal uses UIContext inside, we'll patch it differently

