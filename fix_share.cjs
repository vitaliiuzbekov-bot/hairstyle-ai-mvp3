const fs = require('fs');
let content = fs.readFileSync('src/components/ShareModal.tsx', 'utf8');

const shareModalFix = `
  const handleTelegramShare = () => {
    const url = shareUrl && !shareUrl.startsWith("data:") && !shareUrl.startsWith("blob:") ? shareUrl : botUrl;
    const shareLink = \`https://t.me/share/url?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(shareTextWithBot)}\`;
    
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.openTelegramLink) {
       tg.openTelegramLink(shareLink);
    } else {
       window.open(shareLink, "_blank");
    }
  };
`;

content = content.replace(/  const handleTelegramShare = \(\) => \{\s*const url = shareUrl && !shareUrl\.startsWith\("data:"\) && !shareUrl\.startsWith\("blob:"\) \? shareUrl : botUrl;\s*const shareLink = `https:\/\/t\.me\/share\/url\?url=\$\{encodeURIComponent\(url\)\}&text=\$\{encodeURIComponent\(shareTextWithBot\)\}`;\s*window\.open\(shareLink, "_blank"\);\s*\};/, shareModalFix.trim());

fs.writeFileSync('src/components/ShareModal.tsx', content);
