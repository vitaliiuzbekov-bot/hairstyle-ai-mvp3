import fetch from "node-fetch";
(async () => {
    const res = await fetch("http://127.0.0.1:3000/src/components/ErrorBoundary.tsx");
    console.log(res.status);
    console.log(await res.text());
})();
