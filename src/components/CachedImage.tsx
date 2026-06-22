import React, { useEffect, useState } from 'react';
import localforage from 'localforage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  isPriority?: boolean;
}

export const CachedImage: React.FC<CachedImageProps> = React.memo(({ src, alt, className, style, isPriority, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let objectUrl = '';
    let isMounted = true;

    const loadImage = async () => {
      setIsLoading(true);
      if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
        setImgSrc(src);
        setIsLoading(false);
        return;
      }

      try {
         const cached = await localforage.getItem<Blob>(src);
        if (cached) {
          if (!isMounted) return;
          objectUrl = URL.createObjectURL(cached);
          setImgSrc(objectUrl);
          setIsLoading(false);
          return;
        }

        const response = await fetch(src, { mode: 'cors' });
        if (!response.ok) throw new Error('Network error');
        const blob = await response.blob();
        
        await localforage.setItem(src, blob);
        
        if (!isMounted) return;
        objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);
        setIsLoading(false);
      } catch (e) {
        console.warn('Failed to cache image:', e);
        if (isMounted) {
          setImgSrc(src);
          setIsLoading(false);
        }
      }
    };

    if (isPriority) {
        // don't load from localforage if priority to save time, mostly it's loaded from CDN anyway, but let's just use the direct src to avoid async overhead
        setImgSrc(src);
        setIsLoading(false);
    } else {
        loadImage();
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, isPriority]);

  return (
    <div ref={containerRef} className={`relative ${className || ''}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      {isPriority ? (
        <img 
          src={imgSrc || undefined} 
          alt={alt || ""}
          className={`w-full h-full object-cover transition-opacity duration-500 opacity-100`}
          style={{ display: 'block', width: '100%', height: '100%' }}
          fetchPriority="high"
          loading="eager"
          {...(props as any)}
        />
      ) : (
        <LazyLoadImage 
          src={imgSrc || undefined} 
          alt={alt || ""}
          effect="blur" 
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          wrapperClassName="w-full h-full"
          style={{ display: 'block', width: '100%', height: '100%' }}
          {...(props as any)}
        />
      )}
    </div>
  );
});
