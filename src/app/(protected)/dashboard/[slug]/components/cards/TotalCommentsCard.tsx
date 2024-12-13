import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function TotalCommentsCard() {
  return (
    <div
      className={cn(
        'relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm',
        'h-[156px]'
      )}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative p-5 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#5E2D9E]">
              Total Comments
              <span className="block text-xs font-normal text-[#7E7E9A] mt-0.5">on your posts</span>
            </h2>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-bold text-[#5E2D9E]">1,482</div>
          <div className="flex items-center mt-2">
            <span className="text-xs text-[#7E7E9A]">vs last period</span>
            <span className="ml-2 text-[#48C78E] flex items-center text-xs">
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              8.2%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
