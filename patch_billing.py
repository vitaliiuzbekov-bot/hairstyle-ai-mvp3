import sys

with open("src/server/utils/billing.ts", "r") as f:
    content = f.read()

content = content.replace(
    'if (userId === "local-user") {\n    return { ok: true }; \n  }',
    'if (userId === "local-user") {\n    if (process.env.NODE_ENV !== "production") {\n      return { ok: true };\n    }\n    return { ok: false, error: "Пожалуйста, откройте приложение через официального бота Telegram." };\n  }'
)

content = content.replace(
    'if (userId === "local-user") {\n    return;\n  }',
    'if (userId === "local-user") {\n    return;\n  }'
)

with open("src/server/utils/billing.ts", "w") as f:
    f.write(content)
