let finalTargetImageUrl = "https://v3b.fal.media/files/b/0aa0deaa/kXrPXka-xMuQwYT_ddyds_1783149229441.png";
let isLocalUrl = false;
let parsedPath = finalTargetImageUrl;

if (finalTargetImageUrl.startsWith('http')) {
    const urlObj = new URL(finalTargetImageUrl);
    parsedPath = urlObj.pathname;
    isLocalUrl = true; 
}

if (isLocalUrl && (parsedPath.startsWith('/'))) {
    let normalizePath = parsedPath.startsWith('/') ? parsedPath : '/' + parsedPath;
    console.log("inside block", normalizePath);
}

if (!finalTargetImageUrl.startsWith('data:')) {
    console.log(`CRITICAL WARNING: targetImageUrl could not be resolved to base64. Using original path: ${normalizePath}`);
}
