'use client'

import React from 'react'
import { PAGE_BREAD_CRUMBS } from '@/constants/pages'
import { usePaths } from '@/hooks/user-nav'
import Sheet from '@/components/global/sheet'
import { Menu } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import ClerkAuthState from '@/components/global/clerk-auth-state'
import { HelpDuoToneWhite } from '@/icons'
import { SubscriptionPlan } from '@/components/global/subscription-plan'
import UpgradeCard from '@/components/global/sidebar/upgrade'
import Items from '@/components/global/sidebar/items'
import CreateAutomation from '@/components/global/create-automation'
import { Notifications } from './notifications'
import MainBreadCrumb from '@/components/global/bread-crumbs/main-bread-crumb'
import FollowersCard from './followers-card'
import EngagementCard from './engagement-card'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  slug: string
}

const InfoBar = ({ slug }: Props) => {
  const { page } = usePaths()
  const currentPage = PAGE_BREAD_CRUMBS.includes(page) || page === slug

  return currentPage ? (
    <div className="flex flex-col m-2">
      <div className="sticky top-2 z-50 bg-gradient-to-br from-[#F3EAFD] to-[#FCE8F7] backdrop-blur-lg shadow-[0_2px_8px_rgba(162,136,247,0.1)] rounded-3xl border border-[#E5E5E5]">
        <div className="h-20 px-4 lg:px-8 flex items-center justify-between">
          {/* Left: Menu & Breadcrumb */}
          <div className="flex items-center gap-4">
            <span className="lg:hidden">
              <Sheet
                trigger={<Menu className="h-6 w-6" />}
                className="lg:hidden"
                side="left"
                title="Navigation Menu"
              >
                <div className="flex flex-col gap-y-5 w-full h-full bg-gradient-to-b from-[#A288F7] via-[#A288F7]/95 to-[#F7C1E4] backdrop-filter backdrop-blur-xl">
                  <div className="flex items-center justify-center transition-all duration-300 mt-4 h-[40px] px-3">
                    <Image 
                      src="/logo.png"
                      alt="Logo"
                      width={150}
                      height={32}
                      className="transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col py-3">
                    <Items page={page} slug={slug} />
                  </div>
                  <div className="px-16">
                    <Separator
                      orientation="horizontal"
                      className="bg-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 px-3">
                    <ClerkAuthState />
                    <Link
                      href={`/dashboard/${slug}/help`}
                      className={cn(
                        "flex items-center gap-x-3 rounded-full p-2.5 transition-all duration-200 hover:bg-white/10",
                        page === 'help' ? "bg-[#8D4AF3] text-white shadow-md" : "text-white/80"
                      )}
                    >
                      <div className="flex items-center justify-center h-9 w-9 ring-2 ring-white/30 rounded-full">
                        <HelpDuoToneWhite />
                      </div>
                      <span className="font-medium">Help</span>
                    </Link>
                  </div>
                  <div className="flex-1" />
                  <SubscriptionPlan type="FREE">
                    <UpgradeCard />
                  </SubscriptionPlan>
                </div>
              </Sheet>
            </span>
            <MainBreadCrumb page={page === slug ? 'Home' : page} slug={slug} />
          </div>

          {/* Right: Stats & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <FollowersCard />
              <EngagementCard />
            </div>
            <CreateAutomation />
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default InfoBar