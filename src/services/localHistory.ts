import { get, set } from 'idb-keyval';

export interface HistoryItem {
  url: string;
  originalUrl?: string;
  blob?: Blob;
  originalBlob?: Blob;
  keyword: string;
  timestamp: number;
}

const HISTORY_KEY = 'neurostylist_history';

// A helper to sync to Telegram CloudStorage if available
const syncToTelegramCloud = async (history: HistoryItem[]) => {
  const tg = (window as any).Telegram?.WebApp as any;
  if (!tg?.isVersionAtLeast?.('6.9') || !tg?.CloudStorage) return;
  // Limit to 5 items without base64 to fit in CloudStorage limits
  const lightweightHistory = history.slice(0, 5).map(h => ({
    ...h,
    url: h.url.startsWith('data:image') || h.url.startsWith('blob:') ? '' : h.url,
    originalUrl: h.originalUrl?.startsWith('data:image') || h.originalUrl?.startsWith('blob:') ? '' : h.originalUrl,
    blob: undefined,
    originalBlob: undefined
  }));
  tg.CloudStorage.setItem('tga_history', JSON.stringify(lightweightHistory), () => {});
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const history = await get<HistoryItem[]>(HISTORY_KEY);
    
    // If no history in IndexedDB, try to restore from Telegram CloudStorage
    if (!history || history.length === 0) {
        return await new Promise<HistoryItem[]>((resolve) => {
            const tg = (window as any).Telegram?.WebApp as any;
            if (tg?.isVersionAtLeast?.('6.9') && tg?.CloudStorage) {
                tg.CloudStorage.getItem('tga_history', (err: any, value: string) => {
                    if (value) {
                         try { 
                           const parsed = JSON.parse(value);
                           // Save it back to local IDB
                           set(HISTORY_KEY, parsed).catch(console.error);
                           resolve(parsed); 
                         } catch(e) { resolve([]); }
                    } else {
                         // Fallback to localStorage
                         try {
                           const localData = JSON.parse(localStorage.getItem('localHistory') || '[]');
                           resolve(localData);
                         } catch {
                           resolve([]);
                         }
                    }
                });
            } else {
                try {
                  const localData = JSON.parse(localStorage.getItem('localHistory') || '[]');
                  resolve(localData);
                } catch {
                  resolve([]);
                }
            }
        });
    }

    // Revive blob URLs
    return history.map(item => {
      let finalUrl = item.url;
      let finalOriginalUrl = item.originalUrl;
      
      if (item.blob) {
        finalUrl = URL.createObjectURL(item.blob);
      }
      if (item.originalBlob) {
        finalOriginalUrl = URL.createObjectURL(item.originalBlob);
      }

      return {
        ...item,
        url: finalUrl,
        originalUrl: finalOriginalUrl
      };
    });
  } catch (error) {
    console.error("Failed to load history from IndexedDB", error);
    try {
      return JSON.parse(localStorage.getItem('localHistory') || '[]');
    } catch {
      return [];
    }
  }
};

const base64ToBlob = async (base64Data: string): Promise<Blob> => {
  const fetchRes = await fetch(base64Data);
  return await fetchRes.blob();
};

export const saveHistory = async (history: HistoryItem[]): Promise<void> => {
  try {
    // Before saving to IDB, convert any new base64 data URIs to Blobs
    const historyToSave = await Promise.all(history.map(async (item) => {
      let blob = item.blob;
      let originalBlob = item.originalBlob;

      if (!blob && item.url && item.url.startsWith('data:image')) {
        blob = await base64ToBlob(item.url);
      }
      if (!originalBlob && item.originalUrl && item.originalUrl.startsWith('data:image')) {
        originalBlob = await base64ToBlob(item.originalUrl);
      }

      // Do NOT store blob: URLs, as they are un-revivable. Store empty strings or keep logic simple.
      // Wait, we still need `url` for external links. If `blob` exists, `url` can just be a placeholder.
      return {
        ...item,
        url: blob ? '' : item.url, // Clear data URI / blob URL so we don't store it
        originalUrl: originalBlob ? '' : item.originalUrl,
        blob,
        originalBlob
      };
    }));

    await set(HISTORY_KEY, historyToSave);
    
    // Sync option B: Telegram Cloud Storage
    syncToTelegramCloud(historyToSave).catch(console.error);

    // Keep a subset in localStorage just as a backup
    const lightweightHistory = historyToSave.slice(0, 5).map(h => ({
      ...h,
      url: h.url.startsWith('data:image') || h.url.startsWith('blob:') ? '' : h.url,
      originalUrl: h.originalUrl?.startsWith('data:image') || h.originalUrl?.startsWith('blob:') ? '' : h.originalUrl,
      blob: undefined,
      originalBlob: undefined
    }));
    localStorage.setItem('localHistoryLight', JSON.stringify(lightweightHistory));
  } catch (error) {
    console.error("Failed to save history to IndexedDB", error);
    try {
      localStorage.setItem('localHistory', JSON.stringify(history));
    } catch (e) {
      console.error("LocalStorage quota exceeded too");
    }
  }
};

export const addHistoryItem = async (item: HistoryItem): Promise<HistoryItem[]> => {
  const history = await getHistory();
  const newHistory = [item, ...history];
  await saveHistory(newHistory);
  // Re-fetch to guarantee object URLs are correct
  return await getHistory();
};

export const removeHistoryItem = async (timestamp: number, url: string): Promise<HistoryItem[]> => {
  const history = await getHistory();
  // We need to match on timestamp or url
  const newHistory = history.filter(
    (item) => item.timestamp !== timestamp
  );
  await saveHistory(newHistory);
  return await getHistory();
};
