const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!code.includes('onOpenLibrary')) {
  code = code.replace(
    'import { Scissors, Coins, Zap } from "lucide-react";',
    'import { Scissors, Coins, Zap, BookOpen, Info } from "lucide-react";'
  );

  code = code.replace(
    '  setIsProfileOpen: (val: boolean) => void;\n}',
    '  setIsProfileOpen: (val: boolean) => void;\n  onOpenLibrary: () => void;\n  onOpenTutorial: () => void;\n}'
  );

  code = code.replace(
    '  setIsProfileOpen,\n}) => {',
    '  setIsProfileOpen,\n  onOpenLibrary,\n  onOpenTutorial,\n}) => {'
  );

  // Add the buttons next to Profile
  const profileButtonHtml = `          <div className="relative ml-2">`;
  const newButtonsHtml = `          <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
            <button onClick={onOpenTutorial} className={\`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all \${isLightMode ? "bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200" : "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"}\`}>
              <Info size={16} />
            </button>
            <button onClick={onOpenLibrary} className={\`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all \${isLightMode ? "bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200" : "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"}\`}>
              <BookOpen size={16} />
            </button>
          </div>
          <div className="relative ml-1 sm:ml-2">`;
  code = code.replace(profileButtonHtml, newButtonsHtml);

  fs.writeFileSync('src/components/Header.tsx', code);
  console.log("Header patched");
}
