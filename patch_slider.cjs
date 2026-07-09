const fs = require('fs');
const file = 'src/components/ImageSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import leftImage')) {
    content = content.replace(
        `import { CachedImage } from "./CachedImage";`,
        `import { CachedImage } from "./CachedImage";\nimport leftImage from "/split-left-blended.jpg?url";\nimport rightImage from "/split-right-blended.jpg?url";`
    );

    content = content.replace(`src="/split-right-blended.jpg?v=114"`, `src={rightImage}`);
    content = content.replace(`src="/split-left-blended.jpg?v=114"`, `src={leftImage}`);

    fs.writeFileSync(file, content);
    console.log('patched ImageSlider with imports');
}
