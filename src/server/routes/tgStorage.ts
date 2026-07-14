import { Router } from "express";
import { getTelegramFileUrl } from "../services/telegramBot";

export const tgStorageRouter = Router();

tgStorageRouter.get("/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!fileId) return res.status(400).send("No file ID");

    const url = await getTelegramFileUrl(fileId);
    if (!url) {
      return res.status(404).send("File not found");
    }

    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      return res.status(imageRes.status).send("Failed to stream image");
    }

    res.set("Content-Type", imageRes.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    res.set("Access-Control-Allow-Origin", "*"); // Allow canvas cross-origin
    
    // Read the arrayBuffer and send it, since native fetch body is not a Node stream
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error("TG Storage Proxy Error:", err);
    res.status(500).send("Internal server error");
  }
});
