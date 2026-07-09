const fs = require('fs');
const content = fs.readFileSync('src/components/UploadZone.tsx', 'utf8');
const newContent = content.replace(
  /\{\/\* User Guide Block \*\/\}[\s\S]*?<div\s+className=\{\`w-full rounded-\[1\.25rem\]/,
  `{/* User Guide Block */}
                <div className={\`w-full max-w-[500px] mb-4 px-4 py-3 rounded-xl border flex items-center gap-3 text-left transition-all \${isLightMode ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-blue-500/10 border-blue-500/20 text-blue-300'}\`}>
                  <Info size={16} className="shrink-0" />
                  <p className="text-xs sm:text-sm font-medium leading-tight">
                    Сделайте селфи <span className="font-bold underline decoration-blue-400/50 underline-offset-2">днем лицом к окну</span>, смотрите прямо, уберите волосы и очки.
                  </p>
                </div>
                <div
                  className={\`w-full rounded-[1.25rem]`
);
fs.writeFileSync('src/components/UploadZone.tsx', newContent);
