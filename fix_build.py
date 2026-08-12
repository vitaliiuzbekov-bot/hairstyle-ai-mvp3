import sys

with open("src/utils/telegram.ts", "r") as f:
    content = f.read()

content = content.replace("tg.close();", "(tg as any).close();")

with open("src/utils/telegram.ts", "w") as f:
    f.write(content)

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

if "import { openUrlInTelegram" not in content:
    content = "import { openUrlInTelegram } from '../utils/telegram';\n" + content

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
