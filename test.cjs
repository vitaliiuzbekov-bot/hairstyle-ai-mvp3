const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<body>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>console.log(window.Telegram.WebApp.platform);</script>
</body>`, { runScripts: "dangerously", resources: "usable" });
