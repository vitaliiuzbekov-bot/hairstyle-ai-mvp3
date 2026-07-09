const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const injection = `
      {isLibraryOpen && (
        <React.Suspense fallback={<LoadingFallback isLightMode={isLightMode} />}>
          <HaircutLibraryModal
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            isLightMode={isLightMode}
          />
        </React.Suspense>
      )}
`;

code = code.replace('{isChatOpen && (', injection + '{isChatOpen && (');
fs.writeFileSync('src/App.tsx', code);
