import re

with open('src/server/routes/generate.ts', 'r') as f:
    content = f.read()

content = content.replace("""      res.status(500).json({ error: err.message || "Pipeline error" });
      clearTimeout(timeoutId);
    } catch (e: any) {
      clearTimeout(timeoutId);
      res.status(500).json({ error: e.message });
    }
  });""", 
"""      res.status(500).json({ error: err.message || "Pipeline error" });
      clearTimeout(timeoutId);
    }
  });""")

with open('src/server/routes/generate.ts', 'w') as f:
    f.write(content)
