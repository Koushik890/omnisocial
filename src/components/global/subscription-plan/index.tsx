'use client';

import React from 'react';

type Props = {
  type: 'FREE' | 'PRO';
  children?: React.ReactNode;
};

export const SubscriptionPlan = ({ type, children }: Props) => {
  const planName = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-center gap-x-2">
        <div className="h-2 w-2 rounded-full bg-[#8D4AF3]" />
        <div className="flex items-center gap-x-1">
          <span className="text-sm font-medium text-white">{planName}</span>
          <span className="text-sm font-medium text-white/80">Plan</span>
        </div>
      </div>
      {children}
    </div>
  );
};
