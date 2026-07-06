import re

with open('src/data/haircutLibrary.ts', 'r') as f:
    content = f.read()

def replacer(match):
    name = match.group(1)
    seed = re.sub(r'[^a-zA-Z0-9]', '', name)
    return f'customImageUrl: "https://picsum.photos/seed/{seed}/500/800",'

content = re.sub(r'name:\s*"([^"]+)".*?customImageUrl:\s*"[^"]+",', replacer, content, flags=re.DOTALL)

with open('src/data/haircutLibrary.ts', 'w') as f:
    f.write(content)

print("Replaced!")
