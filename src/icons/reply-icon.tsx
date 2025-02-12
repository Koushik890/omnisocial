import React from 'react'

export const ReplyIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      viewBox="0 0 32 32" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m28.88 30a1 1 0 0 1 -.88-.5 15.19 15.19 0 0 0 -13-7.5v6a1 1 0 0 1 -.62.92 1 1 0 0 1 -1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21 1 1 0 0 1 .62.92v6.11a17.19 17.19 0 0 1 15 17 16.34 16.34 0 0 1 -.13 2 1 1 0 0 1 -.79.86zm-14.38-10a17.62 17.62 0 0 1 13.5 6 15.31 15.31 0 0 0 -14.09-14 1 1 0 0 1 -.91-1v-4.59l-9.59 9.59 9.59 9.59v-4.59a1 1 0 0 1 1-1h.54z"/>
      <path d="m0 0h32v32h-32z" fill="none"/>
    </svg>
  )
} 