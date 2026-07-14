import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.set("Content-Type", "image/jpeg");
  res.send(Buffer.from("hello"));
});
const server = app.listen(0, async () => {
  const port = (server.address() as any).port;
  const res = await fetch(`http://localhost:${port}/`);
  console.log("Content-Type:", res.headers.get("content-type"));
  process.exit(0);
});
