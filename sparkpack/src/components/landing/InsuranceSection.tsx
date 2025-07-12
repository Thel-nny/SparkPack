import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Heart, Stethoscope } from "lucide-react" // Assuming these icons are used for visual representation

export default function InsuranceSection() {
  const productOptions = [
    {
      name: 'Medical Care Insurance',
      description: 'Essential Illness & Accident Coverage',
      premiumRange: '₱6,000 - ₱9,600', // Still assuming these ranges for basic
      coverageRange: '₱15,000 - ₱35,000',
      details: [
        '1-year renewable policy',
        'Premiums from ₱6,000/year (monthly options available)',
        'Up to ₱35,000 for accidents & illnesses',
        'Veterinary consultations & diagnostics',
      ],
      icon: <Stethoscope className="h-6 w-6 text-[#8cc63f]" />,
    },
    {
      name: 'Medicare & Legacy Insurance', // This is the comprehensive one
      description: 'Ultimate Protection & Peace of Mind', // Revised description to reflect comprehensiveness
      premiumRange: '₱14,400 - ₱21,600', // Reflecting the new annual premium range
      coverageRange: '₱60,000 - ₱100,000', // Reflecting the new annual coverage limits
      details: [
        '1-year renewable policy',
        'Premiums from ₱14,400/year (monthly options available)', // Updated to annual base from "Complete Care" tier
        'Up to ₱100,000 for advanced medical & legacy needs', // Highlights the higher coverage
        'MRI/CT scans & Major Surgeries Covered', // Key high-value benefits
        'Extensive illness care, accidental death & burial support', // Summarized other core benefits
      ],
      icon: <Shield className="h-6 w-6 text-[#8cc63f]" />,
    },
    {
      name: 'Legacy Insurance', // This is the end-of-life/lost pet one
      description: 'End-of-Life & Loss Protection', // More descriptive
      premiumRange: '₱3,120 - ₱4,800',
      coverageRange: '₱9,000 - ₱18,000',
      details: [
        '1-year renewable policy',
        'Premiums from ₱3,120/year (monthly options available)',
        'Up to ₱20,000 for covered incidents',
        'Accidental death or essential euthanasia coverage',
        'Burial/Cremation assistance',
      ],
      icon: <Heart className="h-6 w-6 text-[#8cc63f]" />,
    },
  ];

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
          {/* Medical Care Insurance Card (formerly Essential Care) */}
          <Card className="border-2 hover:border-[#8cc63f] transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                {productOptions[0].icon} {/* Stethoscope icon */}
              </div>
              <CardTitle className="text-[#342d47]">{productOptions[0].name}</CardTitle>
              <CardDescription>{productOptions[0].description}</CardDescription>
              <div className="text-3xl font-bold text-[#8cc63f]">
                Starting from {productOptions[0].premiumRange.split(' - ')[0]}<span className="text-sm text-gray-500">/year</span>
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
                  <span>Emergency care up to ₱35,000</span> {/* Updated coverage limit to be more precise for this tier */}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                  <span>24/7 vet hotline access</span> {/* Made it clearer */}
                </li>
              </ul>
              <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
            </CardContent>
          </Card>

          {/* Medicare and Legacy Insurance Card (formerly Complete Care - Most Popular) */}
          <Card className="border-2 border-[#8cc63f] shadow-lg scale-105">
            <CardHeader>
              <Badge className="w-fit bg-[#8cc63f] text-white mb-2">Most Popular</Badge>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                {productOptions[1].icon} {/* Shield icon */}
              </div>
              <CardTitle className="text-[#342d47]">{productOptions[1].name}</CardTitle>
              <CardDescription>{productOptions[1].description}</CardDescription>
              <div className="text-3xl font-bold text-[#8cc63f]">
                Starting from {productOptions[1].premiumRange.split(' - ')[0]}<span className="text-sm text-gray-500">/year</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {productOptions[1].details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
            </CardContent>
          </Card>

          {/* Legacy Insurance Card (formerly Legacy Care) */}
          <Card className="border-2 hover:border-[#8cc63f] transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                {productOptions[2].icon} {/* Heart icon */}
              </div>
              <CardTitle className="text-[#342d47]">{productOptions[2].name}</CardTitle>
              <CardDescription>{productOptions[2].description}</CardDescription>
              <div className="text-3xl font-bold text-[#8cc63f]">
                Starting from {productOptions[2].premiumRange.split(' - ')[0]}<span className="text-sm text-gray-500">/year</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {productOptions[2].details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}