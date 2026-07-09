const fs = require('fs');
const content = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const target = `    const loadMoreRecommendations = useCallback(async () => {
        if ((!imageBase64 && !imageUrl) || !results) return;

        setIsLoadingMore(true);
        setError(null);

        const existingNames = results.recommendations.map((r) => r.name);

        try {
          const data = await loadMoreApi(userId, existingNames, results, preferredStyle, telegramInitData);

          if (data.recommendations) {
            setResults((prev) =>
              prev
                ? {
                    ...prev,
                    recommendations: [
                      ...prev.recommendations,
                      ...data.recommendations,
                    ],
                  }
                : prev,
            );
          } else {
            throw new Error("Модель не вернула результат.");
          }
        } catch (err: any) {
          console.error("AI Load More Error:", err);
          setError(err?.message || "Ошибка при генерации новых вариантов.");
        } finally {
          setIsLoadingMore(false);
        }
    }, [imageBase64, imageUrl, results, userId, preferredStyle, telegramInitData, setError]);`;

const replacement = `    const loadMoreRecommendations = useCallback(async (mode: 'library' | 'ai' = 'ai') => {
        if ((!imageBase64 && !imageUrl) || !results) return;

        if (mode === 'library') {
             const { FEMALE_LIBRARY, MALE_LIBRARY } = await import('../data/haircutLibrary');
             const isFemale = results.gender === "female" || results.gender?.includes("жен") || results.gender?.includes("woman");
             const library = isFemale ? FEMALE_LIBRARY : MALE_LIBRARY;
             const existingNames = results.recommendations.map((r) => r.name);
             const available = library.filter(item => !existingNames.includes(item.name));
             const shuffled = [...available].sort(() => 0.5 - Math.random());
             const selected = shuffled.slice(0, 3);
             
             if (selected.length > 0) {
                 const newRecs = selected.map(item => ({
                     name: item.name,
                     description: item.description,
                     matchReason: item.stylingTips,
                     imageKeyword: item.name
                 }));
                 setResults((prev) => prev ? { ...prev, recommendations: [...prev.recommendations, ...newRecs] } : prev);
                 addToast("Добавлены бесплатные варианты из библиотеки", "success");
                 hapticNotification("success");
             } else {
                 addToast("Все варианты из библиотеки уже показаны", "info");
             }
             return;
        }

        const hasAccess = await checkLimits();
        if (!hasAccess) {
            setShowBuyModal(true);
            return;
        }

        setIsLoadingMore(true);
        setError(null);

        const existingNames = results.recommendations.map((r) => r.name);

        try {
          const data = await loadMoreApi(userId, existingNames, results, preferredStyle, telegramInitData);

          if (data.recommendations) {
            await consumeToken();
            addToast("Сгенерированы новые варианты от ИИ", "success");
            setResults((prev) =>
              prev
                ? {
                    ...prev,
                    recommendations: [
                      ...prev.recommendations,
                      ...data.recommendations,
                    ],
                  }
                : prev,
            );
          } else {
            throw new Error("Модель не вернула результат.");
          }
        } catch (err: any) {
          console.error("AI Load More Error:", err);
          setError(err?.message || "Ошибка при генерации новых вариантов.");
          addToast("Ошибка генерации ИИ", "error");
        } finally {
          setIsLoadingMore(false);
        }
    }, [imageBase64, imageUrl, results, userId, preferredStyle, telegramInitData, setError, checkLimits, setShowBuyModal, consumeToken]);`;

fs.writeFileSync('src/hooks/useAnalysis.ts', content.replace(target, replacement));
