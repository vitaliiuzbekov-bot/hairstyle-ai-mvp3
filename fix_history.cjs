const fs = require('fs');

// Fix HistoryPage
let codePage = fs.readFileSync('src/components/HistoryPage.tsx', 'utf8');
codePage = codePage.replace(
  '  keyword: string;',
  '  keyword: string;\n  clientName?: string;'
);
fs.writeFileSync('src/components/HistoryPage.tsx', codePage);

// Fix HistoryCarousel
let codeCar = fs.readFileSync('src/components/HistoryCarousel.tsx', 'utf8');
codeCar = codeCar.replace(
  '  keyword: string;',
  '  keyword: string;\n  clientName?: string;'
);
codeCar = codeCar.replace(
  `              <p className="text-[10px] sm:text-xs font-semibold text-white/90 truncate w-full text-left">
                {item.keyword}
              </p>`,
  `              <p className="text-[10px] sm:text-xs font-semibold text-white/90 truncate w-full text-left">
                {item.keyword} {item.clientName && <span className="text-amber-400 font-medium ml-1">({item.clientName})</span>}
              </p>`
);
fs.writeFileSync('src/components/HistoryCarousel.tsx', codeCar);
console.log('Fixed History files');
