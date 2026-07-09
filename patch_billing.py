import re
with open("src/server/utils/billing.ts", "r") as f:
    content = f.read()

replacement = """        if (deductionDoc.exists) {
          if (cacheKey && deductionDoc.data().cacheKey && deductionDoc.data().cacheKey !== cacheKey) {
             throw new Error("REPLAY_ATTACK");
          }
          return true;
        }"""
content = re.sub(r'        if \(deductionDoc\.exists\) \{\n          // Already deducted for this idempotency key\n          return true;\n        \}', replacement, content)

replacement2 = """        t.set(deductionRef, { timestamp: FieldValue.serverTimestamp() });"""
replacement2_new = """        t.set(deductionRef, { timestamp: FieldValue.serverTimestamp(), cacheKey: cacheKey || null });"""
content = content.replace(replacement2, replacement2_new)

with open("src/server/utils/billing.ts", "w") as f:
    f.write(content)
