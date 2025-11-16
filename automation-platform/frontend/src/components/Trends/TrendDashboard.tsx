import React, { useState, useEffect } from 'react';

interface Trend {
  keyword: string;
  volume: number;
  momentum: number;
  category: string;
  trendScore: number;
  sources: string[];
}

interface TrendDashboardProps {
  region?: string;
  language?: string;
}

export const TrendDashboard: React.FC<TrendDashboardProps> = ({
  region = 'IN',
  language = 'english',
}) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchTrends();
  }, [region, language]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      // API call to fetch trends
      const response = await fetch(`/api/trends?region=${region}&language=${language}`);
      const data = await response.json();
      setTrends(data.trends || []);
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(trends.map(t => t.category)))];
  const filteredTrends = selectedCategory === 'all'
    ? trends
    : trends.filter(t => t.category === selectedCategory);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Trend Dashboard</h1>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading trends...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrends.map((trend, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{trend.keyword}</h3>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Volume:</span>
                  <span className="font-medium">{trend.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Momentum:</span>
                  <span className={`font-medium ${trend.momentum > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.momentum > 0 ? '+' : ''}{trend.momentum}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trend Score:</span>
                  <span className="font-medium">{trend.trendScore.toFixed(1)}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {trend.sources.map((source, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

