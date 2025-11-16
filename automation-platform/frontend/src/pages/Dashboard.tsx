import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Workflow, TrendingUp, Video, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Active Workflows', value: 12, icon: Workflow, color: 'from-blue-500 to-cyan-600' },
  { label: 'Trends Found', value: 48, icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
  { label: 'Videos Created', value: 23, icon: Video, color: 'from-orange-500 to-amber-600' },
  { label: 'AI Generations', value: 156, icon: Sparkles, color: 'from-green-500 to-emerald-600' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card glass hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => navigate('/workflows')}
              magnetic
            >
              Create New Workflow
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/ai-studio')}
              magnetic
            >
              Open AI Studio
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/trends')}
              magnetic
            >
              Discover Trends
            </Button>
          </div>
        </Card>

        <Card glass>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Workflow executed successfully</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

