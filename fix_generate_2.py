import re

with open('src/server/routes/generate.ts', 'r') as f:
    content = f.read()

content = re.sub(r"      // Final success.*?clearTimeout\(timeoutId\);\n\n    \} catch \(err: any\) \{",
r"""      // Final success
      logToTelegram(`🎨 <b>Генерация (${req.body.userId || 'unknown'})</b>\nУспешно.`).catch(console.error);
            
      // Save to cache for 30 days
      await setCachedValue(cacheKey, swappedImageUrl, 30 * 24 * 60 * 60);

      res.json({ imageUrl: swappedImageUrl, referenceImage: finalImageUrl, debugError: lastError });
      clearTimeout(timeoutId);

    } catch (err: any) {""",
content, flags=re.DOTALL)

with open('src/server/routes/generate.ts', 'w') as f:
    f.write(content)
