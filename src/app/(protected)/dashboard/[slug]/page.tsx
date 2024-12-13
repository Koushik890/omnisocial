import { SocialCommentsCard } from './components/cards/SocialCommentsCard';
import { RecentPostsCard } from './components/cards/RecentPostsCard';
import { AutomatedActivityCard } from './components/cards/AutomatedActivityCard';
import { SetupAutoRepliesCard } from './components/cards/SetupAutoRepliesCard';
import { AnswerQuestionsCard } from './components/cards/AnswerQuestionsCard';
import { TotalCommentsCard } from './components/cards/TotalCommentsCard';
import { CommentRepliesCard } from './components/cards/CommentRepliesCard';
import { InstagramAlert } from './components/instagram/InstagramAlert';

export default function DashboardPage() {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <InstagramAlert />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* First Column - Analytics Overview */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 flex flex-col">
          <SocialCommentsCard />
          <div className="flex-1">
            <AutomatedActivityCard className="h-full w-full" />
          </div>
        </div>

        {/* Second and Third Columns */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Stats Row */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <TotalCommentsCard />
            <CommentRepliesCard />
          </div>

          {/* Action Cards Column */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <SetupAutoRepliesCard />
            <AnswerQuestionsCard />
          </div>

          {/* Recent Posts - Full Width */}
          <div className="sm:col-span-2">
            <RecentPostsCard />
          </div>
        </div>
      </div>
    </div>
  );
}