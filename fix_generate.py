import re

with open('src/server/routes/generate.ts', 'r') as f:
    content = f.read()

# 1. Remove background wrapper
content = re.sub(
    r"      const jobId = idempotencyKey \|\| crypto\.randomUUID\(\);\n\n      if \(jobMap\.has\(jobId\)[\s\S]*?res\.json\(\{ jobId, status: 'processing' \}\);\n\n      // Run background\n      \(async \(\) => \{\n        try \{\n",
    r"""
      const jobId = idempotencyKey || crypto.randomUUID();
      try {
""",
    content
)

# 2. Replace updateJobStatus with returning the response
content = re.sub(
    r"      // Final success\n      logToTelegram\(.*\).catch\(console\.error\);\n      \n      // Save to cache for 30 days\n      await setCachedValue\(cacheKey, swappedImageUrl, 30 \* 24 \* 60 \* 60\);\n\n      updateJobStatus\(jobId, \{ status: 'completed', result: \{ imageUrl: swappedImageUrl, referenceImage: finalImageUrl, debugError: lastError \} \}\);\n      clearTimeout\(timeoutId\);\n\n    \} catch \(err: any\) \{",
    r"""      // Final success
      logToTelegram(`🎨 <b>Генерация (${req.body.userId || 'unknown'})</b>\nУспешно.`).catch(console.error);
      
      // Save to cache for 30 days
      await setCachedValue(cacheKey, swappedImageUrl, 30 * 24 * 60 * 60);

      res.json({ imageUrl: swappedImageUrl, referenceImage: finalImageUrl, debugError: lastError });
      clearTimeout(timeoutId);
    } catch (err: any) {""",
    content
)

content = re.sub(
    r"             updateJobStatus\(jobId, \{ status: 'error', error: err\.message \|\| \"Pipeline error\" \}\);\n       clearTimeout\(timeoutId\);\n        \}\n      \}\)\(\);\n    \} catch \(e: any\) \{",
    r"""      res.status(500).json({ error: err.message || "Pipeline error" });
      clearTimeout(timeoutId);
    }
    } catch (e: any) {""",
    content
)

# 3. Remove updateJobStatus calls inside the try block
content = re.sub(r"      updateJobStatus\(jobId, \{ status: 'processing'.*\}\);\n", "", content)
content = re.sub(r"                 updateJobStatus\(jobId, \{ status: 'processing', stage: 'storage_uploaded' \}\);\n", "", content)

# 4. Remove all jobMap code at the top
content = re.sub(r"// Global in-memory job status map.*?app\.use\('/api/job', jobRouter\);\n\n", "", content, flags=re.DOTALL)


with open('src/server/routes/generate.ts', 'w') as f:
    f.write(content)
