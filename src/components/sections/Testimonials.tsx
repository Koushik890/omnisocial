import { Star } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { testimonials } from "@/lib/data"

const TextBlock = ({ children, className = "" }) => (
  <p className={`text-gray-700 leading-relaxed ${className}`}>{children}</p>
)

export function Testimonials() {
  return (
    <section className="mt-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900">What Our Customers Say</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role}{testimonial.company && `, ${testimonial.company}`}</p>
              </div>
            </div>
            <TextBlock className="mb-4">
              "{testimonial.content}"
            </TextBlock>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
