import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SkeletonTransitionProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
  error?: string | null;
  onRetry?: () => void;
}

export const SkeletonTransition: React.FC<SkeletonTransitionProps> = ({
  isLoading,
  skeleton,
  children,
  className = '',
  error = null,
  onRetry,
}) => {
  if (error) {
    return (
      <div className={cn('p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4 my-4', className)}>
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <div>
          <h4 className="font-semibold text-rose-300 text-base">Failed to load content</h4>
          <p className="text-xs text-rose-400/80 mt-1">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-medium transition-colors shadow-lg cursor-pointer"
          >
            Retry Loading
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'transition-opacity duration-300 ease-out absolute inset-0 pointer-events-none',
          isLoading ? 'opacity-100 z-10' : 'opacity-0 z-0'
        )}
      >
        {skeleton}
      </div>
      <div
        className={cn(
          'transition-opacity duration-300 ease-out relative',
          isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'
        )}
      >
        {children}
      </div>
    </div>
  );
};
