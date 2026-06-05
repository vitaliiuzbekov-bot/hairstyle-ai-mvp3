export const shareResult = (url: string) => {
  const tg = window.Telegram?.WebApp;
  if (tg && tg.switchInlineQuery) {
    tg.switchInlineQuery(url, ["users", "groups", "channels"]);
  } else if (navigator.share) {
    navigator
      .share({
        title: "Мой новый стиль",
        text: "Посмотри на мой новый стиль от НейроСтилиста!",
        url: url,
      })
      .catch(console.error);
  } else {
    alert(
      "Поделиться можно только в приложении Telegram или браузере с поддержкой Web Share API.",
    );
  }
};
