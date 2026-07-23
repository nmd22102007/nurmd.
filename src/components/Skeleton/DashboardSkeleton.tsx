import React from 'react';
import { Skeleton } from './Skeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton variant="title" width={240} height={32} />
          <Skeleton variant="text" width={180} height={16} />
        </div>
        <Skeleton variant="button" width={120} height={40} rounded="rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton variant="text" width={90} height={14} />
              <Skeleton variant="circle" width={32} height={32} />
            </div>
            <Skeleton variant="title" width={120} height={28} />
            <Skeleton variant="text" width={100} height={12} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
          <Skeleton variant="title" width={180} height={22} />
          <Skeleton variant="image" width="100%" height={260} rounded="rounded-xl" />
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
          <Skeleton variant="title" width={140} height={22} />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton variant="avatar" width={36} height={36} />
                <div className="flex-1 space-y-1">
                  <Skeleton variant="text" width="80%" height={14} />
                  <Skeleton variant="text" width="50%" height={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
