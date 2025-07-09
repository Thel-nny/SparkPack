import { Card } from "@/components/ui/card"
import { CheckCircle, Calendar } from "lucide-react"

export default function CommunityImpactEvents() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card id="community-impact" className="p-8 bg-[#f5f7f8]">
        <h3 className="text-2xl font-bold text-[#342d47] mb-4">Community Impact</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
            <span>500+ trees planted in memorial forest</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
            <span>₱2M+ donated to local animal shelters</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
            <span>1,000+ pets helped through our network</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
            <span>50+ local businesses partnered</span>
          </div>
        </div>
      </Card>

      <Card id="local-events" className="p-8">
        <h3 className="text-2xl font-bold text-[#342d47] mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#8cc63f] mt-1" />
            <div>
              <h4 className="font-semibold">Pet Health Fair</h4>
              <p className="text-gray-600 text-sm">March 15, 2024 • Iloilo Sports Complex</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#8cc63f] mt-1" />
            <div>
              <h4 className="font-semibold">Memorial Tree Planting</h4>
              <p className="text-gray-600 text-sm">March 22, 2024 • Sparkpack Memorial Forest</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#8cc63f] mt-1" />
            <div>
              <h4 className="font-semibold">Pet Adoption Drive</h4>
              <p className="text-gray-600 text-sm">April 5, 2024 • SM City Iloilo</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
