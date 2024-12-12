import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function TotalCommentsCard() {
  return (
    <div
      className={cn(
        "relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm",
        "h-[156px]"
      )}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative h-full p-6">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="mb-auto">
            <h3 className="text-lg font-semibold text-[#5E2D9E] mb-0">
              Total Comments
            </h3>
            <p className="text-sm text-[#7E7E9A]">
              Last week performance
            </p>
          </div>

          {/* Stats Section */}
          <div className="flex items-center justify-between text-sm text-[#7E7E9A]">
            <div>
              <span className="text-2xl font-semibold text-[#5E2D9E]">8,250</span>
              <div className="flex items-center mt-1">
                <span className="text-[#48C78E] font-medium">+8.8%</span>
                <span className="ml-2 text-xs">vs 7,580</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
