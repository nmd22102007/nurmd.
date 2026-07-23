import React from 'react';
import { Skeleton } from './Skeleton';

export const BlogSkeleton: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
        <div className="space-y-3">
          <Skeleton variant="text" width={100} height={24} rounded="rounded-full" />
          <Skeleton variant="title" width={280} height={36} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden space-y-4">
            <Skeleton variant="image" width="100%" height={220} rounded="rounded-none" />
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton variant="text" width={80} height={12} />
                <Skeleton variant="text" width={60} height={12} />
              </div>
              <Skeleton variant="title" width="95%" height={24} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="80%" height={16} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
