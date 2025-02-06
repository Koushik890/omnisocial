import { Card } from "@/components/ui/card"
import { statistics } from "@/lib/data"
import { cn } from "@/lib/utils"

export function Statistics() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F4EBFF]/30 to-white" />
      <div className="absolute w-[500px] h-[500px] -right-40 top-0 bg-[#6F1FB6]/5 rounded-full blur-3xl" />
      <div className="absolute w-[500px] h-[500px] -left-40 bottom-0 bg-[#FFD000]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover why <span className="text-[#6F1FB6] relative">
              1M+ brands
              <span className="absolute -inset-1 bg-[#6F1FB6] opacity-10 rounded-lg blur-sm"></span>
            </span> trust Automateinstareply
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of businesses that use our platform to grow their Instagram presence
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statistics.map((stat, index) => (
            <Card 
              key={index} 
              className={cn(
                "group relative bg-white hover:bg-gradient-to-br p-6 md:p-8",
                "from-white to-[#F4EBFF]/50 rounded-3xl border-0",
                "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              )}
            >
              {/* Icon Container */}
              <div className="mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#6F1FB6] to-[#9747FF] rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>

              {/* Stat Value */}
              <div className="relative">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-base text-gray-600">
                  {stat.title}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute right-4 top-4 w-20 h-20 bg-gradient-to-br from-[#6F1FB6]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-6 bottom-6 w-3 h-3 bg-[#6F1FB6] rounded-full opacity-0 group-hover:opacity-20" />
              <div className="absolute right-8 bottom-8 w-2 h-2 bg-[#FFD000] rounded-full opacity-0 group-hover:opacity-20" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
