import sys

with open("src/hooks/useAnalysis.ts", "r") as f:
    content = f.read()

if 'import { trackEvent }' not in content:
    content = content.replace(
        "import { generateArApi, generateFullApi, loadMoreApi } from '../services/api';",
        "import { generateArApi, generateFullApi, loadMoreApi } from '../services/api';\nimport { trackEvent } from '../services/analytics';"
    )

content = content.replace(
    'console.log(\'[useAnalysis] Начало генерации\');',
    'console.log(\'[useAnalysis] Начало генерации\');\n          trackEvent("generation_started", { styleKeyword });'
)

content = content.replace(
    'setVtonResultUrl(watermarkedUrl);',
    'setVtonResultUrl(watermarkedUrl);\n            trackEvent("generation_completed", { styleKeyword });'
)

content = content.replace(
    'console.error("VTON Error:", err);',
    'console.error("VTON Error:", err);\n          trackEvent("generation_failed", { error: String(err?.message || "unknown") });'
)

with open("src/hooks/useAnalysis.ts", "w") as f:
    f.write(content)
