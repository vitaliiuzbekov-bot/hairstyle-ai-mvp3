import re

with open('src/server/routes/generate.ts', 'r') as f:
    content = f.read()

content = content.replace("""      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨
      await refundGeneration(req.body.userId);
       
      updateJobStatus(jobId, { status: 'error', error: err.message || "Pipeline error" });
       clearTimeout(timeoutId);
        }
      })();
    } catch (e: any) {""", 
"""      // 🚨 REFUND THE GENERATION SINCE IT FAILED 🚨
      await refundGeneration(req.body.userId);
       
      res.status(500).json({ error: err.message || "Pipeline error" });
      clearTimeout(timeoutId);
    } catch (e: any) {""")

with open('src/server/routes/generate.ts', 'w') as f:
    f.write(content)
