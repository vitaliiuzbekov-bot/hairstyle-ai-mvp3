import sys

with open("src/services/api.ts", "r") as f:
    content = f.read()

target = """  const jobId = data.jobId;
  if (!jobId) {
    throw new Error("Не удалось получить результат генерации от сервера.");
  }

  return { isAsync: true, jobId };"""

replacement = """  const jobId = data.jobId;
  if (!jobId) {
    throw new Error("Не удалось получить результат генерации от сервера.");
  }

  // Bounded polling for job status
  let attempts = 0;
  const maxAttempts = 30; // 30 * 4 = 120 seconds
  while (attempts < maxAttempts) {
    if (signal?.aborted) {
        const err = new Error("AbortError");
        err.name = "AbortError";
        throw err;
    }
    await new Promise(r => setTimeout(r, 4000));
    try {
      const pollRes = await fetch(`/api/job/${jobId}`, { signal });
      if (pollRes.ok) {
        const pollData = await pollRes.json();
        if (pollData.status === "done") {
          return {
            imageUrl: pollData.imageUrl,
            originalUrl: pollData.originalUrl,
            referenceImage: pollData.referenceImage
          };
        } else if (pollData.status === "error") {
          throw new Error(pollData.error || "Ошибка во время генерации.");
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError" || e.message === "AbortError") throw e;
      console.warn("Polling error:", e);
    }
    attempts++;
  }

  return { isAsync: true, jobId };"""

content = content.replace(target, replacement)

with open("src/services/api.ts", "w") as f:
    f.write(content)
