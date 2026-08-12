import sys

with open("server.ts", "r") as f:
    content = f.read()

content = content.replace(
    'import { authRouter } from "./src/server/routes/auth";',
    'import { authRouter } from "./src/server/routes/auth";\nimport { analyticsRouter } from "./src/server/routes/analytics";'
)

content = content.replace(
    'app.use("/api", authRouter);',
    'app.use("/api", authRouter);\n  app.use("/api/analytics", analyticsRouter);'
)

with open("server.ts", "w") as f:
    f.write(content)
