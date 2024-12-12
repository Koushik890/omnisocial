import React from 'react';
import PaymentButton from '@/components/global/payment-button';

type Props = {};

const UpgradeCard = (props: Props) => {
  return (
    <div className="relative bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] p-4 rounded-2xl flex flex-col gap-y-3 border border-white/5 hover:border-white/10 transition-all duration-300 group overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A288F7]/10 to-[#F7C1E4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col items-center text-center">  
        <span className="text-sm font-medium text-white/90">
          Upgrade to{' '}
          <span className="bg-gradient-to-r from-[#A288F7] to-[#F7C1E4] font-bold bg-clip-text text-transparent">
            Omni AI
          </span>
        </span>
        
        <p className="text-[#9B9CA0] font-light text-sm mt-1">
          Unlock all features <br /> including AI and more
        </p>
        
        <div className="mt-4 w-full">  
          <PaymentButton />
        </div>
      </div>
    </div>
  );
};

export default UpgradeCard;
