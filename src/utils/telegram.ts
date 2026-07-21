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
