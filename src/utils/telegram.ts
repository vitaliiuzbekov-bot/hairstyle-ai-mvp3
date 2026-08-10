export const shareToTelegram = (url: string, text: string) => {
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
    if (tg) {
        try {
            if (url.startsWith('https://t.me/') && tg.openTelegramLink) {
                tg.openTelegramLink(url);
            } else if (tg.openLink) {
                tg.openLink(url);
            } else {
                window.open(url, "_blank");
            }
        } catch (e) {
            window.open(url, "_blank");
        }
    } else {
        window.open(url, "_blank");
    }
};
