async function run() {
    try {
        const url = "https://firebasestorage.googleapis.com/v0/b/ai-studio-hairstyleaimvp-0640fe2b-9f22-4893-8020-7953053ab2bd.appspot.com/o/uploads%2Fanonymous%2Fupload_1718000000000_123.jpg?alt=media&token=test";
        console.log("Fetching:", url);
        const res = await fetch(url);
        console.log("Status:", res.status);
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
