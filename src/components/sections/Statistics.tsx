import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { statistics } from "@/lib/data"

export function Statistics() {
  return (
    <section className="mt-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900">
        Discover why 1M+ brands trust Automateinstareply
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statistics.map((stat, index) => (
          <Card key={index} className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-gray-900">{stat.value}</CardTitle>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
