const fs = require('fs');

let content = fs.readFileSync('src/components/LazyImage.tsx', 'utf-8');

// Replace imports to add useRef
content = content.replace(/import React, \{ useState, useEffect, useCallback, memo \} from "react";/, 'import React, { useState, useEffect, useCallback, memo, useRef } from "react";');

// Find the useEffect that handles autoLoad:
const oldAutoLoadEffect = `  useEffect(() => {
    if (autoLoad) {
      const t = setTimeout(() => generateImage(), Math.random() * 500);
      return () => clearTimeout(t);
    }
  }, [keyword, gender, uniqueName, autoLoad, generateImage]);`;

const newAutoLoadLogic = `  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !autoLoad) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [autoLoad]);

  useEffect(() => {
    if (autoLoad && isInView) {
      const t = setTimeout(() => generateImage(), Math.random() * 500);
      return () => clearTimeout(t);
    }
  }, [keyword, gender, uniqueName, autoLoad, isInView, generateImage]);`;

content = content.replace(oldAutoLoadEffect, newAutoLoadLogic);

// Attach ref to the outermost elements
content = content.replace(/<div className="relative w-full h-full group\/lazy flex">/, '<div ref={containerRef} className="relative w-full h-full group/lazy flex">');
content = content.replace(/<div\n      className=\{\`flex flex-col items-center justify-center bg-transparent text-white\/90 border-r border-white\/10 \$\{className \|\| ""\}\`\}\n    >/, '<div\n      ref={containerRef}\n      className={`flex flex-col items-center justify-center bg-transparent text-white/90 border-r border-white/10 ${className || ""}`}\n    >');

fs.writeFileSync('src/components/LazyImage.tsx', content);
