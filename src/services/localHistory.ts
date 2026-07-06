import { get, set, del, keys } from 'idb-keyval';

export interface HistoryItem {
  url: string;
  originalUrl?: string;
  blob?: Blob;
  originalBlob?: Blob;
  keyword: string;
  timestamp: number;
}

// Один пресет стрижки
export interface HairstylePreset {
  id: string;          // стабильный ID (например, uuid)
  title: string;
  keyword: string;
  previewUrl?: string; // src для <img>, может быть objectURL
  previewBlob?: Blob;  // оригинальный Blob превью
  createdAt: number;
}

// То, как пресет хранится в IndexedDB / localStorage
type StoredHairstylePreset = Omit<HairstylePreset, 'previewBlob'> & {
  previewDataUrl?: string; // data:image/...;base64,...
};

type StoredHistoryItem = Omit<HistoryItem, 'blob' | 'originalBlob'> & {
  blobDataUrl?: string;
  originalBlobDataUrl?: string;
};

const HISTORY_KEY = 'neurostylist_history_v3';
const LOCAL_HISTORY_KEY = 'localHistory_v3';
const TELEGRAM_HISTORY_KEY = 'tga_history_v3';

const PRESET_KEY_PREFIX = 'neurostylist_preset_v1:'; // один пресет = один ключ
const LOCAL_PRESETS_KEY = 'localPresets_v1';         // упрощённый fallback список
const TELEGRAM_PRESETS_KEY = 'tga_presets_v1';

const activeObjectUrls = new Set<string>();

const isDataUrl = (v?: string) => !!v && v.startsWith('data:');
const isBlobUrl = (v?: string) => !!v && v.startsWith('blob:');

const revokeAllObjectUrls = () => {
  for (const url of activeObjectUrls) URL.revokeObjectURL(url);
  activeObjectUrls.clear();
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const res = await fetch(dataUrl);
  return await res.blob();
};

const syncTelegram = (key: string, value: unknown) => {
  const tg = (window as any).Telegram?.WebApp as any;
  if (!tg?.isVersionAtLeast?.('6.9') || !tg?.CloudStorage) return;
  tg.CloudStorage.setItem(key, JSON.stringify(value), () => {});
};

/* ---------- HISTORY (как раньше, массивом, но аккуратно с Blob) ---------- */

const normalizeHistoryItem = async (item: HistoryItem): Promise<StoredHistoryItem> => {
  let blobDataUrl: string | undefined;
  let originalBlobDataUrl: string | undefined;

  if (item.blob) blobDataUrl = await blobToDataUrl(item.blob);
  if (item.originalBlob) originalBlobDataUrl = await blobToDataUrl(item.originalBlob);

  return {
    url: blobDataUrl ? '' : item.url,
    originalUrl: originalBlobDataUrl ? '' : item.originalUrl,
    keyword: item.keyword,
    timestamp: item.timestamp,
    blobDataUrl,
    originalBlobDataUrl
  };
};

const reviveHistoryItem = async (item: StoredHistoryItem): Promise<HistoryItem> => {
  let url = item.url;
  let originalUrl = item.originalUrl;
  let blob: Blob | undefined;
  let originalBlob: Blob | undefined;

  if (item.blobDataUrl) {
    blob = await dataUrlToBlob(item.blobDataUrl);
    url = URL.createObjectURL(blob);
    activeObjectUrls.add(url);
  } else if (item.url && (isDataUrl(item.url) || isBlobUrl(item.url))) {
    blob = await dataUrlToBlob(item.url);
    url = URL.createObjectURL(blob);
    activeObjectUrls.add(url);
  }

  if (item.originalBlobDataUrl) {
    originalBlob = await dataUrlToBlob(item.originalBlobDataUrl);
    originalUrl = URL.createObjectURL(originalBlob);
    activeObjectUrls.add(originalUrl);
  } else if (item.originalUrl && (isDataUrl(item.originalUrl) || isBlobUrl(item.originalUrl))) {
    originalBlob = await dataUrlToBlob(item.originalUrl);
    originalUrl = URL.createObjectURL(originalBlob);
    activeObjectUrls.add(originalUrl);
  }

  return {
    url,
    originalUrl,
    blob,
    originalBlob,
    keyword: item.keyword,
    timestamp: item.timestamp
  };
};

export const clearHistoryObjectUrls = () => revokeAllObjectUrls();

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    revokeAllObjectUrls();

    const raw = (await get<StoredHistoryItem[]>(HISTORY_KEY)) || [];
    if (raw.length > 0) return await Promise.all(raw.map(reviveHistoryItem));

    const tg = (window as any).Telegram?.WebApp as any;
    if (tg?.isVersionAtLeast?.('6.9') && tg?.CloudStorage) {
      const fromTelegram = await new Promise<StoredHistoryItem[]>((resolve) => {
        tg.CloudStorage.getItem(TELEGRAM_HISTORY_KEY, (_err: any, value: string) => {
          if (!value) return resolve([]);
          try {
            resolve(JSON.parse(value));
          } catch {
            resolve([]);
          }
        });
      });

      if (fromTelegram.length > 0) {
        await set(HISTORY_KEY, fromTelegram);
        return await Promise.all(fromTelegram.map(reviveHistoryItem));
      }
    }

    try {
      const fallback = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]') as StoredHistoryItem[];
      return await Promise.all(fallback.map(reviveHistoryItem));
    } catch {
      return [];
    }
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
};

export const saveHistory = async (history: HistoryItem[]): Promise<void> => {
  const stored = await Promise.all(history.map(normalizeHistoryItem));
  await set(HISTORY_KEY, stored);

  const lightweight = stored.slice(0, 5).map(({ blobDataUrl, originalBlobDataUrl, ...rest }) => rest);
  localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(lightweight));
  syncTelegram(TELEGRAM_HISTORY_KEY, lightweight);
};

export const addHistoryItem = async (item: HistoryItem): Promise<HistoryItem[]> => {
  const history = await getHistory();
  await saveHistory([item, ...history]);
  return await getHistory();
};

export const removeHistoryItem = async (timestamp: number, url: string): Promise<HistoryItem[]> => {
  const history = await getHistory();
  const filtered = history.filter((item) => !(item.timestamp === timestamp && item.url === url));
  await saveHistory(filtered);
  return await getHistory();
};

/* ---------------------- PRESETS: по ключу на пресет ---------------------- */

const presetKey = (id: string) => `${PRESET_KEY_PREFIX}${id}`;

const normalizePreset = async (preset: HairstylePreset): Promise<StoredHairstylePreset> => {
  let previewDataUrl: string | undefined;

  if (preset.previewBlob) {
    previewDataUrl = await blobToDataUrl(preset.previewBlob);
  }

  return {
    id: preset.id,
    title: preset.title,
    keyword: preset.keyword,
    previewUrl: previewDataUrl ? '' : preset.previewUrl,
    createdAt: preset.createdAt,
    previewDataUrl
  };
};

const revivePreset = async (stored: StoredHairstylePreset): Promise<HairstylePreset> => {
  let previewUrl = stored.previewUrl;
  let previewBlob: Blob | undefined;

  if (stored.previewDataUrl) {
    previewBlob = await dataUrlToBlob(stored.previewDataUrl);
    previewUrl = URL.createObjectURL(previewBlob);
    activeObjectUrls.add(previewUrl);
  } else if (stored.previewUrl && (isDataUrl(stored.previewUrl) || isBlobUrl(stored.previewUrl))) {
    previewBlob = await dataUrlToBlob(stored.previewUrl);
    previewUrl = URL.createObjectURL(previewBlob);
    activeObjectUrls.add(previewUrl);
  }

  return {
    id: stored.id,
    title: stored.title,
    keyword: stored.keyword,
    previewUrl,
    previewBlob,
    createdAt: stored.createdAt
  };
};

// Получить все пресеты (читаем все ключи с нужным префиксом)
export const getHairstylePresets = async (): Promise<HairstylePreset[]> => {
  try {
    revokeAllObjectUrls();

    const allKeys = await keys(); // из idb-keyval
    const presetKeys = allKeys.filter((k) => typeof k === 'string' && (k as string).startsWith(PRESET_KEY_PREFIX)) as string[];

    const storedPresets: StoredHairstylePreset[] = [];
    for (const k of presetKeys) {
      const value = await get<StoredHairstylePreset>(k);
      if (value) storedPresets.push(value);
    }

    if (storedPresets.length > 0) {
      const revived = await Promise.all(storedPresets.map(revivePreset));

      // лёгкий список в localStorage + Telegram (только метаданные)
      const lightweight = storedPresets.map(({ previewDataUrl, ...rest }) => rest);
      localStorage.setItem(LOCAL_PRESETS_KEY, JSON.stringify(lightweight));
      syncTelegram(TELEGRAM_PRESETS_KEY, lightweight);

      return revived;
    }

    // Fallback: localStorage / Telegram (только легковесные)
    const tg = (window as any).Telegram?.WebApp as any;
    let fallbackList: StoredHairstylePreset[] = [];

    if (tg?.isVersionAtLeast?.('6.9') && tg?.CloudStorage) {
      fallbackList = await new Promise<StoredHairstylePreset[]>((resolve) => {
        tg.CloudStorage.getItem(TELEGRAM_PRESETS_KEY, (_err: any, value: string) => {
          if (!value) return resolve([]);
          try {
            resolve(JSON.parse(value));
          } catch {
            resolve([]);
          }
        });
      });
    }

    if (fallbackList.length === 0) {
      try {
        fallbackList = JSON.parse(localStorage.getItem(LOCAL_PRESETS_KEY) || '[]') as StoredHairstylePreset[];
      } catch {
        fallbackList = [];
      }
    }

    return await Promise.all(fallbackList.map(revivePreset));
  } catch (e) {
    console.error('Failed to load presets', e);
    return [];
  }
};

// Сохранить/обновить один пресет по ID
export const saveHairstylePreset = async (preset: HairstylePreset): Promise<void> => {
  const stored = await normalizePreset(preset);
  await set(presetKey(preset.id), stored);
};

// Сохранить сразу несколько пресетов (batch)
export const saveHairstylePresetsBulk = async (presets: HairstylePreset[]): Promise<void> => {
  for (const p of presets) {
    const stored = await normalizePreset(p);
    await set(presetKey(p.id), stored);
  }

  // Обновляем localStorage + Telegram лёгкой версией
  const metaList = presets.map((p) => ({
    id: p.id,
    title: p.title,
    keyword: p.keyword,
    previewUrl: p.previewUrl || '',
    createdAt: p.createdAt
  }));
  localStorage.setItem(LOCAL_PRESETS_KEY, JSON.stringify(metaList));
  syncTelegram(TELEGRAM_PRESETS_KEY, metaList);
};

// Добавить пресет (обёртка над save)
export const addHairstylePreset = async (preset: HairstylePreset): Promise<HairstylePreset[]> => {
  await saveHairstylePreset(preset);
  return await getHairstylePresets();
};

// Удалить по ID
export const removeHairstylePreset = async (id: string): Promise<HairstylePreset[]> => {
  await del(presetKey(id));
  return await getHairstylePresets();
};
