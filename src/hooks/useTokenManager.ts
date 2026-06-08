import { useState, useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const useTokenManager = () => {
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

  const tg = window.Telegram?.WebApp;
  const isTelegramEnv = !!tg?.initDataUnsafe?.user;

  useEffect(() => {
    const initUser = async () => {
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
        try {
          const localHistory = JSON.parse(
            localStorage.getItem("localHistory") || "[]",
          );
          setHistory(localHistory);
        } catch (e) {}
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

          try {
            await Promise.race([
              setDoc(userRef, {
                generationsLeft: startGens,
                createdAt: serverTimestamp(),
                history: [],
                ...(tgUser?.id ? { tgId: tgUser.id } : {}),
                ...(tgUser?.username ? { tgUsername: tgUser.username } : {}),
                ...(referredBy ? { referredBy } : {})
              }),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 5000),
              ),
            ]);
            setGenerationsLeft(startGens);
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
             console.warn("setDoc create failed:", createErr?.message || createErr);
             throw new Error("fallback_to_local");
          }
        } else {
          const data = userDoc.data();
          setGenerationsLeft(isDevUser ? 999 : (data?.generationsLeft ?? 0));
          setHistory(data?.history ?? []);
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
        try {
          const localHistory = JSON.parse(
            localStorage.getItem("localHistory") || "[]",
          );
          setHistory(localHistory);
        } catch (e) {}
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

    try {
      const userRef = doc(db, "users", userId);
      await Promise.race([
        updateDoc(userRef, { generationsLeft: increment(-1) }),
        new Promise((_, reject) => setTimeout(() => reject("timeout"), 5000)),
      ]);
      setGenerationsLeft((prev) => (prev ? prev - 1 : 0));
      return true;
    } catch (err: any) {
      console.warn("Failed to consume token via DB. Falling back to local storage.", err);
      const next = generationsLeft - 1;
      setGenerationsLeft(next);
      localStorage.setItem("localGenerationsLeft", next.toString());
      return true;
    }
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
        alert("Закончились генерации. Пополните баланс.");
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, tgUserId, packageId }),
        });
        const data = await response.json();
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
      if (tg && tg.showAlert) {
        if (err.message && err.message.includes("bot owner")) {
           tg.showAlert("Оплата временно недоступна. Владелец бота еще не принял условия.");
        } else {
           tg.showAlert(err.message || "Ошибка при оплате");
        }
      } else {
        alert("Ошибка создания счета: " + (err.message || "Неизвестная ошибка"));
      }
    } finally {
      setIsBuying(false);
    }
  };

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
