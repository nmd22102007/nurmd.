import React from 'react';
import { Skeleton } from './Skeleton';

export const HeroSkeleton: React.FC = () => {
  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6 sm:px-12 py-16">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Skeleton variant="text" width={160} height={28} rounded="rounded-full" />
          <div className="space-y-3">
            <Skeleton variant="title" width="90%" height={48} />
            <Skeleton variant="title" width="70%" height={48} />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="85%" height={16} />
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Skeleton variant="button" width={140} height={48} rounded="rounded-xl" />
            <Skeleton variant="button" width={120} height={48} rounded="rounded-xl" />
          </div>
        </div>
        <div className="relative">
          <Skeleton variant="image" width="100%" height={400} rounded="rounded-3xl" />
        </div>
      </div>
    </section>
  );
};
