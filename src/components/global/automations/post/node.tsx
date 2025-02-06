'use client'
import React from 'react'
import { useQueryAutomation } from '@/hooks/user-queries'
import { Warning } from '@/icons'
import PostButton from './index'

type Props = {
    id: string
}

const PostNode = ({ id }: Props) => {
    const { data } = useQueryAutomation(id)
    const commentTrigger = data?.data?.trigger.find((t) => t.type === 'COMMENT')

    if (!commentTrigger || !data?.data?.posts || data.data.posts.length > 0) return null

    return (
        <div className="w-full lg:w-10/12 xl:w-6/12 p-5 rounded-xl flex flex-col bg-white/95 gap-y-3 text-gray-900 backdrop-blur-sm border border-black/10 shadow-lg">
            <div className="flex items-center gap-2">
                <Warning />
                Posts...
            </div>
            <PostButton id={id} />
        </div>
    )
}

export default PostNode
