const fs = require('fs');
const content = fs.readFileSync('src/components/HaircutList.tsx', 'utf8');

const target = `  loadMoreRecommendations: () => void;`;
const replacement = `  loadMoreRecommendations: (mode?: 'library' | 'ai') => void;`;

fs.writeFileSync('src/components/HaircutList.tsx', content.replace(target, replacement));
