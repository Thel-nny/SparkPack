import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Heart, Stethoscope } from "lucide-react"

export default function InsuranceSection() {
  return (
    <section id="insurance-packages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-[#8cc63f] text-white mb-4">Insurance Plans</Badge>
          <h2 className="text-4xl font-bold text-[#342d47] mb-4">Comprehensive Pet Insurance</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine checkups to emergency care, we&apos;ve got your pet covered with our locally-tailored insurance
            plans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Medical Care Insurance */}
          <Card className="border-2 hover:border-[#8cc63f] transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Essential Care</CardTitle>
              <CardDescription>Perfect for young pets and basic coverage</CardDescription>
              <div className="text-3xl font-bold text-[#8cc63f]">
                ₱899<span className="text-sm text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Annual checkups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Vaccinations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Emergency care up to ₱50,000</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>24/7 vet hotline</span>
                </li>
              </ul>
              <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#8cc63f] shadow-lg scale-105">
            <CardHeader>
              <Badge className="w-fit bg-[#8cc63f] text-white mb-2">Most Popular</Badge>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Complete Care</CardTitle>
              <CardDescription>Comprehensive coverage for all life stages</CardDescription>
              <div className="text-3xl font-bold text-[#8cc63f]">
                ₱1,499<span className="text-sm text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Everything in Essential</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Dental care</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Emergency care up to ₱150,000</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Specialist consultations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Memorial services included</span>
                </li>
              </ul>
              <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#8cc63f] transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-[#8cc63f]" />
              </div>
              <CardTitle className="text-[#342d47]">Legacy Care</CardTitle>
              <CardDescription>Premium coverage with lifetime benefits</CardDescription>
              <div className="text-3xl font-bold text-[#8cc63f]">
                ₱2,299<span className="text-sm text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Everything in Complete</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Unlimited emergency care</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Premium memorial services</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Grief counseling support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>Tree planting ceremony</span>
                </li>
              </ul>
              <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}