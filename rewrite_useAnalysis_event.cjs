const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const regex = /    const \[isLoadingMore, setIsLoadingMore\] = useState\(false\);\n/;
const replacement = `    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        const handler = ((e: CustomEvent) => {
            const { imageUrl, originalUrl } = e.detail || {};
            if (imageUrl) {
                setVtonResultUrl(imageUrl);
                // History update could be done here if needed
            }
        }) as EventListener;
        window.addEventListener('showGenerationResult', handler);
        return () => window.removeEventListener('showGenerationResult', handler);
    }, []);
`;
code = code.replace(regex, replacement);
fs.writeFileSync('src/hooks/useAnalysis.ts', code);
console.log("Rewrote useAnalysis.ts");
