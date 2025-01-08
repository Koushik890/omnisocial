import { RecentPostsCard } from './components/cards/RecentPostsCard';
import { AutomatedActivityCard } from './components/cards/AutomatedActivityCard';
import { SetupAutoRepliesCard } from './components/cards/SetupAutoRepliesCard';
import { AnswerQuestionsCard } from './components/cards/AnswerQuestionsCard';
import { TotalCommentsCard } from './components/cards/TotalCommentsCard';
import { CommentRepliesCard } from './components/cards/CommentRepliesCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* First Column with Extended Automated Activity */}
        <div className="lg:col-span-2">
          <div className="h-full">
            <AutomatedActivityCard className="h-full" />
          </div>
        </div>

        {/* Action Cards Column */}
        <div className="lg:col-span-1">
          <div className="flex flex-col justify-between space-y-4 sm:space-y-6">
            <SetupAutoRepliesCard />
            <AnswerQuestionsCard />
          </div>
        </div>

        {/* Left Column for Stats */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <TotalCommentsCard />
          <CommentRepliesCard />
        </div>

        {/* Recent Posts - Extended */}
        <div className="lg:col-span-2">
          <RecentPostsCard />
        </div>
      </div>
    </div>
  );
}