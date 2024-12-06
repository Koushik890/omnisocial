'use client';

import { Image as ImageIcon, Users, UserPlus } from 'lucide-react';

interface StatItemProps {
  icon?: React.ReactNode;
  value: number;
  label: string;
  bgColor?: string;
  iconColor?: string;
}

function StatItem({ icon, value, label, bgColor = "bg-gradient-to-br from-blue-50 to-blue-100/50", iconColor = "text-blue-600" }: StatItemProps) {
  return (
    <div className="flex items-center gap-6 group">
      {icon && (
        <div className={`${bgColor} p-2.5 rounded-xl shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md`}>
          <div className={`w-5 h-5 ${iconColor}`}>
            {icon}
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-gray-800">
          {value.toLocaleString()}
        </span>
        <span className="text-xs font-medium text-gray-500 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
          {label}
        </span>
      </div>
    </div>
  );
}

interface ProfileStatsProps {
  posts: number;
  followers: number;
  following: number;
}

export function ProfileStats({ posts, followers, following }: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-16">
      <StatItem 
        icon={<ImageIcon className="stroke-[2.5px]" />}
        value={posts} 
        label="POSTS"
        bgColor="bg-gradient-to-br from-blue-50 to-blue-100/50"
        iconColor="text-blue-600"
      />
      <StatItem 
        icon={<Users className="stroke-[2.5px]" />}
        value={followers} 
        label="FOLLOWERS"
        bgColor="bg-gradient-to-br from-purple-50 to-purple-100/50"
        iconColor="text-purple-600"
      />
      <StatItem 
        icon={<UserPlus className="stroke-[2.5px]" />}
        value={following} 
        label="FOLLOWING"
        bgColor="bg-gradient-to-br from-pink-50 to-pink-100/50"
        iconColor="text-pink-600"
      />
    </div>
  );
}