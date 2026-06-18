import { useState, useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useUI } from "../context/UIContext";
import { getHistory } from "../services/localHistory";

export const useTokenManager = () => {
  const { addToast } = useUI();
  const [generationsLeft, setGenerationsLeft] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(() => {
    const isDevUrl = typeof window !== "undefined" && (
      window.location.hostname.includes("localhost")
    );
    return isDevUrl || localStorage.getItem("isDeveloperMode") === "true";
  });

  const tg = (window as any).Telegram?.WebApp as any;
  const isTelegramEnv = !!tg?.initDataUnsafe?.user;

  useEffect(() => {
    const initUser = async () => {
      // Async load local history immediately
      let localHistory: any[] = [];
      try {
        localHistory = await getHistory();
        setHistory(localHistory);
      } catch (e) {
        console.error(e);
      }

      let currentUid = null;
      let tgUser = tg?.initDataUnsafe?.user;

      try {
        const userCred = (await Promise.race([
          signInAnonymously(auth),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 5000),
          ),
        ])) as any;
        if (userCred && userCred.user) {
          currentUid = userCred.user.uid;
        }
      } catch (e) {
        console.warn("Auth warning (timeout expected in dev):", e);
      }

      if (!currentUid) {
        currentUid = "local-user";
      }

      setUserId(currentUid);

      const isDevUrl = typeof window !== "undefined" && (
        window.location.hostname.includes("localhost")
      );

      // Identify developer by hardcoded Telegram UID or any known Dev signature
      const isDevUser = 
        currentUid === "8585130589" || 
        tgUser?.id?.toString() === "8585130589" ||
        tgUser?.username?.toLowerCase() === "vitalii_uzbekov" ||
        isDevUrl ||
        localStorage.getItem("isDeveloperMode") === "true";

      if (isDevUser) {
        setIsDeveloper(true);
        localStorage.setItem("isDeveloperMode", "true");
      }

      if (currentUid === "local-user") {
        const localGens = localStorage.getItem("localGenerationsLeft");
        if (localGens === null) {
          const startingVal = isDevUser ? "999" : "0";
          localStorage.setItem("localGenerationsLeft", startingVal);
          setGenerationsLeft(parseInt(startingVal, 10));
        } else {
          setGenerationsLeft(isDevUser ? 999 : parseInt(localGens, 10));
        }
      }

      try {
        const userRef = doc(db, "users", currentUid);
        let userDoc;
        try {
          userDoc = (await Promise.race([
            getDoc(userRef),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 5000),
            ),
          ])) as import("firebase/firestore").DocumentSnapshot;
        } catch (e: any) {
           console.warn(`getDoc failed: ${e.message || e}.`);
           throw new Error("fallback_to_local");
        }

        if (!userDoc || !userDoc.exists()) {
          const startParam = tg?.initDataUnsafe?.start_param;
          let referredBy = null;
          let startGens = isDevUser ? 999 : 0;
          
          if (startParam && startParam.startsWith("ref_")) {
             const referrerId = startParam.substring(4);
             if (referrerId !== currentUid) {
                referredBy = referrerId;
                startGens = 1; // Bonus for the new user!
                try {
                  const refUserDoc = doc(db, "users", referrerId);
                  updateDoc(refUserDoc, {
                     generationsLeft: increment(1)
                  }).catch(() => {});
                  
                 fetch("/api/log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      level: "info",
                      message: `🎁 <b>Реферал!</b> Пользователь ${tgUser?.username || "anon"} пришел от ${referrerId}`,
                    }),
                  }).catch(() => {});

                } catch(e) {}
             }
          }

          setGenerationsLeft(startGens);

          try {
            setDoc(userRef, {
              generationsLeft: startGens,
              createdAt: serverTimestamp(),
              ...(tgUser?.id ? { tgId: tgUser.id } : {}),
              ...(tgUser?.username ? { tgUsername: tgUser.username } : {}),
              ...(referredBy ? { referredBy } : {})
            }).catch(createErr => {
               console.warn("Background setDoc failed:", createErr?.message || createErr);
            });
            
            fetch("/api/log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                level: "info",
                message: `👋 <b>Новый пользователь</b>\nUsername: ${tgUser?.username || "нет"}\nID: ${currentUid}`,
                userId: currentUid,
              }),
            }).catch(console.error);
          } catch (createErr: any) {
             console.warn("setDoc create dispatch failed:", createErr?.message || createErr);
          }
        } else {
          const data = userDoc.data();
          setGenerationsLeft(isDevUser ? 999 : (data?.generationsLeft ?? 0));
          
          // Фоновая синхронизация истории (тихая)
          const cloudHistoryStr = data?.historyCache;
          if (cloudHistoryStr) {
            try {
              const cloudHistory = JSON.parse(cloudHistoryStr);
              if (Array.isArray(cloudHistory) && cloudHistory.length > localHistory.length) {
                // Если в облаке больше элементов (например, зашел с другого устройства),
                // обогащаем локальную историю
                const existingUrls = new Set(localHistory.map(h => h.originalUrl || h.url));
                const newItems = cloudHistory.filter(h => !(existingUrls.has(h.originalUrl || h.url)));
                if (newItems.length > 0) {
                  const mergedHistory = [...newItems, ...localHistory].sort((a,b) => b.timestamp - a.timestamp);
                  setHistory(mergedHistory);
                  import('../services/localHistory').then(m => m.saveHistory(mergedHistory));
                }
              }
            } catch (e) {
              console.warn("Failed to parse cloud history", e);
            }
          }
        }
      } catch (err: any) {
        if (err.message !== "fallback_to_local") {
          console.error("Firebase Init Error", err);
        }
        const localGens = localStorage.getItem("localGenerationsLeft");
        if (localGens === null) {
          const startingVal = isDevUser ? "999" : "0";
          localStorage.setItem("localGenerationsLeft", startingVal);
          setGenerationsLeft(parseInt(startingVal, 10));
        } else {
          setGenerationsLeft(isDevUser ? 999 : parseInt(localGens, 10));
        }
        setUserId(isDevUser ? "8585130589" : "local-user");
        setInitError(null);
      }
    };

    initUser();

    const handleDailyReward = () => {
      setGenerationsLeft((prev) => (prev !== null ? prev + 1 : 1));
    };

    window.addEventListener("daily_reward_claimed", handleDailyReward);
    return () => {
      window.removeEventListener("daily_reward_claimed", handleDailyReward);
    };
  }, [isDeveloper]);

  const consumeToken = async () => {
    if (isDeveloper) {
      // Developers do not consume generations/tokens during testing!
      return true;
    }
    if (!userId || generationsLeft === null || generationsLeft <= 0) return false;

    if (userId === "local-user") {
      const next = generationsLeft - 1;
      setGenerationsLeft(next);
      localStorage.setItem("localGenerationsLeft", next.toString());
      return true;
    }

    // Optimistic UI update
    setGenerationsLeft((prev) => (prev ? prev - 1 : 0));

    // The backend now securely deducts the token during /api/generate-full via billing.ts.
    // We just optimistically update the UI here. We no longer write directly to Firestore to avoid double charging.
    return true;
  };

  const buyTokens = () => setShowBuyModal(true);

  const checkLimits = async () => {
    if (isDeveloper) {
      return true;
    }
    if (generationsLeft !== null && generationsLeft <= 0) {
      if (tg && tg.showPopup) {
        tg.showPopup(
          {
            title: "Закончились генерации",
            message: "Пополните баланс, чтобы продолжить использование.",
            buttons: [{ type: "ok", id: "ok" }],
          },
          () => {
            buyTokens();
          },
        );
      } else {
        addToast("Закончились генерации. Пополните баланс.", "error", 5000);
        buyTokens();
      }
      return false;
    }

    const success = await consumeToken();
    if (!success) return false;
    return true;
  };

  const processPayment = async (packageId: string, starsAmount: number, generationsCount: number) => {
    if (!userId) return;

    setIsBuying(true);
    try {
      const tgUserId = (tg as any)?.initDataUnsafe?.user?.id;
      if (isTelegramEnv && tg && tgUserId) {
        try {
           await fetch('/api/set-telegram-webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ webAppUrl: window.location.origin })
           });
        } catch(e) {
           console.error("Failed to setup webhook", e);
        }

        const response = await fetch("/api/create-invoice", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-Telegram-Init-Data": (tg as any)?.initData || ""
          },
          body: JSON.stringify({ userId, tgUserId, packageId }),
        });
        const text = await response.text();
        let data: any = {};
        try { data = JSON.parse(text); } catch(e){}
        if (!response.ok || !data.invoiceUrl) {
          throw new Error(data.error || "Ошибка при создании счета");
        }

        if (tg.openInvoice) {
          tg.openInvoice(data.invoiceUrl, async (status: string) => {
            if (status === "paid") {
              if (userId === "local-user") {
                const next = (generationsLeft || 0) + generationsCount;
                localStorage.setItem("localGenerationsLeft", next.toString());
                setGenerationsLeft(next);
              } else {
                // Generates left updated by bot webhook, but we manually increase here for UI sync
                setGenerationsLeft((prev) => (prev || 0) + generationsCount);
              }
              
              fetch("/api/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  level: "info",
                  message: `💰 Оплата успешно завершена (Пакет: ${packageId}, ${starsAmount} Stars) [Ждем Webhook]`,
                  userId,
                }),
              }).catch(console.error);

              setShowBuyModal(false);
              tg.showAlert(`Успешно! Добавлено генераций: ${generationsCount}`);
            } else {
              fetch("/api/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  level: "warn",
                  message: `Оплата отменена или не прошла, статус: ${status}`,
                  userId,
                }),
              }).catch(console.error);
            }
          });
        } else {
           alert("Невозможно открыть счет. Пожалуйста, обновите Telegram.");
        }
      } else {
        // Режим симуляции оплаты (Вне Telegram)
        const confirmPay = window.confirm(
          `💳 Режим разработки / тестирования (Вне Telegram)\n\nХотите симулировать успешную оплату пакета "${packageId}" в размере ${starsAmount} ⭐?\n\nВам будет начислено +${generationsCount} генераций.`
        );
        if (confirmPay) {
          if (userId === "local-user") {
            const next = (generationsLeft || 0) + generationsCount;
            localStorage.setItem("localGenerationsLeft", next.toString());
            setGenerationsLeft(next);
          } else {
            try {
              const userRef = doc(db, "users", userId);
              await updateDoc(userRef, {
                generationsLeft: increment(generationsCount),
                fullAccess: true
              });
            } catch (e) {
              console.warn("Could not write mock purchase to Firestore", e);
            }
            setGenerationsLeft((prev) => (prev || 0) + generationsCount);
          }
          alert(`Успешно начислено +${generationsCount} генераций!`);
          setShowBuyModal(false);
        }
      }
    } catch (err: any) {
      console.error("Error creating invoice: ", err);
      const fallbackPrompt = "Оплата Stars временно недоступна на стороне Telegram. В качестве извинения, начислить вам 1 бесплатную генерацию?";
      
      const applyFallback = async () => {
        if (userId === "local-user") {
          const next = (generationsLeft || 0) + 1;
          localStorage.setItem("localGenerationsLeft", next.toString());
          setGenerationsLeft(next);
        } else {
          try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { generationsLeft: increment(1) });
          } catch (e) {
             console.warn("Could not write fallback to Firestore", e);
          }
          setGenerationsLeft((prev) => (prev || 0) + 1);
        }
        setShowBuyModal(false);
      };

      if (tg && tg.showConfirm) {
         tg.showConfirm(fallbackPrompt, (confirmed: boolean) => {
             if (confirmed) {
                 applyFallback();
             }
         });
      } else {
        if (window.confirm(fallbackPrompt)) {
           applyFallback();
        }
      }
    } finally {
      setIsBuying(false);
    }
  };

  useEffect(() => {
    if (userId && userId !== "local-user" && history.length > 0) {
      const lightweightHistory = history.map(h => ({
        url: h.url?.startsWith('data:image') || h.url?.startsWith('blob:') ? '' : h.url,
        originalUrl: h.originalUrl?.startsWith('data:image') || h.originalUrl?.startsWith('blob:') ? '' : h.originalUrl,
        keyword: h.keyword,
        timestamp: h.timestamp
      })).filter(h => h.originalUrl || h.url);
      
      if (lightweightHistory.length > 0) {
        try {
           const userRef = doc(db, "users", userId);
           updateDoc(userRef, { historyCache: JSON.stringify(lightweightHistory) }).catch(() => {});
        } catch (e) {
           console.warn("Failed to sync history to cloud", e);
        }
      }
    }
  }, [history, userId]);

  return {
    generationsLeft,
    setGenerationsLeft,
    history,
    setHistory,
    userId,
    initError,
    consumeToken,
    buyTokens,
    checkLimits,
    processPayment,
    isBuying,
    showBuyModal,
    setShowBuyModal,
    isTelegramEnv,
    isDeveloper,
    setIsDeveloper
  };
};
