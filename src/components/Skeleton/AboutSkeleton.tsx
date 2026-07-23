import React from 'react';
import { Skeleton } from './Skeleton';

export const AboutSkeleton: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <Skeleton variant="text" width={100} height={24} className="mx-auto rounded-full" />
        <Skeleton variant="title" width="60%" height={36} className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Skeleton variant="image" width="100%" height={380} rounded="rounded-2xl" />
        <div className="space-y-4">
          <Skeleton variant="title" width="80%" height={32} />
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="95%" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton variant="card" width="100%" height={80} />
            <Skeleton variant="card" width="100%" height={80} />
          </div>
        </div>
      </div>
    </section>
  );
};
