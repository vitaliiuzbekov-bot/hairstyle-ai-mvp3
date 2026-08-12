import sys

with open(".env.example", "r") as f:
    content = f.read()

if "FIREBASE_SERVICE_ACCOUNT_BASE64" not in content:
    content += "\n# FIREBASE_SERVICE_ACCOUNT_BASE64: Required for Firebase Admin SDK (Base64 encoded JSON)\nFIREBASE_SERVICE_ACCOUNT_BASE64=\"MY_BASE64_SERVICE_ACCOUNT\"\n"

with open(".env.example", "w") as f:
    f.write(content)
