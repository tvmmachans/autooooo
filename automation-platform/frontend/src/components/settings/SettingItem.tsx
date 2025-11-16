import React from 'react';
import { cn } from '../../lib/utils';

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  children,
  className,
  required = false,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

