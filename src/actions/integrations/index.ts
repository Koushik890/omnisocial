"use server"

import { redirect } from 'next/navigation'
import { onCurrentUser } from '../user'
import { createIntegration, getIntegration } from './queries'
import { generateTokens } from '@/lib/fetch'
import axios from 'axios'
import { ApiResponse, UserProfile } from '@/types/user'

export const onOauthInstagram = async (strategy: 'INSTAGRAM' | 'CRM') => {
    if (strategy === 'INSTAGRAM') {
        const oauthUrl = process.env.INSTAGRAM_EMBEDDED_OAUTH_URL;
        if (!oauthUrl) {
            throw new Error('Instagram OAuth URL is not configured');
        }
        return redirect(oauthUrl);
    }
}

export const onIntegrate = async (code: string): Promise<ApiResponse<UserProfile>> => {
    const user = await onCurrentUser()
    if (user.status !== 200 || !user.data) {
      return { status: 401, data: undefined, error: 'Unauthorized' }
    }
  
    try {
      const integration = await getIntegration(user.data.id)
  
      if (integration && integration.integrations.length === 0) {
        const token = await generateTokens(code)
        console.log(token)
  
        if (token) {
          const insta_id = await axios.get(
            `${process.env.INSTAGRAM_BASE_URL}/me?fields=user_id&access_token=${token.access_token}`
          )
  
          const today = new Date()
          const expire_date = today.setDate(today.getDate() + 60)
          const create = await createIntegration(
            user.data.id,
            token.access_token,
            new Date(expire_date),
            insta_id.data.user_id
          )
          return { status: 200, data: create }
        }
        console.log('🔴 401')
        return { status: 401, error: 'Unauthorized' }
      }
      console.log('🔴 404')
      return { status: 404, error: 'Integration not found' }
    } catch (error) {
      console.log('🔴 500', error)
      return { status: 500, error: 'Internal server error' }
    }
  }
