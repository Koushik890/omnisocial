import React from 'react'

export const TrendUpIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 10l7-7m0 0l7 7m-7-7v18" 
      />
    </svg>
  )
} 