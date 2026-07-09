const fs = require('fs');
let code = fs.readFileSync('src/context/UIContext.tsx', 'utf8');

if (!code.includes('isLibraryOpen')) {
  code = code.replace(
    '  isCameraModalOpen: boolean;',
    '  isCameraModalOpen: boolean;\n  isLibraryOpen: boolean;\n  setIsLibraryOpen: (val: boolean) => void;'
  );

  code = code.replace(
    '  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);',
    '  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);\n  const [isLibraryOpen, setIsLibraryOpen] = useState(false);'
  );

  code = code.replace(
    '        isCameraModalOpen,\n        setIsCameraModalOpen,',
    '        isCameraModalOpen,\n        setIsCameraModalOpen,\n        isLibraryOpen,\n        setIsLibraryOpen,'
  );

  fs.writeFileSync('src/context/UIContext.tsx', code);
  console.log("UIContext patched");
}
