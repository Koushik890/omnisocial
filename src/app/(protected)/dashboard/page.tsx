import { onUserInfo } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const userInfo = await onUserInfo()
  
  if (userInfo.status === 200 && userInfo.data) {
    const { firstname, lastname } = userInfo.data
    if (!firstname || !lastname) {
      // If user doesn't have a name set, redirect them to onboarding
      redirect('/sign-up')
    }
    redirect(`/dashboard/${firstname}${lastname}`)
  }

  redirect('/sign-in')
}

export default Page