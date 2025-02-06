'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function SetupAutoRepliesCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Setup Auto Replies</h3>
          <p className="text-sm text-gray-500 mb-4">Configure automated responses for common interactions.</p>
          <Button variant="outline" className="w-full justify-center">
            Configure Now
          </Button>
        </div>
      </div>
    </div>
  );
}
