'use client';

import { RecentPosts } from '../activity/RecentPosts';

export function RecentPostsCard() {
  return (
    <div className="relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm h-[335px]">
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-[#5E2D9E]">Recent Posts</h2>
            <span className="bg-[#6B47FF]/10 rounded-full px-3 py-1 text-sm font-medium text-[#A259FF]">
              Last 7 days
            </span>
          </div>
        </div>
        <RecentPosts />
      </div>
    </div>
  );
}