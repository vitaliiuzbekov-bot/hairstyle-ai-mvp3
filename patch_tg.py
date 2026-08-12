import sys

with open("src/utils/telegram.ts", "r") as f:
    content = f.read()

new_func = """
export const openUrlInTelegram = (url: string) => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred("light");
    }
    
    // If the URL is exactly the bot we are in, just close the webapp to return to the chat
    if (url === "https://t.me/neirostilist_bot" || url === "https://t.me/neirostilist_bot/") {
        if (tg) {
            tg.close();
            return;
        }
    }

    if (tg) {
        try {
            if (tg.openTelegramLink && url.startsWith("https://t.me/")) {
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
};
"""

import re
content = re.sub(r'export const openUrlInTelegram = \(url: string\) => \{.*?\};', new_func, content, flags=re.DOTALL)

with open("src/utils/telegram.ts", "w") as f:
    f.write(content)
