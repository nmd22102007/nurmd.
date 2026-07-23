import React from 'react';
import { Skeleton } from './Skeleton';

export const AdminSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-navy">
      <div className="w-64 border-r border-white/10 p-6 space-y-6 hidden md:block">
        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
          <Skeleton variant="circle" width={36} height={36} />
          <Skeleton variant="title" width={110} height={20} />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton variant="circle" width={24} height={24} />
              <Skeleton variant="text" width={100} height={14} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-8 space-y-8">
        <div className="flex justify-between items-center pb-6 border-b border-white/10">
          <Skeleton variant="title" width={200} height={28} />
          <Skeleton variant="button" width={130} height={40} rounded="rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
            <Skeleton variant="title" width={160} height={22} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton variant="text" width={90} height={14} />
                <Skeleton variant="button" width="100%" height={40} rounded="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton variant="text" width={90} height={14} />
                <Skeleton variant="image" width="100%" height={160} rounded="rounded-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <Skeleton variant="title" width={140} height={22} />
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="90%" height={14} />
            <Skeleton variant="button" width="100%" height={40} rounded="rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
