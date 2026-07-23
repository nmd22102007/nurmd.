import React from 'react';
import { Skeleton } from './Skeleton';

export const GallerySkeleton: React.FC = () => {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Skeleton variant="text" width={90} height={24} className="mx-auto rounded-full" />
        <Skeleton variant="title" width={260} height={36} className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-3 space-y-3">
            <Skeleton variant="image" width="100%" height={200} rounded="rounded-xl" />
            <div className="space-y-1 px-1">
              <Skeleton variant="title" width="80%" height={16} />
              <Skeleton variant="text" width="50%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
