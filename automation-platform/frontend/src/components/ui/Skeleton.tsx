import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rectangular', ...props }) => {
  return (
    <div
      className={cn(
        'skeleton',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      {...props}
    />
  );
};

