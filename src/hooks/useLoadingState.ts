import { useState, useEffect } from 'react';

export const useLoadingState = (totalTimeMs: number = 20000, intervalMs: number = 200) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);

    const increment = 100 / (totalTimeMs / intervalMs);
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        return prev + increment;
      });
    }, intervalMs);

    return () => {
      clearInterval(progressInterval);
    };
  }, [totalTimeMs, intervalMs]);

  return { progress };
};
