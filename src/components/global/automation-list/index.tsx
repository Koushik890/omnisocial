'use client'

import React, { useMemo } from 'react'
import { usePaths } from '@/hooks/user-nav'
import Link from 'next/link'
import { cn, getMonth } from '@/lib/utils'
import { useQueryAutomations } from '@/hooks/user-queries'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { Activity, Clock, PlayCircle, StopCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import CreateAutomation from '../create-automation'

type KeywordType = {
  id: string
  word: string
  automationId: string | null
}

const AutomationList = () => {
  const { data } = useQueryAutomations()
  const { latestVariable } = useMutationDataState(['create-automation'])
  const { pathname } = usePaths()

  const optimisticUiData = useMemo(() => {
    if (latestVariable?.variables && data) {
      const existingIds = new Set(data.data.map(item => item.id))
      const newItems = existingIds.has(latestVariable.variables.id) 
        ? data.data 
        : [latestVariable.variables, ...data.data]
      return { data: newItems }
    }
    return data || { data: [] }
  }, [latestVariable, data])

  if (data?.status !== 200 || data.data.length <= 0) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center flex-col gap-y-4 bg-gray-50/50 rounded-lg border border-gray-100">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-600">No Automations Yet</h3>
          <p className="text-sm text-gray-500">Create your first automation to get started</p>
        </div>
        <CreateAutomation />
      </div>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {optimisticUiData.data!.map((automation) => (
        <Link
          href={`${pathname}/${automation.id}`}
          key={automation.id}
          className={cn(
            "group relative bg-white rounded-xl p-6",
            "border border-gray-200/80 shadow-sm hover:shadow-md",
            "transition-all duration-200 hover:border-primary/20",
            "hover:bg-gradient-to-br hover:from-white hover:to-primary/5"
          )}
        >
          {/* Status Indicator */}
          <div className="absolute top-4 right-4">
            <Badge 
              variant={automation.active ? "success" : "secondary"}
              className={cn(
                "flex items-center gap-x-1.5 px-2.5 py-1 font-medium",
                automation.active 
                  ? "bg-green-50 text-green-700 hover:bg-green-100" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {automation.active ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>Paused</span>
                </>
              )}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-y-4 mt-2">
            <div className="flex flex-col gap-y-1.5">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                {automation.name}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {automation.listener?.listener === 'OMNIAI' ? 'AI-Powered Response' : 'Standard Response'}
              </p>
            </div>

            {/* Keywords */}
            <div className="min-h-[32px]">
              {automation.keywords.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {(automation.keywords as KeywordType[]).map((keyword: KeywordType) => (
                    <Badge
                      key={keyword.id}
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-0.5 bg-gray-50/50",
                        "text-gray-600 border-gray-200/80",
                        "hover:bg-gray-100/80 transition-colors"
                      )}
                    >
                      {keyword.word}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs px-2 py-0.5 w-fit bg-gray-50/50",
                    "text-gray-600 border-gray-200/80",
                    "hover:bg-gray-100/80 transition-colors"
                  )}
                >
                  No Keywords
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className={cn(
              "flex items-center gap-x-4 text-sm text-gray-500",
              "mt-auto pt-3 border-t border-gray-100"
            )}>
              <div className="flex items-center gap-x-1.5">
                <Activity className="w-4 h-4" />
                <span>{automation.runs || 0} runs</span>
              </div>
              <div className="flex items-center gap-x-1.5">
                <Clock className="w-4 h-4" />
                <span>
                  {getMonth(automation.createdAt.getUTCMonth() + 1)}{' '}
                  {automation.createdAt.getUTCDate()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default AutomationList