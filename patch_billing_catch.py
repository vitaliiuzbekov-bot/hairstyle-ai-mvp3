import re
with open("src/server/utils/billing.ts", "r") as f:
    content = f.read()

replacement = """    if (err.message === "AUTHORIZATION_ERROR") {
       return { ok: false, error: "Ошибка авторизации: ID пользователя не совпадает с Telegram ID." };
    }
    if (err.message === "REPLAY_ATTACK") {
       return { ok: false, error: "Попытка повторного использования ключа (Replay Attack)." };
    }"""
content = re.sub(r'    if \(err\.message === "AUTHORIZATION_ERROR"\) \{\n       return \{ ok: false, error: "Ошибка авторизации: ID пользователя не совпадает с Telegram ID\." \};\n    \}', replacement, content)

with open("src/server/utils/billing.ts", "w") as f:
    f.write(content)
