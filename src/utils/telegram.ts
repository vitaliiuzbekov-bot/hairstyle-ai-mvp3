import { trackEvent } from "../services/analytics";
export const shareToTelegram = (url: string, text: string) => {
    trackEvent("share_clicked");
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    const tg = window.Telegram?.WebApp;
    if (tg) {
        try {
            if (tg.openTelegramLink) {
                tg.openTelegramLink(shareUrl);
            } else if (tg.openLink) {
                tg.openLink(shareUrl);
            } else {
                window.open(shareUrl, "_blank");
            }
        } catch (e) {
            window.open(shareUrl, "_blank");
        }
    } else {
        window.open(shareUrl, "_blank");
    }
};



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

    // The most reliable way to open a link in all versions of Telegram Mini Apps
    // is to create a physical anchor tag in the DOM and trigger a click on it,
    // allowing the TMA webview to intercept it natively.
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


