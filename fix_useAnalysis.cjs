const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const target = `          try {
            const { FEMALE_LIBRARY, MALE_LIBRARY } = await import('../data/haircutLibrary');
            const lib = parsedResults.gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
            const allStyles = Object.values(lib).flat();
            // Filter by preferredStyle if it's set
            let filteredStyles = allStyles;
            if (preferredStyle === "Спортивный") {
                filteredStyles = allStyles.filter(s => s.category === 'short' || s.category === 'creative');
            } else if (preferredStyle === "Деловой") {
                filteredStyles = allStyles.filter(s => s.category === 'short' || s.category === 'medium');
            } else if (preferredStyle === "Романтичный") {
                filteredStyles = allStyles.filter(s => s.category === 'medium' || s.category === 'long');
            }

            if (filteredStyles.length < 3) filteredStyles = allStyles;

            const shuffled = filteredStyles.sort(() => 0.5 - Math.random());
            const picked = shuffled.slice(0, 3).map(s => ({
              name: s.name,
              description: s.description,
              stylingTips: s.stylingTips,
              imageKeyword: s.name // this will let the UI load library images!
            }));
            parsedResults.recommendations = picked;
          } catch(e) {
            console.warn("Failed to inject library styles", e);
          }`;

const replacement = `          // Only inject initial library styles if this is a fresh analysis.
          // Otherwise, we keep the previously generated or assigned styles.
          if (!localStats) {
            try {
              const { FEMALE_LIBRARY, MALE_LIBRARY } = await import('../data/haircutLibrary');
              const lib = parsedResults.gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
              const allStyles = Object.values(lib).flat();
              
              let filteredStyles = allStyles;
              if (preferredStyle === "Спортивный") {
                  filteredStyles = allStyles.filter(s => s.category === 'short' || s.category === 'creative');
              } else if (preferredStyle === "Деловой") {
                  filteredStyles = allStyles.filter(s => s.category === 'short' || s.category === 'medium');
              } else if (preferredStyle === "Романтичный") {
                  filteredStyles = allStyles.filter(s => s.category === 'medium' || s.category === 'long');
              }

              if (filteredStyles.length < 3) filteredStyles = allStyles;

              const shuffled = filteredStyles.sort(() => 0.5 - Math.random());
              const picked = shuffled.slice(0, 3).map(s => ({
                name: s.name,
                description: s.description,
                stylingTips: s.stylingTips,
                imageKeyword: s.name
              }));
              parsedResults.recommendations = picked;
            } catch(e) {
              console.warn("Failed to inject library styles", e);
            }
          }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/hooks/useAnalysis.ts', code);
