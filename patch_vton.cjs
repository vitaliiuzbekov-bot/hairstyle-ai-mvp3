const fs = require('fs');
let code = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');
code = code.replace(
  /\{loadingVTONStyles\[tryOnStyle\.imageKeyword \|\| tryOnStyle\.name\] && \(\s*<div className=\{`flex-1 min-h-\[300px\] rounded-2xl border flex flex-col items-center justify-center p-8 \$\{isLightMode \? 'bg-gray-50 border-gray-200' : 'bg-white\/5 border-white\/10'\}`\}>\s*<\/div>\s*\)\}/g,
  `{loadingVTONStyles[tryOnStyle.imageKeyword || tryOnStyle.name] && (
        <div className={\`flex-1 min-h-[300px] rounded-2xl border flex flex-col items-center justify-center p-8 \${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}\`}>
          <RotatingFactsLoader isLightMode={!!isLightMode} title="Примерка стиля..." />
        </div>
      )}`
);
fs.writeFileSync('src/components/VTONPreviewSection.tsx', code);
