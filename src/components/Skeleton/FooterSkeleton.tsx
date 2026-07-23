import React from 'react';
import { Skeleton } from './Skeleton';

export const FooterSkeleton: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/40 py-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" width={36} height={36} />
            <Skeleton variant="title" width={140} height={22} />
          </div>
          <Skeleton variant="text" width="80%" height={16} />
          <div className="flex gap-3 pt-2">
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="circle" width={32} height={32} />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton variant="title" width={100} height={18} />
          <Skeleton variant="text" width={80} height={14} />
          <Skeleton variant="text" width={90} height={14} />
          <Skeleton variant="text" width={70} height={14} />
        </div>
        <div className="space-y-3">
          <Skeleton variant="title" width={100} height={18} />
          <Skeleton variant="text" width={120} height={14} />
          <Skeleton variant="text" width={100} height={14} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Skeleton variant="text" width={220} height={14} />
        <Skeleton variant="text" width={160} height={14} />
      </div>
    </footer>
  );
};
