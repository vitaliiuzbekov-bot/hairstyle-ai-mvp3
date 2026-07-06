import { callYandexART } from "./src/server/services/yandex.js";

async function test() {
  try {
    const res = await callYandexART({
      prompt: "test",
      negativePrompt: "test",
      aspectRatio: { widthRatio: "3", heightRatio: "4" }
    });
    console.log("Success:", res.substring(0, 50));
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
