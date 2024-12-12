'use client'

import { useState } from 'react'

interface Props {
  // engagement: number
  // engagementChange: number
}

const EngagementCard = () => {
  const [engagement] = useState(4.8)
  const [engagementChange] = useState(-2)

  return (
    <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#E5E5E5]">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#F7C1E4]" />
        <p className="text-xs font-medium text-[#555555]">Engagement</p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-base font-semibold text-[#2D2D2D]">
          {engagement}%
        </span>
        {engagementChange !== 0 && (
          <span 
            className={`text-xs font-medium flex items-center ${
              engagementChange > 0 ? 'text-[#10B981]' : 'text-[#F44336]'
            }`}
          >
            <svg
              className="w-3 h-3 mr-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {engagementChange > 0 ? (
                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
              ) : (
                <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
              )}
            </svg>
            {engagementChange > 0 ? '+' : ''}{engagementChange}%
          </span>
        )}
      </div>
    </div>
  )
}

export default EngagementCard
