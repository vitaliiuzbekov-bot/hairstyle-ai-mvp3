import sys

with open("src/hooks/useImageUpload.ts", "r") as f:
    content = f.read()

if 'import { trackEvent }' not in content:
    content = content.replace(
        "import { ref, uploadString, getDownloadURL } from 'firebase/storage';",
        "import { ref, uploadString, getDownloadURL } from 'firebase/storage';\nimport { trackEvent } from '../services/analytics';"
    )

content = content.replace(
    'setRawImageBase64(b64);',
    'setRawImageBase64(b64);\n            trackEvent("photo_uploaded");'
)

with open("src/hooks/useImageUpload.ts", "w") as f:
    f.write(content)
