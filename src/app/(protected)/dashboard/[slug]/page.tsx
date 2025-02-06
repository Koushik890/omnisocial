'use client';

import { AutomatedActivityCard } from './components/cards/AutomatedActivityCard';
import { useQuery } from '@tanstack/react-query';
import { onUserInfo } from '@/actions/user';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: userInfo } = useQuery({
    queryKey: ['user-profile'],
    queryFn: onUserInfo,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = userInfo?.data?.firstname || '';
  const today = new Date();
  const dayAndDate = format(today, 'EEEE, MMMM d');

  return (
    <div className="w-full pt-[49px]">
      <div className="flex flex-col items-center">
        <h2 className="block w-[1200px] h-[20px] mb-1 text-center text-[16px] font-medium leading-[20px] font-['Plus_Jakarta_Sans',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Helvetica,Arial,sans-serif] text-[#282d47]">
          {dayAndDate}
        </h2>
        <h1 className="block w-[1200px] h-[40px] m-0 p-0 text-center text-[32px] font-medium leading-[40px] font-['Plus_Jakarta_Sans',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Helvetica,Arial,sans-serif] text-[#282d47]">
          {getGreeting()}, {firstName}
        </h1>
      </div>
      <div className="mt-8 flex justify-center">
        <div className="w-[1200px] flex">
          <div className="w-[900px]">
            <div className="pl-[8px]">
              <AutomatedActivityCard className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}