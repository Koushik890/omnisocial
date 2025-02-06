import { Zap, BarChart3, Users } from 'lucide-react'
import { Card } from "@/components/ui/card"
import React from 'react'

const TextBlock = ({ children, className = "" }: { 
  children: React.ReactNode, 
  className?: string 
}) => (
  <p className={`text-gray-600 leading-relaxed ${className}`}>{children}</p>
)

export function Features() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <Card className="group relative p-8 bg-gradient-to-br from-[#F4EBFF] to-[#FCE7F6] rounded-3xl border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="absolute inset-0 bg-white/40 rounded-3xl backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md rotate-3 group-hover:rotate-6 transition-transform">
            <Zap className="h-7 w-7 text-[#6F1FB6]" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Smart Automation</h2>
          <TextBlock>
            Create tailored replies based on keywords and prompts for efficient engagement.
          </TextBlock>
        </div>
      </Card>

      <Card className="group relative p-8 bg-gradient-to-br from-[#EDF5FF] to-[#F4EBFF] rounded-3xl border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="absolute inset-0 bg-white/40 rounded-3xl backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md -rotate-3 group-hover:-rotate-6 transition-transform">
              <BarChart3 className="h-7 w-7 text-[#6F1FB6]" />
            </div>
            <span className="text-sm font-medium bg-white/80 backdrop-blur px-4 py-1.5 rounded-full shadow-sm text-[#6F1FB6]">
              Real-time
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Insightful Analytics</h2>
          <TextBlock>
            Track engagement metrics and optimize your Instagram strategy with data-driven insights.
          </TextBlock>
        </div>
      </Card>

      <Card className="group relative p-8 bg-gradient-to-br from-[#FFF9E6] to-[#FFF5E6] rounded-3xl border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="absolute inset-0 bg-white/40 rounded-3xl backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md rotate-3 group-hover:rotate-6 transition-transform">
              <Users className="h-7 w-7 text-[#6F1FB6]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Community Growth</h2>
          <TextBlock>
            Foster meaningful connections and grow your Instagram community organically.
          </TextBlock>
        </div>
      </Card>
    </div>
  )
}
