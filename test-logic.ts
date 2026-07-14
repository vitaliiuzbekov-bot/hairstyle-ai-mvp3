let tgFileId = null;
let imageBuffer = Buffer.from("hello");
let contentType = "image/jpeg";
let swappedImageUrl = "http://fal.ai/image.jpg";

try {
  throw new Error("Storage failed");
} catch (e) {
  if (tgFileId) {
    swappedImageUrl = `/api/tg/${tgFileId}`;
  } else if (imageBuffer && imageBuffer.length > 0) {
    swappedImageUrl = `data:${contentType};base64,${imageBuffer.toString('base64')}`;
  }
}
console.log(swappedImageUrl);
