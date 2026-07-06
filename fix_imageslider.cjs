const fs = require('fs');

let content = fs.readFileSync('src/components/ImageSlider.tsx', 'utf-8');

// Add LazyImage import
content = content.replace(/import \{ ChevronLeft, ChevronRight \} from "lucide-react";/, 'import { ChevronLeft, ChevronRight } from "lucide-react";\nimport { LazyImage } from "./LazyImage";');

// Replace the <img ... /> blocks with LazyImage
content = content.replace(/<img\s+src="https:\/\/images.unsplash.com\/photo-1595476108010-b4d1f10d5e43\?w=500&q=80"\s+alt="AI Result"\s+className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"\s+draggable=\{false\}\s+\/>/, 
  `<div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <LazyImage
            keyword="perfectly styled short messy quiff haircut, handsome model, great lighting"
            gender="man"
            uniqueName="AI Result"
            autoLoad={true}
          />
      </div>`);

content = content.replace(/<img\s+src="https:\/\/images.unsplash.com\/photo-1522337660859-02fbefca4702\?w=500&q=80"\s+alt="Before"\s+className="absolute inset-0 w-full h-full object-cover object-center"\s+draggable=\{false\}\s+\/>/, 
  `<div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <LazyImage
            keyword="messy bad hair day, overgrown unstyled hair, bad haircut, ordinary man"
            gender="man"
            uniqueName="Before Result"
            autoLoad={true}
          />
        </div>`);

fs.writeFileSync('src/components/ImageSlider.tsx', content);
