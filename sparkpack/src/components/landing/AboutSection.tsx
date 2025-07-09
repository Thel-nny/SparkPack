import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { MapPin, Heart, Shield } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="our-story" className="py-20 bg-[#f5f7f8]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-[#8cc63f] text-white mb-4">About Sparkpack</Badge>
          <h2 className="text-4xl font-bold text-[#342d47] mb-4">Our Story</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Born in Iloilo, built for pet lovers who understand that our furry family members deserve the best care
            throughout their entire journey with us.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-[#342d47] mb-6">Founded with Love in Iloilo</h3>
            <p className="text-gray-600 mb-4">
              Sparkpack was founded in 2020 by a group of pet lovers in Iloilo who experienced the heartbreak of
              losing beloved pets and the financial stress that comes with unexpected veterinary bills. We realized
              that pet insurance in the Philippines was either too expensive, too complicated, or didn&apos;t truly
              understand the local needs.
            </p>
            <p className="text-gray-600 mb-6">
              What makes us unique is our combination of comprehensive medical insurance with meaningful memorial
              services. We believe that caring for your pet shouldn&apos;t end when they pass away – it should continue
              with dignity and love.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-[#8cc63f]">5,000+</div>
                <div className="text-sm text-gray-600">Pets Insured</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-[#8cc63f]">98%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/iloilo.jpeg"
              alt="Sparkpack founders with pets"
              width={600}
              height={500}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Why Sparkpack */}
        <div id="why-sparkpack" className="mb-16">
          <h3 className="text-2xl font-bold text-[#342d47] mb-8 text-center">Why Choose Sparkpack?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="h-16 w-16 bg-[#8cc63f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-[#8cc63f]" />
              </div>
              <h4 className="font-bold text-[#342d47] mb-2">Local Expertise</h4>
              <p className="text-gray-600">
                Deep understanding of Iloilo&apos;s pet care landscape and local veterinary network
              </p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="h-16 w-16 bg-[#8cc63f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-[#8cc63f]" />
              </div>
              <h4 className="font-bold text-[#342d47] mb-2">Compassionate Care</h4>
              <p className="text-gray-600">
                We treat every pet like family and provide support through every stage of their life
              </p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="h-16 w-16 bg-[#8cc63f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#8cc63f]" />
              </div>
              <h4 className="font-bold text-[#342d47] mb-2">Complete Protection</h4>
              <p className="text-gray-600">
                Unique combination of medical insurance and memorial services in one plan
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
