import sys

with open("src/utils/telegram.ts", "r") as f:
    content = f.read()

if 'import { trackEvent }' not in content:
    content = 'import { trackEvent } from "../services/analytics";\n' + content

content = content.replace(
    'export const shareToTelegram = (url: string, text: string) => {',
    'export const shareToTelegram = (url: string, text: string) => {\n    trackEvent("share_clicked");'
)

with open("src/utils/telegram.ts", "w") as f:
    f.write(content)
