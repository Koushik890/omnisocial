import { Zap, BarChart3, Users } from 'lucide-react'
import { Card } from "@/components/ui/card"
import React from 'react'

const TextBlock = ({ children, className = "" }: { 
  children: React.ReactNode, 
  className?: string 
}) => (
  <p className={`text-gray-700 leading-relaxed ${className}`}>{children}</p>
)

export function Features() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl">
        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
          <Zap className="h-6 w-6 text-yellow-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Smart Automation</h2>
        <TextBlock>
          Create tailored replies based on keywords and prompts for efficient engagement.
        </TextBlock>
      </Card>

      <Card className="p-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-sm font-semibold bg-white px-3 py-1 rounded-full shadow">Real-time</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Insightful Analytics</h2>
        <TextBlock>
          Track engagement metrics and optimize your Instagram strategy with data-driven insights.
        </TextBlock>
      </Card>

      <Card className="p-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <Users className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Community Growth</h2>
        <TextBlock>
          Foster meaningful connections and grow your Instagram community organically.
        </TextBlock>
      </Card>
    </div>
  )
}
