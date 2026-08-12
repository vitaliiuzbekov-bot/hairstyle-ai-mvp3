import sys

with open("src/hooks/useTokenManager.ts", "r") as f:
    content = f.read()

content = content.replace(
    'const handleBuy = async (packageId: string, generationsCount: number, starsAmount: number) => {',
    'const handleBuy = async (packageId: string, generationsCount: number, starsAmount: number) => {\n    trackEvent("purchase_started", { packageId, starsAmount });'
)

with open("src/hooks/useTokenManager.ts", "w") as f:
    f.write(content)
