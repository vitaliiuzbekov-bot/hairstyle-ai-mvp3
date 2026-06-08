export const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
  }
};

export const hapticNotification = (type: 'error' | 'success' | 'warning') => {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
  }
};

export const hapticSelection = () => {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
};
