import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useTelegramBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg || !tg.BackButton) return;

    if (location.pathname === '/' || location.pathname === '') {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
    }

    const handleBack = () => {
      navigate(-1);
    };

    tg.BackButton.onClick(handleBack);

    return () => {
      tg.BackButton.offClick(handleBack);
    };
  }, [location.pathname, navigate]);
};
