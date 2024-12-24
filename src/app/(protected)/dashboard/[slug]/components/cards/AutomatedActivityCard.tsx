'use client';

import { cn } from '@/lib/utils';
import { AutomatedActivityChart } from '../visualizations/AutomatedActivityChart';

interface AutomatedActivityCardProps {
  className?: string;
}

export function AutomatedActivityCard({ className }: AutomatedActivityCardProps) {
  return (
    <div
      className={cn(
        "relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm h-full flex flex-col",
        className
      )}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#5E2D9E]">Automated Activity</h2>
            <p className="text-xs sm:text-sm text-[#7E7E9A] mt-0.5 sm:mt-1">Activity overview</p>
          </div>
          <div className="bg-[#6B47FF]/10 rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium text-[#A259FF] whitespace-nowrap">
            Real-time
          </div>
        </div>
        <div className="mt-2 sm:mt-4 flex-1 flex items-center">
          <AutomatedActivityChart />
        </div>
      </div>
    </div>
  );
}
