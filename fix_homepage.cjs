const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// Add resultImage to props
code = code.replace(`  isLightMode: boolean;
  isDeveloper: boolean;
}`, `  isLightMode: boolean;
  isDeveloper: boolean;
  resultImage?: string | null;
}`);

code = code.replace(`  isDeveloper
}) => {`, `  isDeveloper,
  resultImage
}) => {`);

// Pass to ImageSlider
code = code.replace(`<ImageSlider isLightMode={isLightMode} />`, `<ImageSlider isLightMode={isLightMode} resultImage={resultImage} history={history} />`);

fs.writeFileSync('src/components/HomePage.tsx', code);
console.log("Updated HomePage.tsx");
