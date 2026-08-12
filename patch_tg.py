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
    if (url.includes("neirostilist_bot")) {
        if (tg) {
            tg.close();
            return;
        }
    }

    if (tg && tg.openTelegramLink && url.startsWith("https://t.me/")) {
        try {
            tg.openTelegramLink(url);
            return; // Stop here if it succeeds (or is intercepted by TG)
        } catch (e) {
            // fallback
        }
    }

    // Fallback for non-telegram links or if openTelegramLink fails
    try {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (e) {
        window.location.href = url;
    }
};
"""

import re
content = re.sub(r'export const openUrlInTelegram = \(url: string\) => \{.*?\};', new_func, content, flags=re.DOTALL)

with open("src/utils/telegram.ts", "w") as f:
    f.write(content)
