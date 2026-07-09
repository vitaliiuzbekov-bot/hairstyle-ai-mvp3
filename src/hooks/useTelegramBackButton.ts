import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type BackHandler = () => void;
const backHandlersStack: BackHandler[] = [];

export const useTelegramBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tg = (window as any).Telegram?.WebApp;

  useEffect(() => {
    if (!tg || !tg.BackButton) return;

    const handleGlobalBack = () => {
      if (backHandlersStack.length > 0) {
        // Call the latest handler in the stack
        const handler = backHandlersStack[backHandlersStack.length - 1];
        handler();
      } else {
        // Default behavior: go back in history
        if (location.pathname !== '/' && location.pathname !== '') {
           navigate(-1);
        }
      }
    };

    tg.BackButton.onClick(handleGlobalBack);

    const updateVisibility = () => {
        if (backHandlersStack.length > 0 || (location.pathname !== '/' && location.pathname !== '')) {
            tg.BackButton.show();
        } else {
            tg.BackButton.hide();
        }
    };

    updateVisibility();
    (window as any)._updateTgBackButtonVisibility = updateVisibility;

    return () => {
        tg.BackButton.offClick(handleGlobalBack);
    };
  }, [location.pathname, navigate]);
};

export const useModalBackButton = (isOpen: boolean, onClose: () => void) => {
    useEffect(() => {
        if (!isOpen) return;
        const tg = (window as any).Telegram?.WebApp;
        if (!tg || !tg.BackButton) return;

        backHandlersStack.push(onClose);
        if ((window as any)._updateTgBackButtonVisibility) {
            (window as any)._updateTgBackButtonVisibility();
        }

        return () => {
            const index = backHandlersStack.indexOf(onClose);
            if (index > -1) {
                backHandlersStack.splice(index, 1);
            }
            if ((window as any)._updateTgBackButtonVisibility) {
                (window as any)._updateTgBackButtonVisibility();
            }
        };
    }, [isOpen, onClose]);
};
