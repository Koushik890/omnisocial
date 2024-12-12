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
        "relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#5E2D9E]">Automated Activity</h2>
            <p className="text-sm text-[#7E7E9A]">Activity overview</p>
          </div>
          <div className="bg-[#6B47FF]/10 rounded-full px-3 py-1 text-sm font-medium text-[#A259FF]">
            Real-time
          </div>
        </div>
        <AutomatedActivityChart />
      </div>
    </div>
  );
}
