import React from 'react';
import { cn } from '../../lib/utils';

export type SkeletonVariant = 'text' | 'title' | 'avatar' | 'card' | 'image' | 'button' | 'circle' | 'line';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  rounded?: string;
  circle?: boolean;
  className?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  rounded,
  circle = false,
  className = '',
  animated = true,
  children,
}) => {
  const getVariantClass = () => {
    if (circle || variant === 'circle' || variant === 'avatar') {
      return 'skeleton-circle';
    }
    switch (variant) {
      case 'text':
        return 'skeleton-text';
      case 'title':
        return 'skeleton-title';
      case 'card':
        return 'skeleton-card';
      case 'image':
        return 'skeleton-image';
      case 'button':
        return 'skeleton-button';
      case 'line':
        return 'skeleton-line';
      default:
        return 'skeleton';
    }
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    borderRadius: rounded,
  };

  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        getVariantClass(),
        !animated && 'skeleton-shimmer [animation:none]',
        className
      )}
    >
      {children}
    </div>
  );
};
