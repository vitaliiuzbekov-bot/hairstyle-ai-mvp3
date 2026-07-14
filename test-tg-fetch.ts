import { getTelegramFileUrl } from "./src/server/services/telegramBot";
import "dotenv/config";

async function run() {
  console.log("Token exists:", !!process.env.TELEGRAM_BOT_TOKEN);
  // We don't have a real file ID, so we can't test the actual fetch easily.
}
run();
