export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        initData?: string;
        initDataUnsafe?: any;
        colorScheme?: "light" | "dark";
        themeParams?: any;
        onEvent?: (eventType: string, eventHandler: () => void) => void;
        offEvent?: (eventType: string, eventHandler: () => void) => void;
        showAlert?: (message: string) => void;
        showConfirm?: (message: string, callback?: (confirmed: boolean) => void) => void;
        isVersionAtLeast?: (version: string) => boolean;
        CloudStorage?: {
          setItem: (key: string, value: string, callback?: (err: any, success: boolean) => void) => void;
          getItem: (key: string, callback?: (err: any, value: string) => void) => void;
          removeItem: (key: string, callback?: (err: any, success: boolean) => void) => void;
          getKeys: (callback?: (err: any, keys: string[]) => void) => void;
        };
      };
    };
  }
}
