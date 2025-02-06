'use client';

import { Reply } from 'lucide-react';

export function CommentRepliesCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Comment Replies</p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1">892</h3>
          <p className="text-sm text-green-600 mt-1 flex items-center">
            <span className="font-medium">+8.2%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
          <Reply className="w-6 h-6 text-pink-500" />
        </div>
      </div>
    </div>
  );
}
