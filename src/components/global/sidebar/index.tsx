'use client';

import { usePaths } from '@/hooks/user-nav';
import Image from 'next/image';
import React, { useState } from 'react';
import Items from './items';
import { Separator } from '@/components/ui/separator';
import ClerkAuthState from '@/components/global/clerk-auth-state';
import { SubscriptionPlan } from '@/components/global/subscription-plan';
import UpgradeCard from './upgrade';
import Link from 'next/link';
import { HelpDuoToneWhite } from '@/icons/help-duotone-white';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  slug: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar = ({ slug, onCollapsedChange }: Props) => {
  const { page } = usePaths();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  return (
    <>
      <div
        className={cn(
          "fixed left-0 border-[1px] border-[#E5E5E5] bg-gradient-to-b from-[#A288F7] via-[#A288F7]/95 to-[#F7C1E4] bottom-0 top-0 m-2 rounded-[24px] overflow-visible z-50 shadow-lg transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-[250px]",
          "lg:block hidden max-[1024px]:hidden" // Show on lg screens, hide on tablet and mobile
        )}
      >
        <div className="relative w-full h-full">
          <button
            onClick={handleCollapse}
            className="absolute right-[-20px] top-[330px] -translate-y-1/2 bg-[#8D4AF3] hover:bg-[#A288F7] backdrop-blur-lg p-2 rounded-full transition-all duration-200 border-2 border-white/30 z-50 shadow-[0_0_10px_rgba(141,74,243,0.5)] hover:shadow-[0_0_15px_rgba(141,74,243,0.7)]"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-white" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-white" />
            )}
          </button>
          <div
            className="flex flex-col gap-y-5 w-full h-full p-3 bg-white/5 backdrop-filter backdrop-blur-xl rounded-[24px]"
          >
            <div className={cn(
              "flex items-center transition-all duration-300 mt-4 relative h-[40px]",
              isCollapsed ? "justify-center px-2" : "px-3 justify-center"
            )}>
              <Image 
                src="/logo.png"
                alt="Logo"
                width={150}
                height={32}
                className={cn(
                  "transition-all duration-300 absolute left-1/2 -translate-x-1/2",
                  isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"
                )}
              />
              <Image 
                src="/logo_1.png"
                alt="Small Logo"
                width={35}
                height={35}
                className={cn(
                  "transition-all duration-300 absolute left-1/2 -translate-x-1/2",
                  isCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              />
            </div>
            <div className="flex flex-col py-3">
              <Items page={page} slug={slug} isCollapsed={isCollapsed} />
            </div>
            <div className={cn("transition-all duration-300", isCollapsed ? "px-4" : "px-16")}>
              <Separator
                orientation="horizontal"
                className="bg-white/20"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <ClerkAuthState isCollapsed={isCollapsed} />
              <Link
                href={`/dashboard/${slug}/help`}
                className={cn(
                  "flex items-center rounded-full p-2.5 transition-all duration-200 hover:bg-white/10",
                  isCollapsed ? "justify-center" : "gap-x-3",
                  page === 'help' ? "bg-[#8D4AF3] text-white shadow-md" : "text-white/80"
                )}
              >
                <div className="flex items-center justify-center h-9 w-9 ring-2 ring-white/30 rounded-full">
                  <HelpDuoToneWhite />
                </div>
                {!isCollapsed && <span className="font-medium">Help</span>}
              </Link>
            </div>
            {!isCollapsed && (
              <SubscriptionPlan type="FREE">
                <div className="flex-1 flex flex-col justify-end">
                  <UpgradeCard />
                </div>
              </SubscriptionPlan>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { Sidebar };
