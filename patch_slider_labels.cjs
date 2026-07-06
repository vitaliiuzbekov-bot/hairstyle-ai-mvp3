const fs = require('fs');
let file = '/app/applet/src/components/BeforeAfterSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove original labels from the end
content = content.replace(
  `{/* Labels */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-white border border-white/10 pointer-events-none whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">ДО</div>
      <div className="absolute top-4 right-4 z-10 bg-emerald-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-emerald-100 border border-emerald-500/30 pointer-events-none whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">ПОСЛЕ</div>`,
  ''
);

// Add "ПОСЛЕ" label to the After Image container, wait, the After Image is just <CachedImage> we need to wrap it or just put it in the root but under the clipped div.
// Currently the DOM is:
// 1. hidden img
// 2. After image
// 3. Before image (clipped)
// 4. Watermark hider
// 5. Slider Line

content = content.replace(
  `{/* After Image (Background) */}
      <CachedImage
        src={afterImage}
        alt="После"
        className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-contain object-center"
      />`,
  `{/* After Image (Background) */}
      <CachedImage
        src={afterImage}
        alt="После"
        className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-contain object-center"
      />
      <div className="absolute top-4 right-4 z-0 bg-emerald-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-emerald-100 border border-emerald-500/30 pointer-events-none whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">ПОСЛЕ</div>`
);

content = content.replace(
  `<CachedImage
          src={beforeImage}
          alt="До"
          className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-contain object-center"
        />`,
  `<CachedImage
          src={beforeImage}
          alt="До"
          className="absolute inset-0 pointer-events-none" imageClassName="w-full h-full object-contain object-center"
        />
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-white border border-white/10 pointer-events-none whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">ДО</div>`
);

fs.writeFileSync(file, content);
