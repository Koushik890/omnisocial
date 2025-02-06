'use client';

import { Bell } from 'lucide-react';

export const Notifications = () => {
  return (
    <button className="relative p-2.5 bg-white/60 hover:bg-white/80 transition-all duration-200 rounded-2xl shadow-sm">
      <Bell className="w-4 h-4 text-[#555555]" />
      <span className="absolute top-2 right-2 w-2 h-2 bg-[#F44336] rounded-full"></span>
    </button>
  );
};
