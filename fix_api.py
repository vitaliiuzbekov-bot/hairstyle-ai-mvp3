import re

with open('src/services/api.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"  if \(data\.jobId\) \{[\s\S]*?    \}\n  \}\n\n  return data;\n\};",
    "  return data;\n};",
    content
)

with open('src/services/api.ts', 'w') as f:
    f.write(content)
