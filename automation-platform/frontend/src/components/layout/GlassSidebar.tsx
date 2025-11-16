import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Workflow, 
  Sparkles, 
  Video, 
  TrendingUp,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'AI Studio', href: '/ai-studio', icon: Sparkles },
  { name: 'Video Studio', href: '/video-studio', icon: Video },
  { name: 'Trend Finder', href: '/trends', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const GlassSidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <motion.aside
              data-tour="sidebar"
              className={cn(
                'fixed left-0 top-0 h-full w-64 z-50',
                'bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl',
                'border-r border-white/20 dark:border-gray-700/20',
                'shadow-2xl',
                'lg:static lg:z-auto'
              )}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full p-6">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Automation
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Platform</p>
                </div>

                <nav className="flex-1 space-y-2">
                  {navigation.map((item, index) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.href}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                            'hover:bg-white/10 dark:hover:bg-gray-800/50',
                            isActive
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30'
                              : ''
                          )}
                          onClick={() => {
                            if (window.innerWidth < 1024) {
                              toggleSidebar();
                            }
                          }}
                        >
                          <item.icon className={cn(
                            'w-5 h-5',
                            isActive ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
                          )} />
                          <span className={cn(
                            'font-medium',
                            isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          )}>
                            {item.name}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10 dark:border-gray-700/20 space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">User</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

