import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function AnswerQuestionsCard() {
  return (
    <Card className="relative h-[156px] bg-[#1a1f37] bg-gradient-to-br from-[#1a1f37] to-[#111627] rounded-2xl shadow-[0_2px_8px_rgba(162,136,247,0.05)] hover:shadow-[0_4px_12px_rgba(162,136,247,0.1)] transition-all duration-200">
      <div className="h-full p-6">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="mb-auto">
            <h3 className="text-[15px] font-semibold text-white mb-0.5">
              Answer Questions with AI
            </h3>
            <p className="text-[13px] text-gray-400">
              Identify and respond to queries with AI
            </p>
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="pr-4 leading-relaxed">The intention of the message will be automatically detected</span>
            <Link 
              href="/dashboard/ai-responses"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2563eb] text-white flex-shrink-0 transition-transform hover:scale-105 hover:shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
