import React from 'react';

export const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-white/5 ${className}`} />
  );
};

export const ImageSkeleton = () => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-4">
      <Skeleton className="w-full h-48 rounded-xl mb-4" />
      <Skeleton className="w-3/4 h-4 rounded mb-2" />
      <Skeleton className="w-1/2 h-4 rounded" />
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <Skeleton className="w-full aspect-[3/4] rounded-2xl mb-4" />
      <div className="space-y-2 mt-4">
         <Skeleton className="w-full h-6 rounded" />
         <Skeleton className="w-5/6 h-4 rounded" />
         <Skeleton className="w-4/5 h-4 rounded" />
      </div>
      <div className="mt-4 flex gap-2">
         <Skeleton className="w-1/2 h-10 rounded-xl" />
         <Skeleton className="w-1/2 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export const TextSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full h-4 rounded" />
      <Skeleton className="w-11/12 h-4 rounded" />
      <Skeleton className="w-9/12 h-4 rounded" />
      <Skeleton className="w-full h-4 rounded" />
    </div>
  );
}
