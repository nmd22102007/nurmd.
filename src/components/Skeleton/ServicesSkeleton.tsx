import React from 'react';
import { Skeleton } from './Skeleton';

export const ServicesSkeleton: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <Skeleton variant="text" width={110} height={24} className="mx-auto rounded-full" />
        <Skeleton variant="title" width="70%" height={36} className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white/5 dark:bg-zinc-900/40 border border-white/10 p-8 space-y-6">
            <Skeleton variant="circle" width={56} height={56} />
            <Skeleton variant="title" width="80%" height={24} />
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="90%" height={16} />
              <Skeleton variant="text" width="75%" height={16} />
            </div>
            <Skeleton variant="text" width={100} height={16} />
          </div>
        ))}
      </div>
    </section>
  );
};
