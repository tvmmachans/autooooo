import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  User,
  Building2,
  Plug,
  Settings as SettingsIcon,
  Palette,
  Shield,
  CreditCard,
  Code,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' },
  { id: 'workspace', label: 'Workspace', icon: Building2, path: '/settings/workspace' },
  { id: 'integrations', label: 'Integrations', icon: Plug, path: '/settings/integrations' },
  { id: 'preferences', label: 'Preferences', icon: SettingsIcon, path: '/settings/preferences' },
  { id: 'appearance', label: 'Appearance', icon: Palette, path: '/settings/appearance' },
  { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
  { id: 'billing', label: 'Billing', icon: CreditCard, path: '/settings/billing' },
  { id: 'advanced', label: 'Advanced', icon: Code, path: '/settings/advanced' },
];

export const SettingsLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'w-full md:w-64 flex-shrink-0',
              'bg-white/10 dark:bg-gray-900/10 backdrop-blur-md',
              'border border-white/20 dark:border-gray-700/20',
              'rounded-xl p-4',
              'md:block',
              mobileMenuOpen ? 'block' : 'hidden'
            )}
          >
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = location.pathname === section.path || 
                  (section.id !== 'profile' && location.pathname.startsWith(section.path));

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      navigate(section.path);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
                      'text-left transition-colors',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
};

