import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;
    
    const count = parseInt(document.body.dataset.scrollLock || '0', 10) || 0;
    document.body.dataset.scrollLock = (count + 1).toString();
    document.body.style.overflow = 'hidden';
    
    return () => {
      const currentCount = parseInt(document.body.dataset.scrollLock || '0', 10) || 0;
      const newCount = Math.max(0, currentCount - 1);
      document.body.dataset.scrollLock = newCount.toString();
      
      if (newCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isLocked]);
};
