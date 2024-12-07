import { DashboardGrid } from './components/layout/DashboardGrid';
import { InstagramAlert } from './components/instagram/InstagramAlert';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <InstagramAlert />
      <DashboardGrid />
    </div>
  );
}