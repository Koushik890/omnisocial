import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  description: string
  icon: React.ReactNode
  strategy: 'INSTAGRAM' | 'CRM'
}

const IntegrationCard = ({ description, icon, strategy, title }: Props) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-3xl bg-background/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 lg:gap-10 w-full sm:flex-1">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 lg:p-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12">
              {icon}
            </div>
          </div>
          
          <div className="flex flex-col text-center sm:text-left">
            <h3 className="text-xl lg:text-2xl font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{title}</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm lg:max-w-md">{description}</p>
          </div>
        </div>

        <div className="flex items-center sm:self-center w-full sm:w-auto">
          <Button
            // onClick={onInstaOAuth}
            // disabled={integrated?.name === strategy}
            className={cn(
              "relative shrink-0 w-full sm:w-auto",
              "px-6 py-4 lg:px-10 lg:py-6 text-base lg:text-lg",
              "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
              "hover:from-indigo-500/90 hover:via-purple-500/90 hover:to-pink-500/90",
              "text-white font-medium rounded-xl lg:rounded-2xl"
            )}
          >
            {/* {integrated ? 'Connected' : 'Connect'} */}
            Connect
          </Button>
        </div>
      </div>
    </div>
  )
}

export default IntegrationCard