import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({ src, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);

  useEffect(() => {
    let objectUrl = '';
    let isMounted = true;

    const loadImage = async () => {
      if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
        setImgSrc(src);
        return;
      }

      try {
        const cached = await get<Blob>(src);
        if (cached) {
          if (!isMounted) return;
          objectUrl = URL.createObjectURL(cached);
          setImgSrc(objectUrl);
          return;
        }

        const response = await fetch(src, { mode: 'cors' });
        if (!response.ok) throw new Error('Network error');
        const blob = await response.blob();
        
        await set(src, blob);
        
        if (!isMounted) return;
        objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);
      } catch (e) {
        console.warn('Failed to cache image:', e);
        if (isMounted) setImgSrc(src);
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

  return <img src={imgSrc} {...props} />;
};
