import { StatsCard } from '../stats/StatsCard';
import { SessionTimeCard } from '../cards/SessionTimeCard';
import { SocialCommentsCard } from '../cards/SocialCommentsCard';
import { RecentPostsCard } from '../cards/RecentPostsCard';
import { EngagementCard } from '../cards/EngagementCard';

export function DashboardGrid() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* First Column - Analytics Overview */}
      <div className="lg:col-span-1 space-y-6">
        <SocialCommentsCard />
        <EngagementCard />
      </div>

      {/* Second and Third Columns */}
      <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
        {/* Stats Row */}
        <div className="flex flex-col justify-center space-y-6">
          <StatsCard
            type="single"
            title="Total Comments"
            currentValue={8250}
            previousValue={7580}
            change={8.8}
            period="last week"
            gradient="from-pink-500/20 to-purple-500/20"
          />
          <StatsCard
            type="single"
            title="Comment Replies"
            currentValue={3240}
            previousValue={2890}
            change={12.1}
            period="last week"
            gradient="from-purple-500/20 to-pink-500/20"
          />
        </div>

        {/* Session Time Card */}
        <SessionTimeCard />

        {/* Recent Posts - Full Width */}
        <div className="md:col-span-2">
          <RecentPostsCard />
        </div>
      </div>
    </div>
  );
}