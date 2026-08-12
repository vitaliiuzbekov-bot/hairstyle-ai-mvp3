import sys

with open("src/hooks/useTokenManager.ts", "r") as f:
    content = f.read()

replacement = """
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
                  fetch("/api/add-tokens", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: referrerId, amount: 1, reason: "referral" })
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

          const sourceData: any = {};
          if (startParam) {
            sourceData.source = startParam;
            sourceData.last_source = startParam;
          }

          setGenerationsLeft(startGens);
          try {
            setDoc(userRef, {
              generationsLeft: startGens,
              createdAt: serverTimestamp(),
              ...sourceData,
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
          
          const startParam = tg?.initDataUnsafe?.start_param;
          if (startParam) {
            const updates: any = { last_source: startParam };
            if (!data?.source) {
              updates.source = startParam;
            }
            if (data?.last_source !== startParam || !data?.source) {
              setDoc(userRef, updates, { merge: true }).catch(err => {
                console.warn("Failed to update source", err);
              });
            }
          }

          setGenerationsLeft(isDevUser ? 999 : (data?.generationsLeft ?? 0));
"""

content = content.replace("""        if (!userDoc || !userDoc.exists()) {
          const startParam = tg?.initDataUnsafe?.start_param;
          let referredBy = null;
          let startGens = isDevUser ? 999 : 0;
          
          if (startParam && startParam.startsWith("ref_")) {
             const referrerId = startParam.substring(4);
             if (referrerId !== currentUid) {
                referredBy = referrerId;
                startGens = 1; // Bonus for the new user!
                try {
                  fetch("/api/add-tokens", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: referrerId, amount: 1, reason: "referral" })
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
          setGenerationsLeft(isDevUser ? 999 : (data?.generationsLeft ?? 0));""", replacement)

with open("src/hooks/useTokenManager.ts", "w") as f:
    f.write(content)

