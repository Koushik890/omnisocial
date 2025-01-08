'use client';

import { Bell } from 'lucide-react';

export const Notifications = () => {
  return (
    <button className="relative p-2.5 bg-white rounded-xl shadow-[0_2px_8px_rgba(162,136,247,0.05)] border border-[#E5E5E5] hover:border-[#A288F7]/30 transition-all duration-200">
      <Bell className="w-4 h-4 text-[#555555]" />
      <span className="absolute top-2 right-2 w-2 h-2 bg-[#F44336] rounded-full"></span>
    </button>
  );
};
