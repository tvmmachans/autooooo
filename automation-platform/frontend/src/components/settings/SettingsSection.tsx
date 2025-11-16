import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
  className,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-6', className)}
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        </div>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
      <Card glass className="p-6 space-y-6">
        {children}
      </Card>
    </motion.div>
  );
};

