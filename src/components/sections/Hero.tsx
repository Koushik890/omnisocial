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
    <div className="grid lg:grid-cols-2 gap-12 items-center p-8 bg-[#F9F9F9] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg border border-gray-100">
      <div className="space-y-11">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-[#333333] leading-tight">
          Automate Your <span className="text-[#6F1FB6] relative tracking-wide">
            Instagram
            <span className="absolute -inset-1 bg-[#6F1FB6] opacity-10 rounded-lg blur"></span>
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
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-[#FFD000] hover:bg-[#FFD000]/90 text-[#333333] font-semibold py-3 px-8 text-lg border-2 border-transparent hover:border-[#FFD000]/30">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -z-10 right-0 top-0 h-[550px] w-[550px] bg-gradient-to-br from-[#6F1FB6]/10 to-[#FF6F61]/10 rounded-full blur-2xl opacity-70"></div>
        <div className="relative h-[550px] overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dc986d4c-77aa-4a88-8c51-26b7ce8be5cb.jpg-wVFBuqKClhEPOCuTRf0THNdxQt7NYE.jpeg"
            alt="Woman using automateinstareply on laptop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-2">
            <Instagram className="h-8 w-8 text-[#6F1FB6]" aria-label="Instagram icon" />
          </div>
          <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-2">
            <Zap className="h-8 w-8 text-yellow-400" aria-label="Zap icon"/>
          </div>
          <Card className="absolute left-6 top-1/4 p-4 space-y-2 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-[#6F1FB6]" />
              <span className="font-semibold">Auto-Replies</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">1,234</span>
              <span className="text-sm text-gray-500">comments handled</span>
            </div>
          </Card>
          <Card className="absolute right-6 bottom-20 p-2 w-[180px] bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="p-0.5">
              <div className="h-[80px] w-full bg-gradient-to-t from-[#6F1FB6]/20 to-[#FF6F61]/20 rounded-lg relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#6F1FB6] opacity-50 rounded-b-lg"></div>
                <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[#6F1FB6] opacity-50 rounded-b-lg"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#6F1FB6] opacity-50 rounded-b-lg"></div>
                <div className="absolute top-1 right-1 text-[10px] font-semibold text-[#6F1FB6]">+150%</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
