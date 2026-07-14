import { getTelegramFileUrl } from "./src/server/services/telegramBot";

async function run() {
  console.log("URL:", await getTelegramFileUrl("INVALID_FILE_ID"));
}
run();
