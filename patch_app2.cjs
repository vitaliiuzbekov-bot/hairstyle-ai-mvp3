const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. extract isLibraryOpen from useUI
code = code.replace(
  '    isProfileOpen, setIsProfileOpen,',
  '    isProfileOpen, setIsProfileOpen,\n    isLibraryOpen, setIsLibraryOpen,'
);

// 2. add onOpenLibrary and onOpenTutorial to Header
code = code.replace(
  '        setIsDeveloper={setIsDeveloper}\n        setIsProfileOpen={setIsProfileOpen}\n      />',
  '        setIsDeveloper={setIsDeveloper}\n        setIsProfileOpen={setIsProfileOpen}\n        onOpenLibrary={() => setIsLibraryOpen(true)}\n        onOpenTutorial={() => setShowTutorial(true)}\n      />'
);

// 3. Add HaircutLibraryModal inside Suspense
const SuspenseStart = '        <React.Suspense fallback={<LoadingFallback isLightMode={isLightMode} />}>';
const ModalComponent = `          {isLibraryOpen && (
            <HaircutLibraryModal
              isOpen={isLibraryOpen}
              onClose={() => setIsLibraryOpen(false)}
              isLightMode={isLightMode}
            />
          )}`;
code = code.replace(SuspenseStart, SuspenseStart + '\n' + ModalComponent);

fs.writeFileSync('src/App.tsx', code);
console.log("App patched 2");
