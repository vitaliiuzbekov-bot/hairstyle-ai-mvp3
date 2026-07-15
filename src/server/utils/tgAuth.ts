import crypto from "crypto";

export const isAuthorizedDeveloper = (initDataHeader: string | undefined): boolean => {
  if (!initDataHeader) return false;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;

  const allowedIdsStr = process.env.DEV_TELEGRAM_USER_IDS;
  if (!allowedIdsStr) return false;
  const allowedIds = allowedIdsStr.split(",").map(id => id.trim());

  try {
    const urlParams = new URLSearchParams(initDataHeader);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${urlParams.get(key)}`).join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash) {
      return false;
    }

    const userStr = urlParams.get('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id && allowedIds.includes(user.id.toString())) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error("Error validating initData for developer mode:", err);
    return false;
  }
};
