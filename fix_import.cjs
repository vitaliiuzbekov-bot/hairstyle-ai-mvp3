const fs = require('fs');
let content = fs.readFileSync('src/components/VTONPreviewSection.tsx', 'utf8');

if (content.includes('import { Sparkles, Send, Download, FileDown, ShoppingBag, Share2, Eraser, Video } from "lucide-react";')) {
    content = content.replace('import { Sparkles, Send, Download, FileDown, ShoppingBag, Share2, Eraser, Video } from "lucide-react";', 
        'import { Sparkles, Send, Download, FileDown, ShoppingBag, Share2, Eraser, Video, Grid2x2 } from "lucide-react";');
    fs.writeFileSync('src/components/VTONPreviewSection.tsx', content);
    console.log("Fixed import!");
} else {
    console.log("Import not found!");
}
