import React from 'react';
import { Skeleton } from './Skeleton';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <Skeleton variant="circle" width={100} height={100} />
        <div className="space-y-3 text-center sm:text-left flex-1">
          <Skeleton variant="title" width={220} height={28} className="mx-auto sm:mx-0" />
          <Skeleton variant="text" width={160} height={16} className="mx-auto sm:mx-0" />
          <Skeleton variant="text" width="90%" height={14} />
        </div>
        <Skeleton variant="button" width={110} height={40} rounded="rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 text-center">
            <Skeleton variant="title" width={60} height={24} className="mx-auto" />
            <Skeleton variant="text" width={100} height={14} className="mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};
