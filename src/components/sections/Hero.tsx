import Image from "next/image"
import { MessageCircle, Instagram, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from 'next/link'

const TextBlock = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-gray-700 leading-relaxed ${className}`}>{children}</p>
)

export function Hero() {
  return (
    <div className="relative grid lg:grid-cols-2 gap-12 items-center p-8 md:p-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100">
      <div className="space-y-8 md:space-y-11 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-gray-900 leading-tight">
          Automate Your <span className="text-[#6F1FB6] relative tracking-wide">
            Instagram
            <span className="absolute -inset-1 bg-[#6F1FB6] opacity-10 rounded-lg blur-sm"></span>
          </span>
          <br />
          Engagement
        </h1>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6F1FB6]/20 to-[#FF6F61]/20 flex items-center justify-center shadow-md flex-shrink-0">
            <MessageCircle className="h-6 w-6 text-[#6F1FB6]" />
          </div>
          <TextBlock>
            Securely monitor Instagram comments and respond automatically based on custom rules.
          </TextBlock>
        </div>
        <div className="pt-2">
          <Link href="/sign-up">
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-[#6F1FB6] hover:bg-[#6F1FB6]/90 text-white font-semibold py-3 px-8 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative lg:h-[600px]">
        <div className="absolute -z-10 right-0 top-0 h-[550px] w-[550px] bg-gradient-to-br from-[#6F1FB6]/10 to-[#FF6F61]/10 rounded-full blur-3xl opacity-70"></div>
        
        {/* Main Image Container */}
        <div className="relative h-[400px] lg:h-[550px] w-full overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dc986d4c-77aa-4a88-8c51-26b7ce8be5cb.jpg-wVFBuqKClhEPOCuTRf0THNdxQt7NYE.jpeg"
            alt="Woman using automateinstareply on laptop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Instagram Icon */}
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg">
            <Instagram className="h-6 w-6 text-[#6F1FB6]" aria-label="Instagram icon" />
          </div>
          
          {/* Lightning Icon */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg">
            <Zap className="h-6 w-6 text-[#FFD000]" aria-label="Zap icon"/>
          </div>

          {/* Stats Card */}
          <Card className="absolute left-6 top-1/4 p-4 space-y-2 bg-white/95 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-[#6F1FB6]" />
              <span className="font-semibold text-gray-900">Auto-Replies</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">1,234</span>
              <span className="text-sm text-gray-600">comments handled</span>
            </div>
          </Card>

          {/* Analytics Card */}
          <Card className="absolute right-6 bottom-20 p-3 w-[180px] bg-white/95 backdrop-blur-sm shadow-lg border-0">
            <div className="relative h-[80px] w-full bg-gradient-to-br from-[#F4EBFF] to-[#FFF5F5] rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-end">
                <div className="w-1/4 h-[30%] bg-[#6F1FB6]/20"></div>
                <div className="w-1/4 h-[50%] bg-[#6F1FB6]/40"></div>
                <div className="w-1/4 h-[70%] bg-[#6F1FB6]/60"></div>
                <div className="w-1/4 h-[90%] bg-[#6F1FB6]/80"></div>
              </div>
              <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 rounded-full">
                <span className="text-xs font-semibold text-green-700">+150%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
