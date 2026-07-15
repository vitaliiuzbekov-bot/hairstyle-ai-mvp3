async function run() {
    // 2 MB of random data
    const buf = Buffer.alloc(2 * 1024 * 1024);
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256);
    
    const base64 = buf.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;
    
    try {
        console.log("Data URI length:", dataUri.length);
        const res = await fetch(dataUri);
        const blob = await res.blob();
        console.log("Fetch blob size:", blob.size);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
run();
