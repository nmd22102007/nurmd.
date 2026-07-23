import React from 'react';
import { Skeleton } from './Skeleton';

export const ContactSkeleton: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <Skeleton variant="text" width={100} height={24} className="mx-auto rounded-full" />
        <Skeleton variant="title" width="60%" height={36} className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton variant="title" width={220} height={28} />
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" width={48} height={48} />
              <div className="space-y-1 flex-1">
                <Skeleton variant="text" width={80} height={12} />
                <Skeleton variant="text" width={160} height={16} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" width={48} height={48} />
              <div className="space-y-1 flex-1">
                <Skeleton variant="text" width={80} height={12} />
                <Skeleton variant="text" width={180} height={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <Skeleton variant="text" width={80} height={14} />
            <Skeleton variant="button" width="100%" height={44} rounded="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width={80} height={14} />
            <Skeleton variant="button" width="100%" height={44} rounded="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width={80} height={14} />
            <Skeleton variant="image" width="100%" height={120} rounded="rounded-xl" />
          </div>
          <Skeleton variant="button" width="100%" height={48} rounded="rounded-xl" />
        </div>
      </div>
    </section>
  );
};
