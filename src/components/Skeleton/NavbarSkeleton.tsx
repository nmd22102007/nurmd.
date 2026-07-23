import React from 'react';
import { Skeleton } from './Skeleton';

export const NavbarSkeleton: React.FC = () => {
  return (
    <nav className="w-full h-20 px-6 sm:px-12 flex items-center justify-between border-b border-white/5 bg-navy/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="title" width={120} height={20} />
      </div>
      <div className="hidden md:flex items-center gap-6">
        <Skeleton variant="text" width={60} height={14} />
        <Skeleton variant="text" width={70} height={14} />
        <Skeleton variant="text" width={65} height={14} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton variant="button" width={100} height={36} rounded="rounded-xl" />
      </div>
    </nav>
  );
};
