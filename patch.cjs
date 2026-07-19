const fs = require('fs');
let code = fs.readFileSync('src/components/BeforeAfterSlider.tsx', 'utf8');

const target = `      {/* Слой «ДО» (Верхний слой с обрезкой контейнера без сжатия картинки) */}
      <div 
        className="absolute inset-0 h-full overflow-hidden z-20 pointer-events-none"
        style={{ width: \`\${sliderPosition}%\` }}
      >
        <img 
          src={proxyBeforeUrl} 
          alt="Before" 
          className="absolute inset-0 h-full object-cover max-w-none pointer-events-none"
          style={{ width: containerRef.current?.getBoundingClientRect().width || '100vw' }}
        />
        <span className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-md z-20">
          ОБЫЧНОЕ ФОТО
        </span>
      </div>`;

const replacement = `      {/* Слой «ДО» (Верхний слой с обрезкой контейнера без сжатия картинки) */}
      <div 
        className="absolute top-0 bottom-0 left-0 overflow-hidden z-20 pointer-events-none"
        style={{ width: \`\${Math.max(0.1, sliderPosition)}%\` }}
      >
        <div 
          className="absolute top-0 bottom-0 left-0 pointer-events-none"
          style={{ width: \`\${10000 / Math.max(0.1, sliderPosition)}%\`, height: '100%' }}
        >
          <img 
            src={proxyBeforeUrl} 
            alt="Before" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <span className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-md z-20">
            ОБЫЧНОЕ ФОТО
          </span>
        </div>
      </div>`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/BeforeAfterSlider.tsx', code.replace(target, replacement));
  console.log('Patched successfully');
} else {
  console.log('Target not found');
}
