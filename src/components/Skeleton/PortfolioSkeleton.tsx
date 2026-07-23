import React from 'react';
import { Skeleton } from './Skeleton';

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white/5 dark:bg-zinc-900/40 border border-white/10 p-5 space-y-4">
      <Skeleton variant="image" width="100%" height={200} rounded="rounded-xl" />
      <div className="space-y-2">
        <Skeleton variant="title" width="70%" height={22} />
        <Skeleton variant="text" width="100%" height={14} />
        <Skeleton variant="text" width="80%" height={14} />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Skeleton variant="text" width={50} height={20} rounded="rounded-full" />
          <Skeleton variant="text" width={50} height={20} rounded="rounded-full" />
        </div>
        <Skeleton variant="button" width={80} height={32} rounded="rounded-lg" />
      </div>
    </div>
  );
};

export const PortfolioSkeleton: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
        <div className="space-y-3">
          <Skeleton variant="text" width={90} height={24} rounded="rounded-full" />
          <Skeleton variant="title" width={300} height={36} />
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Skeleton variant="button" width={80} height={36} rounded="rounded-full" />
          <Skeleton variant="button" width={80} height={36} rounded="rounded-full" />
          <Skeleton variant="button" width={80} height={36} rounded="rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </section>
  );
};
