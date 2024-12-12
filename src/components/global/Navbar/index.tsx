'use client';

import React, { useState } from 'react';
import { PAGE_BREAD_CRUMBS } from '@/constants/pages';
import { usePaths } from '@/hooks/user-nav';
import Sheet from '@/components/global/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import ClerkAuthState from '@/components/global/clerk-auth-state';
import { HelpDuoToneWhite } from '@/icons';
import { SubscriptionPlan } from '@/components/global/subscription-plan';
import UpgradeCard from '@/components/global/sidebar/upgrade';
import Items from '@/components/global/sidebar/items';
import { Sidebar } from '@/components/global/sidebar';
import CreateAutomation from '@/components/global/create-automation';
import { Notifications } from '@/components/global/Navbar/notifications';
import MainBreadCrumb from '@/components/global/bread-crumbs/main-bread-crumb';
import FollowersCard from './followers-card';
import EngagementCard from './engagement-card';

type InstagramStats = {
  followers: number;
  engagement: number;
  followerChange: number;
  engagementChange: number;
};

type Props = {
  slug: string;
};

const Navbar = ({ slug }: Props) => {
  const { page } = usePaths();
  const currentPage = PAGE_BREAD_CRUMBS.includes(page) || page === slug;

  // Example stats (could be fetched from props or hooks)
  const [stats] = useState<InstagramStats>({
    followers: 226000000,
    engagement: 4.8,
    followerChange: 12,
    engagementChange: -2,
  });

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    currentPage && (
      <div className="flex flex-col min-h-screen bg-[#0e0e0e] bg-opacity-90 relative">
        {/* Desktop Sidebar */}
        <Sidebar slug={slug} />

        {/* Main Content Area (Header + Page Content) */}
        <div className="md:ml-[250px] transition-all duration-300 flex-1 flex flex-col">
          {/* Header Section */}
          <header className="sticky top-0 z-50 bg-gradient-to-br from-[#F3EAFD] to-[#FCE8F7] backdrop-blur-lg shadow-[0_2px_8px_rgba(162,136,247,0.1)] rounded-3xl border border-[#E5E5E5] m-2">
            <div className="h-20 px-4 lg:px-8 flex items-center justify-between">
              {/* Left: Welcome + Stats */}
              <div className="flex flex-col">
                <h1 className="flex items-center gap-2 text-xl font-semibold text-[#2D2D2D]">
                  Welcome back, Kylie
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-[#8D4AF3]/10 text-[#8D4AF3] rounded-full">
                    Pro
                  </span>
                </h1>
                <p className="text-sm text-[#555555] mt-0.5">
                  Here's what's happening with your social media accounts today.
                </p>
              </div>

              {/* Right: Quick Access (Stats, Search, Automation, Notifications) */}
              <div className="flex items-center gap-3 lg:gap-6">
                {/* Quick Stats */}
                <div className="hidden lg:flex gap-4">
                  <FollowersCard 
                    followers={stats.followers}
                    followerChange={stats.followerChange}
                    formatNumber={formatNumber}
                  />
                  <EngagementCard 
                    engagement={stats.engagement}
                    engagementChange={stats.engagementChange}
                  />
                </div>

                {/* Create Automation */}
                <CreateAutomation />

                {/* Notifications */}
                <Notifications />

                {/* Mobile Sidebar Trigger */}
                <div className="flex lg:hidden">
                  <Sheet
                    trigger={<Menu />}
                    className="lg:hidden"
                    side="left"
                  >
                    <div className="flex flex-col gap-y-5 w-full h-full p-3 bg-[#0e0e0e] bg-opacity-90 backdrop-filter backdrop-blur-3xl">
                      <div className="flex gap-x-2 items-center p-5 justify-center">
                        <Image
                          src="/logo-small.png"
                          alt="Logo"
                          width={32}
                          height={32}
                          priority
                        />
                      </div>
                      <div className="flex flex-col py-3">
                        <Items page={page} slug={slug} />
                      </div>
                      <div className="px-16">
                        <Separator
                          orientation="horizontal"
                          className="bg-[#333336]"
                        />
                      </div>
                      <div className="px-3 flex flex-col gap-y-5">
                        <div className="flex gap-x-2">
                          <ClerkAuthState />
                          <p className="text-[#9B9CA0]">Profile</p>
                        </div>
                        <div className="flex gap-x-3">
                          <HelpDuoToneWhite />
                          <p className="text-[#9B9CA0]">Help</p>
                        </div>
                      </div>
                      <SubscriptionPlan type="FREE">
                        <div className="flex-1 flex flex-col justify-end">
                          <UpgradeCard />
                        </div>
                      </SubscriptionPlan>
                    </div>
                  </Sheet>
                </div>
              </div>
            </div>
          </header>

          {/* Breadcrumb */}
          <MainBreadCrumb
            page={page === slug ? 'Home' : page}
            slug={slug}
          />

          {/* Page content would go here */}
          <div className="p-4">
            {/* Your main page content */}
          </div>
        </div>
      </div>
    )
  );
};

export default Navbar;