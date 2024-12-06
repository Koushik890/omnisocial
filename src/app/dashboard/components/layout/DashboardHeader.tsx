'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';

interface InstagramStats {
  followers: number;
  engagement: number;
  followerChange: number;
  engagementChange: number;
}

export function DashboardHeader() {
  const [stats] = useState<InstagramStats>({
    followers: 226000000,
    engagement: 4.8,
    followerChange: 12,
    engagementChange: -2
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="m-2 bg-gradient-to-br from-[#F3EAFD] to-[#FCE8F7] backdrop-blur-lg shadow-[0_2px_8px_rgba(162,136,247,0.1)] rounded-3xl border border-[#E5E5E5]">
        <div className="h-20 px-8 flex items-center justify-between">
          {/* Left Section - Welcome Message */}
          <div className="flex flex-col">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-[#2D2D2D]">
              Welcome back, Kylie
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-[#8D4AF3]/10 text-[#8D4AF3] rounded-full">
                Pro
              </span>
            </h1>
            <p className="text-sm text-[#555555] mt-0.5">
              Here's what's happening with your social media accounts today.
            </p>
          </div>
          
          {/* Right Section - Quick Stats & Actions */}
          <div className="flex items-center gap-6">
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(162,136,247,0.05)] border border-[#E5E5E5]">
                <p className="text-xs font-medium text-[#555555] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A288F7]"></span>
                  Followers
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-semibold text-[#2D2D2D]">{formatNumber(stats.followers)}</span>
                  <span className="text-xs font-medium text-[#10B981] flex items-center">
                    <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                    </svg>
                    +{stats.followerChange}%
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(162,136,247,0.05)] border border-[#E5E5E5]">
                <p className="text-xs font-medium text-[#555555] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7C1E4]"></span>
                  Engagement
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-semibold text-[#2D2D2D]">{stats.engagement}%</span>
                  <span className="text-xs font-medium text-[#F44336] flex items-center">
                    <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
                    </svg>
                    {stats.engagementChange}%
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Button */}
            <div className="flex items-center">
              <button 
                className="relative p-2.5 text-[#555555] hover:text-[#8D4AF3] transition-colors rounded-xl hover:bg-white/80"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#F44336] ring-2 ring-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}