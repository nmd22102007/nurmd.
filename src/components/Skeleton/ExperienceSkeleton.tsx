import React from 'react';
import { Skeleton } from './Skeleton';

export const ExperienceSkeleton: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <Skeleton variant="text" width={110} height={24} className="mx-auto rounded-full" />
        <Skeleton variant="title" width="60%" height={36} className="mx-auto" />
      </div>
      <div className="space-y-8 border-l border-white/10 pl-6 ml-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative space-y-3 bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <Skeleton variant="title" width={200} height={20} />
              <Skeleton variant="text" width={100} height={16} rounded="rounded-full" />
            </div>
            <Skeleton variant="text" width={140} height={14} />
            <div className="space-y-2 pt-2">
              <Skeleton variant="text" width="100%" height={14} />
              <Skeleton variant="text" width="85%" height={14} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
