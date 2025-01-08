import { PAGE_ICON } from '@/constants/pages'
import { Settings } from '@/icons/settings'
import React from 'react'

type Props = {
  page: string
  slug?: string
}

const MainBreadCrumb = ({ page, slug }: Props) => {
  // Extract first name by finding the position where the case changes from lower to upper
  const getFirstName = (name?: string) => {
    if (!name) return ''
    const upperCaseIndex = name.split('').findIndex((char, i) => 
      i > 0 && char === char.toUpperCase()
    )
    return upperCaseIndex > 0 ? name.slice(0, upperCaseIndex) : name
  }

  const firstName = getFirstName(slug)

  const normalizedPage = page.toLowerCase()

  if (normalizedPage === 'home') {
    return (
      <div className="flex flex-col items-start">
        <div className="flex justify-center w-full">
          <div className="flex flex-col">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-[#2D2D2D]">
              Welcome back{firstName && `, ${firstName}!`}
            </h1>
            <p className="text-sm text-[#6B7280]">Here's what's happening with your social media accounts today.</p>
          </div>
        </div>
      </div>
    )
  }

  if (normalizedPage === 'settings' || normalizedPage === 'integrations' || normalizedPage === 'automations') {
    return (
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          {normalizedPage === 'settings' ? <Settings /> : PAGE_ICON[page.toUpperCase()]}
          <h2 className="font-semibold text-xl text-[#2D2D2D] capitalize">{page}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start">
      <span className="bg-gradient-to-br from-[#F3EAFD] to-[#FCE8F7] backdrop-blur-lg shadow-[0_2px_8px_rgba(162,136,247,0.1)] rounded-3xl border border-[#E5E5E5] inline-flex py-5 lg:py-10 px-8 gap-x-2 items-center">
        {PAGE_ICON[page.toUpperCase()]}
        <h2 className="font-semibold text-3xl capitalize text-[#2D2D2D]">{page}</h2>
      </span>
    </div>
  )
}

export default MainBreadCrumb
