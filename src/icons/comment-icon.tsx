import React from 'react'

export const CommentIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        <g fillRule="nonzero">
          <path d="M19,10 C20.6569,10 22,11.3431 22,13 L22,16 C22,17.6569 20.6569,19 19,19 L19,19.9662 C19,21.026 17.7639,21.605 16.9498,20.9265 L14.6379,19 L12,19 C10.3431,19 9,17.6569 9,16 L9,13 C9,11.3431 10.3431,10 12,10 L19,10 Z M16,4 C17.6569,4 19,5.34315 19,7 L19,8 L11,8 C8.79086,8 7,9.79086 7,12 L7,16 C7,17.0445 7.40037,17.9956 8.05602,18.708 L7,19.5 C6.17596,20.118 5,19.5301 5,18.5 L5,17 C3.34315,17 2,15.6569 2,14 L2,7 C2,5.34315 3.34315,4 5,4 L16,4 Z" />
        </g>
      </g>
    </svg>
  )
} 