import sys

with open("src/utils/telegram.ts", "r") as f:
    content = f.read()

replacement = """export const openUrlInTelegram = (url: string) => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        try {
            if (tg.openTelegramLink) {
                tg.openTelegramLink(url);
            } else if (tg.openLink) {
                tg.openLink(url, { try_instant_view: false });
            } else {
                window.location.href = url;
            }
        } catch (e) {
            window.location.href = url;
        }
    } else {
        window.open(url, "_blank");
    }
};"""

import re
content = re.sub(r'export const openUrlInTelegram = \(url: string\) => \{.*?\};', replacement, content, flags=re.DOTALL)

with open("src/utils/telegram.ts", "w") as f:
    f.write(content)
