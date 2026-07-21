const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

content = content.replace(
/    const generateVirtualTryOn = async \(\n        styleKeyword: string,\n        styleName: string,\n        styleDescription: string,\n        selectedColor: string \| null = null,\n        targetImageUrl: string \| null = null,\n    \) => \{/m,
`    const generateVirtualTryOn = async (
        styleKeyword: string,
        styleName: string,
        styleDescription: string,
        targetImageUrl: string | null = null,
    ) => {`
);

fs.writeFileSync('src/hooks/useAnalysis.ts', content);
