import sys

with open("src/hooks/useTokenManager.ts", "r") as f:
    content = f.read()

if 'import { trackEvent }' not in content:
    content = content.replace(
        'import { useState, useEffect } from "react";',
        'import { useState, useEffect } from "react";\nimport { trackEvent } from "../services/analytics";'
    )

content = content.replace(
    'setIsInitializing(false);',
    'setIsInitializing(false);\n        if (!initError) { setTimeout(() => trackEvent("app_open"), 500); }'
)

with open("src/hooks/useTokenManager.ts", "w") as f:
    f.write(content)
