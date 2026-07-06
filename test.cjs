const sharp = require('sharp');
sharp("public/slider-before.jpg").metadata().then(m => console.log("before:", m.width, m.height));
sharp("public/slider-after.jpg").metadata().then(m => console.log("after:", m.width, m.height));
