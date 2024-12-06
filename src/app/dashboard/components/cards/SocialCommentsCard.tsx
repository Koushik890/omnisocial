'use client';

import { CommentsList } from '../social/CommentsList';

export function SocialCommentsCard() {
  return (
    <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Social Comments</h2>
          <div className="bg-white/80 rounded-full px-3 py-1 text-sm font-medium text-purple-600">
            Live
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-gray-900">64%</div>
            <div className="flex items-center text-sm">
              <span className="text-gray-600">Local</span>
              <span className="ml-2 text-green-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                12%
              </span>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-3xl font-bold text-gray-900">36%</div>
            <div className="flex items-center justify-end text-sm">
              <span className="text-gray-600">Global</span>
              <span className="ml-2 text-red-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                2%
              </span>
            </div>
          </div>
        </div>
        <CommentsList />
      </div>
    </div>
  );
}