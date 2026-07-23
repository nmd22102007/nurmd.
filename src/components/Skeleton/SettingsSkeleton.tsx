import React from 'react';
import { Skeleton } from './Skeleton';

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <div className="space-y-2">
        <Skeleton variant="title" width={180} height={32} />
        <Skeleton variant="text" width={240} height={16} />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton variant="title" width={200} height={20} />
              <Skeleton variant="text" width={320} height={14} />
            </div>
            <Skeleton variant="button" width={60} height={30} rounded="rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
