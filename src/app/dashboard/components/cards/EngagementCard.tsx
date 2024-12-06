'use client';

import { EngagementChart } from '../visualizations/EngagementChart';

export function EngagementCard() {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Engagement Rate</h2>
            <p className="text-sm text-gray-600">Hourly engagement overview</p>
          </div>
          <div className="bg-white/80 rounded-full px-3 py-1 text-sm font-medium text-purple-600">
            Real-time
          </div>
        </div>
        <EngagementChart />
      </div>
    </div>
  );
}