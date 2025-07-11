import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, TreePine, Camera, Users, Award, Handshake } from "lucide-react"

export default function MemorialServicesSection() {
  return (
    <section id="cremation-services" className="py-20 bg-[#f5f7f8]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-[#8cc63f] text-white mb-4">Memorial Services</Badge>
          <h2 className="text-4xl font-bold text-[#342d47] mb-4">Honoring Your Pet&apos;s Memory</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            When the time comes to say goodbye, we provide compassionate memorial services that celebrate your pet&apos;s
            life and create lasting memories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Cremation Services</CardTitle>
              <CardDescription>Dignified individual cremation with personalized urns and keepsakes</CardDescription>
            </CardHeader>
          </Card>

          <Card id="tree-planting" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <TreePine className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Tree Planting Ceremony</CardTitle>
              <CardDescription>
                Plant a tree in your pet&apos;s memory at our dedicated memorial forest in Iloilo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card id="memorial-options" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Memorial Options</CardTitle>
              <CardDescription>Custom memorial stones, photo albums, and digital memory books</CardDescription>
            </CardHeader>
          </Card>

          <Card id="tree-care" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Tree Care & Maintenance</CardTitle>
              <CardDescription>
                Professional care for your memorial tree with regular updates and photos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card id="memorial-gallery" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Memorial Gallery</CardTitle>
              <CardDescription>Online gallery to share memories and photos with family and friends</CardDescription>
            </CardHeader>
          </Card>

          <Card id="grief-support" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Handshake className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Grief Support</CardTitle>
              <CardDescription>Professional counseling and support groups for pet loss in Iloilo</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
