const fs = require('fs');
const file = 'src/server/routes/analysis.ts';
let code = fs.readFileSync(file, 'utf8');

const regexEnd = /logToTelegram\(\`🔍 <b>Анализ лица \(\$\{req\.body\.userId \|\| 'unknown'\}\)<\/b>\\nУспешно\.\`\)\.catch\(console\.error\);\s*res\.json\(parsedResults\);\s*\} catch \(err: any\) \{\s*console\.error\(err\);\s*let errorMsg = err\.message \|\| "Ошибка при анализе фото";\s*if \(typeof errorMsg === "string" && errorMsg\.trim\(\)\.startsWith\("\{"\)\) \{\s*try \{\s*const parsed = JSON\.parse\(errorMsg\);\s*errorMsg = parsed\.error\?\.message \|\| errorMsg;\s*\} catch\(e\) \{\}\s*\}\s*if \(typeof errorMsg === "object"\) errorMsg = JSON\.stringify\(errorMsg\);\s*logToTelegram\(\`❌ <b>Ошибка Анализа Лица \(\$\{req\.body\.userId \|\| 'unknown'\}\)<\/b>\\n<code>\$\{errorMsg\}<\/code>\`\)\.catch\(console\.error\);\s*res\.status\(500\)\.json\(\{ error: errorMsg \}\);\s*\}\s*\}\);/s;

const replacement = `logToTelegram(\`🔍 <b>Анализ лица (\${req.body.userId || 'unknown'})</b>\\nУспешно.\`).catch(console.error);
    
    analyzeJobMap.set(jobId, { status: 'completed', result: parsedResults });
  } catch (err: any) {
    console.error(err);
    let errorMsg = err.message || "Ошибка при анализе фото";
    if (typeof errorMsg === "string" && errorMsg.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(errorMsg);
        errorMsg = parsed.error?.message || errorMsg;
      } catch(e) {}
    }
    if (typeof errorMsg === "object") errorMsg = JSON.stringify(errorMsg);
    logToTelegram(\`❌ <b>Ошибка Анализа Лица (\${req.body.userId || 'unknown'})</b>\\n<code>\${errorMsg}</code>\`).catch(console.error);
    analyzeJobMap.set(jobId, { status: 'error', error: errorMsg });
  }
    })(); // end IIFE

    res.json({ jobId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Pipeline error" });
  }
});`;

code = code.replace(regexEnd, replacement);
fs.writeFileSync(file, code);
console.log("patched 2");
