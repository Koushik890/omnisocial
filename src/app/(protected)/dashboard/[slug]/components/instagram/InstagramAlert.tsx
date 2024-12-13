'use client';

import { useState } from 'react';
import { AlertTriangle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstagramProfile } from './InstagramProfile';

export function InstagramAlert() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  if (isConnected) {
    return (
      <InstagramProfile
        username="kyliejenner"
        displayName="Kylie 🤍"
        bio="founder & ceo @kyliecosmetics @kyliebaby @kylieskin 🤍 mother of two 👼🏻 watch Life of Kylie on Hulu 📺 Los Angeles, CA"
        website="http://kyliecosmetics.com/"
        posts={6700}
        followers={226000000}
        following={66}
        avatarUrl="/profileimage.jpg"
      />
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm mb-8">
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2 bg-purple-50 rounded-lg shrink-0">
            <AlertTriangle className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Instagram Account Not Connected</h3>
              <p className="text-sm text-gray-600">
                Connect your Instagram account to OmniSocial to start automating your engagement.
              </p>
            </div>
            <Button 
              onClick={handleConnect}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg h-10 px-4 flex items-center gap-2 w-full sm:w-auto"
            >
              <Instagram className="h-4 w-4" />
              Connect Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}