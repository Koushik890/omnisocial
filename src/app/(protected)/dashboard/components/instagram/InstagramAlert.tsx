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
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl h-[180px] mb-8">
      <div className="flex items-center gap-4 h-full py-8 px-6">
        <div className="p-2 bg-amber-100 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-amber-900">Instagram Account Not Connected</h3>
          </div>
          <p className="text-amber-800 mb-4">
            Connect your Instagram account to OmniSocial to start automating your engagement.
          </p>
          <Button 
            onClick={handleConnect}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg h-10 px-4 flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Connect Account
          </Button>
        </div>
      </div>
    </div>
  );
}