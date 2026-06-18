import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { defaultFaqData } from "../data/faq";

interface UIContextType {
  isProfileOpen: boolean;
  setIsProfileOpen: (val: boolean) => void;
  isFaqOpen: boolean;
  setIsFaqOpen: (val: boolean) => void;
  faqData: any[];
  setFaqData: (val: any[]) => void;
  showWelcome: boolean;
  setShowWelcome: (val: boolean) => void;
  showSalonNameInput: boolean;
  setShowSalonNameInput: (val: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  chatStyleName: string;
  setChatStyleName: (val: string) => void;
  isCameraModalOpen: boolean;
  setIsCameraModalOpen: (val: boolean) => void;

  // Toasts
  toasts: ToastType[];
  addToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
  removeToast: (id: string) => void;
}

export type ToastType = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [faqData, setFaqData] = useState<any[]>(defaultFaqData);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSalonNameInput, setShowSalonNameInput] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStyleName, setChatStyleName] = useState("");
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");
    if (!welcomeShown) {
      setShowWelcome(true);
    }
    
    // Check Telegram CloudStorage just in case it was seen on another device
    const tg = (window as any).Telegram?.WebApp as any;
    if (tg?.isVersionAtLeast?.('6.9') && tg?.CloudStorage) {
      tg.CloudStorage.getItem('welcomeShown', (err, value) => {
        if (!err && value === 'true' && showWelcome) {
          setShowWelcome(false);
          localStorage.setItem("welcomeShown", "true");
        }
      });
    }
  }, []);

  const addToast = (message: string, type: "success" | "error" | "info" = "info", duration: number = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        isProfileOpen,
        setIsProfileOpen,
        isFaqOpen,
        setIsFaqOpen,
        faqData,
        setFaqData,
        showWelcome,
        setShowWelcome,
        showSalonNameInput,
        setShowSalonNameInput,
        isChatOpen,
        setIsChatOpen,
        chatStyleName,
        setChatStyleName,
        isCameraModalOpen,
        setIsCameraModalOpen,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};
