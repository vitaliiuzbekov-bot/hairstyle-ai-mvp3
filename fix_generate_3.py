import re

with open('src/server/routes/generate.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨\n      await refundGeneration\(req\.body\.userId\);\n\n             updateJobStatus\(jobId, \{ status: 'error', error: err\.message \|\| \"Pipeline error\" \}\);\n       clearTimeout\(timeoutId\);\n        \}\n      \}\)\(\);\n    \} catch \(e: any\) \{",
    r"""      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨
      await refundGeneration(req.body.userId);
       
      res.status(500).json({ error: err.message || "Pipeline error" });
      clearTimeout(timeoutId);
        }
    } catch (e: any) {""",
    content
)

content = re.sub(
    r"      const jobId = idempotencyKey \|\| crypto\.randomUUID\(\);\n\n        try \{",
    r"""      try {""",
    content
)

with open('src/server/routes/generate.ts', 'w') as f:
    f.write(content)

