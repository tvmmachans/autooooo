import React, { useState, useEffect } from 'react';

interface RegionalTrend {
  keyword: string;
  volume: number;
  momentum: number;
  category: string;
  region: string;
  language: string;
  relevanceScore: number;
}

interface RegionalTrendsProps {
  region: 'IN-KL' | 'IN-TN' | 'IN';
  language: 'malayalam' | 'tamil' | 'english';
}

export const RegionalTrends: React.FC<RegionalTrendsProps> = ({ region, language }) => {
  const [trends, setTrends] = useState<RegionalTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegionalTrends();
  }, [region, language]);

  const fetchRegionalTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trends/regional?region=${region}&language=${language}`);
      const data = await response.json();
      setTrends(data.trends || []);
    } catch (error) {
      console.error('Failed to fetch regional trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const regionName = {
    'IN-KL': 'Kerala',
    'IN-TN': 'Tamil Nadu',
    'IN': 'India',
  }[region];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          {regionName} Trends ({language})
        </h2>
        <p className="text-gray-600">
          Top trending topics specific to {regionName} in {language}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading regional trends...</div>
      ) : (
        <div className="space-y-4">
          {trends.map((trend, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{trend.keyword}</h3>
                  <p className="text-sm text-gray-500 mt-1">{trend.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Relevance: {trend.relevanceScore.toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Volume: {trend.volume.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  trend.momentum > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {trend.momentum > 0 ? '↑' : '↓'} {Math.abs(trend.momentum)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

