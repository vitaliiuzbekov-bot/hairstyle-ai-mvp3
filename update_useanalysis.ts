          // --- ШАГ 1: ЛОКАЛЬНЫЙ АНАЛИЗ (CLIENT-SIDE INFERENCE) ---
          let localStats: AnalysisResult | null = null;
          const isProMode = localStorage.getItem("isProMode") === "true";
          try {
             if (isProMode) {
                // fast mock for pro mode tests
                localStats = {
                    gender: "female",
                    faceShape: "Овальное",
                    ageRange: "20-30",
                    skinTone: "Светлый",
                    hairColor: "Русый",
                    hairLength: "Средние",
                    hairDensity: "Средняя",
                    hairType: "Прямые",
                    recommendations: []
                };
             } else {
                localStats = await fallbackFaceApiWrapper(imageBase64, mimeType);
             }
          } catch(e) {
              console.warn("FaceAPI failed, falling back to pure server...", e);
          }
