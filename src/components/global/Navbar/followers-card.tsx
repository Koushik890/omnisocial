'use client';

import { useState } from 'react';

interface Props {
  // followers: number;
  // followerChange: number;
  // formatNumber: (num: number) => string;
}

const FollowersCard = () => {
  const [followers] = useState(226000000);
  const [followerChange] = useState(12);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#E5E5E5]">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#A288F7]" />
        <p className="text-xs font-medium text-[#555555]">Followers</p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-base font-semibold text-[#2D2D2D]">
          {formatNumber(followers)}
        </span>
        {followerChange > 0 && (
          <span className="text-xs font-medium text-[#10B981] flex items-center">
            <svg
              className="w-3 h-3 mr-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
            </svg>
            +{followerChange}%
          </span>
        )}
      </div>
    </div>
  );
};

export default FollowersCard;
