import React from 'react';
import { motion } from 'framer-motion';
import { TrendDashboard } from '../components/Trends/TrendDashboard';
import { RegionalTrends } from '../components/Trends/RegionalTrends';
import { Card } from '../components/ui/Card';
import { useState } from 'react';

export const Trends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'kerala' | 'tamil'>('all');

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          Trend Finder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Discover trending topics</p>
      </motion.div>

      <Card glass>
        <div className="flex gap-2 mb-6">
          {(['all', 'kerala', 'tamil'] as const).map((tab) => (
            <motion.button
              key={tab}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === 'all' ? 'All Trends' : tab === 'kerala' ? 'Kerala' : 'Tamil Nadu'}
            </motion.button>
          ))}
        </div>

        {activeTab === 'all' && <TrendDashboard />}
        {activeTab === 'kerala' && <RegionalTrends region="IN-KL" language="malayalam" />}
        {activeTab === 'tamil' && <RegionalTrends region="IN-TN" language="tamil" />}
      </Card>
    </div>
  );
};

