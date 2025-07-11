import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, UserRound } from "lucide-react"

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-[#8cc63f] text-white mb-4">Testimonials</Badge>
          <h2 className="text-4xl font-bold text-[#342d47] mb-4">What Pet Parents Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real pet families in Iloilo who trust Sparkpack with their beloved companions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              &quot;When our Golden Retriever Max needed emergency surgery, Sparkpack covered everything. The claims
              process was so easy, and the memorial tree planting ceremony gave us comfort during our grief.&quot;
            </p>
            <div className="flex items-center gap-3">
              <UserRound className="h-24 w-24 text-gray-500" />
              <div>
                <p className="font-semibold text-[#342d47]">Sarah Gonzales</p>
                <p className="text-sm text-gray-500">Jaro, Iloilo City</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              &quot;The local network of vets is amazing. We can get appointments easily, and the quality of care is
              excellent. Plus, knowing that memorial services are included gives us peace of mind.&quot;
            </p>
            <div className="flex items-center gap-3">
              <UserRound className="h-24 w-24 text-gray-500" />
              <div>
                <p className="font-semibold text-[#342d47]">Roberto Martinez</p>
                <p className="text-sm text-gray-500">Mandurriao, Iloilo City</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              &quote;Sparkpack truly understands pet parents in Iloilo. The pricing is fair, the service is exceptional, and
              they really care about our pets&apos; wellbeing throughout their entire lives."
            </p>
            <div className="flex items-center gap-3">
              <UserRound className="h-24 w-24 text-gray-500" />
              <div>
                <p className="font-semibold text-[#342d47]">Lisa Chen</p>
                <p className="text-sm text-gray-500">La Paz, Iloilo City</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
