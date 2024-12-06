'use client';

import { RecentPosts } from '../activity/RecentPosts';

export function RecentPostsCard() {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <span className="bg-white/80 rounded-full px-3 py-1 text-sm font-medium text-purple-600">
              Last 7 days
            </span>
          </div>
        </div>
        <RecentPosts />
      </div>
    </div>
  );
}