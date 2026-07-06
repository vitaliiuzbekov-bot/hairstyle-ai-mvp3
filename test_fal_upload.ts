import * as fal from "@fal-ai/serverless-client";
import fs from "fs";
fal.config({ credentials: process.env.FAL_KEY || "dummy" });
async function test() {
    const b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const response = await fetch(b64);
    const blob = await response.blob();
    const url = await fal.storage.upload(blob);
    console.log("Returned:", typeof url, url);
}
test().catch(console.error);
