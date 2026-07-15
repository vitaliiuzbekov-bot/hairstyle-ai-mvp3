import re

with open('src/server/routes/generate.ts', 'r') as f:
    content = f.read()

# 1. Remove background wrapper and polling response
content = re.sub(
    r"      const jobId = idempotencyKey \|\| crypto\.randomUUID\(\);\n\n      if \(jobMap\.has\(jobId\) && jobMap\.get\(jobId\)\.status === 'processing'\) \{\n          return res\.json\(\{ jobId, status: 'processing' \}\);\n      \}\n\n      // Run background\n      \(async \(\) => \{\n        try \{",
    r"""      const jobId = idempotencyKey || crypto.randomUUID();
      try {""",
    content
)

# If it didn't match perfectly, let's try a more robust approach
import sys
if '      // Run background\n      (async () => {\n        try {' not in content:
    pass # we might need to manually edit it

content = re.sub(
    r"      if \(jobMap\.has\(jobId\) && jobMap\.get\(jobId\)\.status === 'processing'\) \{\n          return res\.json\(\{ jobId, status: 'processing' \}\);\n      \}",
    "",
    content
)

content = re.sub(
    r"      // Run background\n      \(async \(\) => \{\n        try \{",
    "        try {",
    content
)

with open('src/server/routes/generate.ts', 'w') as f:
    f.write(content)
