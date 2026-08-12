import sys

with open("src/hooks/useAnalysis.ts", "r") as f:
    content = f.read()

if 'import { trackEvent }' not in content:
    content = content.replace(
        "import { analyzeImageApi, generateArApi, generateFullApi, loadMoreApi } from '../services/api';",
        "import { analyzeImageApi, generateArApi, generateFullApi, loadMoreApi } from '../services/api';\nimport { trackEvent } from '../services/analytics';"
    )

with open("src/hooks/useAnalysis.ts", "w") as f:
    f.write(content)
