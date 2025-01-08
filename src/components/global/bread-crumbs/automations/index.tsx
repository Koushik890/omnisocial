'use client'
import { ChevronRight, Menu, PencilIcon } from 'lucide-react'
import React from 'react'
import ActivateAutomationButton from '../../activate-automation-button'
import { useQueryAutomation } from '@/hooks/user-queries'
import { useEditAutomation } from '@/hooks/use-automations'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { Input } from '@/components/ui/input'
import Sheet from '@/components/global/sheet'
import { Separator } from '@/components/ui/separator'
import ClerkAuthState from '@/components/global/clerk-auth-state'
import { HelpDuoToneWhite } from '@/icons'
import { SubscriptionPlan } from '@/components/global/subscription-plan'
import UpgradeCard from '@/components/global/sidebar/upgrade'
import Items from '@/components/global/sidebar/items'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePaths } from '@/hooks/user-nav'
import { useParams } from 'next/navigation'

type Props = {
  id: string
}

const AutomationsBreadCrumb = ({ id }: Props) => {
  const { data } = useQueryAutomation(id)
  const { edit, enableEdit, inputRef, isPending } = useEditAutomation(id)
  const { latestVariable } = useMutationDataState(['update-automation'])
  const { page } = usePaths()
  const params = useParams()
  const slug = params?.slug as string

  return (
    <div className="rounded-full w-full p-5 bg-[#18181B1A] flex items-center">
      <div className="flex items-center gap-x-3 min-w-0">
        {/* Hamburger Menu - Only visible on mobile */}
        <span className="lg:hidden flex items-center">
          <Sheet
            trigger={<Menu className="h-6 w-6 text-[#9B9CA0] hover:text-[#6F1FB6] transition-colors" />}
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

        <div className="flex items-center gap-x-3">
          <p className="text-[#9B9CA0] truncate">Automations</p>
          <ChevronRight
            className="flex-shrink-0"
            color="#9B9CA0"
          />
        </div>
        <span className="flex gap-x-3 items-center min-w-0">
          {edit ? (
            <Input
              ref={inputRef}
              placeholder={
                isPending ? latestVariable.variables : 'Add a new name'
              }
              className="bg-transparent h-auto outline-none text-base border-none p-0"
            />
          ) : (
            <p className="text-[#9B9CA0] truncate">
              {latestVariable?.variables
                ? latestVariable?.variables.name
                : data?.data?.name}
            </p>
          )}
          {edit ? (
            <></>
          ) : (
            <span
              className="cursor-pointer hover:opacity-75 duration-100 transition flex-shrink-0 mr-4"
              onClick={enableEdit}
            >
              <PencilIcon size={14} />
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-x-5 ml-auto">
        <p className="hidden md:block text-text-secondary/60 text-sm truncate min-w-0">
          All states are automatically saved
        </p>
        <div className="flex gap-x-5 flex-shrink-0">
          <p className="text-text-secondary text-sm truncate min-w-0">
            Changes Saved
          </p>
        </div>
      </div>
      <ActivateAutomationButton id={id} />
    </div>
  )
}

export default AutomationsBreadCrumb