import { useCallback } from 'react';
import { removeHistoryItem, saveHistory } from '../services/localHistory';

export const useHistoryHandlers = (
  history: any[],
  setHistory: React.Dispatch<React.SetStateAction<any[]>>,
  userId: string | null
) => {
  const deleteHistoryItem = useCallback(async (
    e: React.MouseEvent,
    itemToDelete: { url: string; keyword: string; timestamp: number }
  ) => {
    e.stopPropagation();

    // Optimistic UI update
    const newHistory = history.filter(
      (item) =>
        item.timestamp !== itemToDelete.timestamp ||
        item.url !== itemToDelete.url,
    );
    setHistory(newHistory);
    
    // Save to local IndexedDB
    try {
      await removeHistoryItem(itemToDelete.timestamp, itemToDelete.url);
    } catch (err) {
      console.warn("Failed to remove history item from local storage", err);
    }
  }, [history, setHistory]);

  return { deleteHistoryItem };
};

