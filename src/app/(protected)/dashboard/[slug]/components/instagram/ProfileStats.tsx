'use client';

import { Image as ImageIcon, Users as Users2Icon, UserPlus as UserPlusIcon } from 'lucide-react';
import { formatInstagramCount } from '@/lib/utils/formatInstagramCount';

interface StatItemProps {
  icon?: React.ReactNode;
  value: number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  const formattedValue = formatInstagramCount(value)

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <div className="p-1 sm:p-2 bg-purple-50 rounded-md sm:rounded-lg shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs sm:text-base font-semibold text-gray-900 leading-tight">{formattedValue}</span>
        <span className="text-[10px] sm:text-sm text-gray-600 leading-tight">{label}</span>
      </div>
    </div>
  )
}

interface ProfileStatsProps {
  posts: number;
  followers: number;
  following: number;
}

export function ProfileStats({ posts, followers, following }: ProfileStatsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between sm:justify-center sm:gap-20 w-full">
      <StatItem 
        icon={<ImageIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-purple-600 stroke-[2.5px]" />}
        value={posts} 
        label="Posts"
      />
      <StatItem 
        icon={<Users2Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-purple-600 stroke-[2.5px]" />}
        value={followers} 
        label="Followers"
      />
      <StatItem 
        icon={<UserPlusIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-purple-600 stroke-[2.5px]" />}
        value={following} 
        label="Following"
      />
    </div>
  );
}