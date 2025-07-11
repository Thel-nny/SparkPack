import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Building, Home, Users } from "lucide-react"

export default function LocalPartnersSection() {
  return (
    <section id="partner-vets" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-[#8cc63f] text-white mb-4">Local Partners</Badge>
          <h2 className="text-4xl font-bold text-[#342d47] mb-4">Trusted Network in Iloilo</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;ve partnered with the best veterinarians and pet-friendly businesses across Iloilo to provide you with
            exceptional care and services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-[#342d47] mb-6">Partner Veterinarians</h3>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-[#8cc63f]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-[#8cc63f]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#342d47]">Iloilo Animal Hospital</h4>
                    <p className="text-gray-600">24/7 Emergency Care • Specialist Services</p>
                    <p className="text-sm text-gray-500">Jaro, Iloilo City</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-l-4 border-[#8cc63f]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-[#8cc63f]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#342d47]">PetCare Veterinary Clinic</h4>
                    <p className="text-gray-600">Preventive Care • Surgery • Dental</p>
                    <p className="text-sm text-gray-500">Mandurriao, Iloilo City</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-l-4 border-[#8cc63f]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-[#8cc63f]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#342d47]">Compassionate Animal Clinic</h4>
                    <p className="text-gray-600">Wellness Exams • Vaccinations • Grooming</p>
                    <p className="text-sm text-gray-500">La Paz, Iloilo City</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div id="partner-businesses">
            <h3 className="text-2xl font-bold text-[#342d47] mb-6">Pet-Friendly Businesses</h3>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-[#8cc63f]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-[#8cc63f]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#342d47]">Pawsome Pet Supplies</h4>
                    <p className="text-gray-600">Premium pet food and accessories</p>
                    <p className="text-sm text-gray-500">SM City Iloilo</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-l-4 border-[#8cc63f]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center">
                    <Home className="h-6 w-6 text-[#8cc63f]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#342d47]">Pet Paradise Boarding</h4>
                    <p className="text-gray-600">Safe and comfortable pet boarding</p>
                    <p className="text-sm text-gray-500">Pavia, Iloilo</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-l-4 border-[#8cc63f]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#8cc63f]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#342d47]">Furry Friends Training</h4>
                    <p className="text-gray-600">Professional pet training services</p>
                    <p className="text-sm text-gray-500">Molo, Iloilo City</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
