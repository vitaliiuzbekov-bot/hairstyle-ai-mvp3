import { useState, useEffect } from 'react';

export const useTelegram = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const [telegramInitData, setTelegramInitData] = useState<string | undefined>(undefined);
  const tg = (window as any).Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready?.();
      tg.expand?.();
      if (tg.disableVerticalSwipes) {
         tg.disableVerticalSwipes();
      }
      setTelegramInitData(tg.initData);

      const updateTheme = () => {
        if (tg.colorScheme === 'light') {
          setIsLightMode(true);
        } else if (tg.colorScheme === 'dark') {
          setIsLightMode(false);
        }
      };

      updateTheme();
      tg.onEvent?.('themeChanged', updateTheme);

      return () => {
        tg.offEvent?.('themeChanged', updateTheme);
      };
    }
  }, []);

  const shareResult = (url: string) => {
    if (tg && tg.switchInlineQuery) {
      tg.switchInlineQuery(url, ["users", "groups", "channels"]);
    } else if (navigator.share) {
      navigator
        .share({
          title: "Мой стиль от НейроСтилиста",
          text: "Посмотри, как мне идет этот образ!",
          url: url,
        })
        .catch(console.error);
    } else {
      alert(
        "Поделиться можно только в приложении Telegram или браузере с поддержкой Web Share API."
      );
    }
  };

  const getCloudStorage = async (key: string): Promise<string | null> => {
    if (!tg?.isVersionAtLeast?.('6.9') || !tg?.CloudStorage) return null;
    return new Promise((resolve, reject) => {
      tg.CloudStorage.getItem(key, (err: any, value: string) => {
        if (err) resolve(null);
        else resolve(value);
      });
    });
  };

  const setCloudStorage = async (key: string, value: string): Promise<boolean> => {
    if (!tg?.isVersionAtLeast?.('6.9') || !tg?.CloudStorage) return false;
    return new Promise((resolve) => {
      tg.CloudStorage.setItem(key, value, (err: any, saved: boolean) => {
        if (err || !saved) resolve(false);
        else resolve(true);
      });
    });
  };

  return {
    tg,
    isLightMode,
    setIsLightMode,
    telegramInitData,
    shareResult,
    getCloudStorage,
    setCloudStorage
  };
};
