'use client';

type Props = {
  followers: number;
  followerChange: number;
  formatNumber: (num: number) => string;
};

const FollowersCard = ({ followers, followerChange, formatNumber }: Props) => {
  return (
    <div className="px-4 py-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(162,136,247,0.05)] border border-[#E5E5E5]">
      <p className="text-xs font-medium text-[#555555] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A288F7]"></span>
        Followers
      </p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-sm font-semibold text-[#2D2D2D]">
          {formatNumber(followers)}
        </span>
        <span className="text-xs font-medium text-[#10B981] flex items-center">
          <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
          </svg>
          +{followerChange}%
        </span>
      </div>
    </div>
  );
};

export default FollowersCard;
