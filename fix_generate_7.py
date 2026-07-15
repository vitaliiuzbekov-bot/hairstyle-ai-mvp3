import re

with open('src/server/routes/generate.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨\s+await refundGeneration\(req\.body\.userId\);\s+updateJobStatus\(jobId, \{ status: 'error', error: err\.message \|\| \"Pipeline error\" \}\);\s+clearTimeout\(timeoutId\);\s+\}\s+\}\)\(\);\s+\} catch \(e: any\) \{",
    r"""      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨
      await refundGeneration(req.body.userId);
       
      res.status(500).json({ error: err.message || "Pipeline error" });
      clearTimeout(timeoutId);
    } catch (e: any) {""",
    content
)

with open('src/server/routes/generate.ts', 'w') as f:
    f.write(content)
