import sys

with open("src/server/firebase.ts", "r") as f:
    content = f.read()

target = 'const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;'
replacement = """    let serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountStr && process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        try {
            serviceAccountStr = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
        } catch (e) {
            console.error("Failed to decode FIREBASE_SERVICE_ACCOUNT_BASE64", e);
        }
    }"""

content = content.replace(target, replacement)

with open("src/server/firebase.ts", "w") as f:
    f.write(content)
