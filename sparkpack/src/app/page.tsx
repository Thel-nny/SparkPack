import { Button } from "@/components/ui/button";
import { CheckCircle} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative bg-[#f5f7f8] py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Pet's Lifetime Companion in <span className="text-[#99c896]">Iloilo</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Complete peace of mind from playful puppy days to a dignified farewell. Sparkpack combines
                  comprehensive medical insurance with unique memorial services in one simple plan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#abc896] hover:[#99c896] text-white px-8 py-4 text-lg">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#abc896]" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#abc896]" />
                  <span>Local Iloilo network</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#abc896]" />
                  <span>Lifetime coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}