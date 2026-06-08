import React, { useEffect, useState } from 'react';
import localforage from 'localforage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({ src, alt, className, style, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

    loadImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return (
    <div className={`relative ${className || ''}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      <LazyLoadImage 
        src={imgSrc} 
        alt={alt || ""}
        effect="blur" 
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        wrapperClassName="w-full h-full"
        style={{ display: 'block', width: '100%', height: '100%' }}
        {...(props as any)}
      />
    </div>
  );
};
