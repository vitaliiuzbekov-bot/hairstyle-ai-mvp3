const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

code = code.replace(
  `<ImageSlider isLightMode={isLightMode} resultImage={resultImage} history={history} />
            </div>`,
  `<ImageSlider isLightMode={isLightMode} resultImage={resultImage} history={history} />
            </div>
            
            <div className="text-xs text-white/50 break-all px-4 mt-2">
              Debug URL: {(window as any).debugUrlInfo}
            </div>`
);

fs.writeFileSync('src/components/HomePage.tsx', code);
