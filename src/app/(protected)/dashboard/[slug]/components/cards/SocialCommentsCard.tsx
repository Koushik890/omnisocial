'use client';

import { CommentsList } from '../social/CommentsList';
import { TrendUpIcon } from '@/icons/trend-up-icon';
import { TrendDownIcon } from '@/icons/trend-down-icon';

export function SocialCommentsCard() {
  return (
    <div className="relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative p-4 sm:p-6">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-[#5E2D9E] mb-2 sm:mb-0">Social Comments</h2>
          <div className="bg-[#6B47FF]/10 rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium text-[#A259FF]">
            Live
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-[#5E2D9E]">64%</div>
            <div className="flex items-center text-xs sm:text-sm">
              <span className="text-[#7E7E9A]">Local</span>
              <span className="ml-1 sm:ml-2 text-[#48C78E] flex items-center">
                <TrendUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                12%
              </span>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-2xl sm:text-3xl font-bold text-[#5E2D9E]">36%</div>
            <div className="flex items-center justify-end text-xs sm:text-sm">
              <span className="text-[#7E7E9A]">Global</span>
              <span className="ml-1 sm:ml-2 text-[#FF6B6B] flex items-center">
                <TrendDownIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                2%
              </span>
            </div>
          </div>
        </div>
        <CommentsList />
      </div>
    </div>
  );
}