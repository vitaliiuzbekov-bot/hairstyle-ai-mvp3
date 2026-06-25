import { createServer } from "vite";
async function test() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  console.log("Vite created");
  process.exit(0);
}
test();
