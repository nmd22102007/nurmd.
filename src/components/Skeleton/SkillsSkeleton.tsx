import React from 'react';
import { Skeleton } from './Skeleton';

export const SkillsSkeleton: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <Skeleton variant="text" width={95} height={24} className="mx-auto rounded-full" />
        <Skeleton variant="title" width="50%" height={36} className="mx-auto" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center space-y-3">
            <Skeleton variant="circle" width={48} height={48} />
            <Skeleton variant="text" width={80} height={14} />
          </div>
        ))}
      </div>
    </section>
  );
};
