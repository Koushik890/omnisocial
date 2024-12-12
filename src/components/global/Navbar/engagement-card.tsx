'use client';

type Props = {
  engagement: number;
  engagementChange: number;
};

const EngagementCard = ({ engagement, engagementChange }: Props) => {
  return (
    <div className="px-4 py-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(162,136,247,0.05)] border border-[#E5E5E5]">
      <p className="text-xs font-medium text-[#555555] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F7C1E4]"></span>
        Engagement
      </p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-sm font-semibold text-[#2D2D2D]">
          {engagement}%
        </span>
        <span className="text-xs font-medium text-[#F44336] flex items-center">
          <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
          </svg>
          {engagementChange}%
        </span>
      </div>
    </div>
  );
};

export default EngagementCard;
