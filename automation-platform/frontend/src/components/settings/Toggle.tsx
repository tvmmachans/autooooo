import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  };

  const dotSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const translateSizes = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-7',
  };

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600',
          disabled && 'opacity-50 cursor-not-allowed',
          sizes[size]
        )}
      >
        <motion.span
          className={cn(
            'inline-block rounded-full bg-white transform transition-transform',
            dotSizes[size]
          )}
          animate={{
            x: enabled ? (size === 'sm' ? 16 : size === 'md' ? 20 : 28) : 2,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer" onClick={() => !disabled && onChange(!enabled)}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

