import React from 'react';

export const Skeleton = ({ className = '', isLightMode = false }: { className?: string, isLightMode?: boolean }) => {
  return (
    <div className={`animate-pulse ${isLightMode ? 'bg-gray-200' : 'bg-white/5'} ${className}`} />
  );
};

export const ImageSkeleton = ({ isLightMode = false }: { isLightMode?: boolean }) => {
  return (
    <div className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center p-4 ${isLightMode ? 'bg-gray-100' : 'bg-black/20'}`}>
      <Skeleton isLightMode={isLightMode} className="w-full h-48 rounded-xl mb-4" />
      <Skeleton isLightMode={isLightMode} className="w-3/4 h-4 rounded mb-2" />
      <Skeleton isLightMode={isLightMode} className="w-1/2 h-4 rounded" />
    </div>
  );
};

export const CardSkeleton = ({ isLightMode = false }: { isLightMode?: boolean }) => {
  return (
    <div className={`${isLightMode ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'} border rounded-3xl p-6 backdrop-blur-xl`}>
      <Skeleton isLightMode={isLightMode} className="w-full aspect-[3/4] rounded-2xl mb-4" />
      <div className="space-y-2 mt-4">
         <Skeleton isLightMode={isLightMode} className="w-full h-6 rounded" />
         <Skeleton isLightMode={isLightMode} className="w-5/6 h-4 rounded" />
         <Skeleton isLightMode={isLightMode} className="w-4/5 h-4 rounded" />
      </div>
      <div className="mt-4 flex gap-2">
         <Skeleton isLightMode={isLightMode} className="w-1/2 h-10 rounded-xl" />
         <Skeleton isLightMode={isLightMode} className="w-1/2 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export const TextSkeleton = ({ isLightMode = false }: { isLightMode?: boolean }) => {
  return (
    <div className="space-y-3">
      <Skeleton isLightMode={isLightMode} className="w-full h-4 rounded" />
      <Skeleton isLightMode={isLightMode} className="w-11/12 h-4 rounded" />
      <Skeleton isLightMode={isLightMode} className="w-9/12 h-4 rounded" />
      <Skeleton isLightMode={isLightMode} className="w-full h-4 rounded" />
    </div>
  );
}
