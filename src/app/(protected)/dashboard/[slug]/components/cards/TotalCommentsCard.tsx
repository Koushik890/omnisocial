'use client';

import { MessageCircle } from 'lucide-react';

export function TotalCommentsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Comments</p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-1">1,482</h3>
          <p className="text-sm text-green-600 mt-1 flex items-center">
            <span className="font-medium">+12.5%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-6 h-6 text-indigo-500" />
        </div>
      </div>
    </div>
  );
}
