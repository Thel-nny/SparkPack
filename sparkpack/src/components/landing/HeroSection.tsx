import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative bg-[#f5f7f8] py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Pet&apos;s Lifetime Companion in <span className="text-[#8cc63f]">Iloilo</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Complete peace of mind from playful puppy days to a dignified farewell. Sparkpack combines
                comprehensive medical insurance with unique memorial services in one simple plan.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                <span>Local Iloilo network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                <span>Lifetime coverage</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/landing_page.jpeg"
              alt="Happy pet with owner in Iloilo"
              width={650}
              height={600}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
