import { Button } from "@/components/ui/button"

export default function FinalCTA() {
  return (
    <section className="py-20 bg-[#8cc63f] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Protect Your Pet?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of pet families in Iloilo who trust Sparkpack for comprehensive pet insurance and memorial
          services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-[#8cc63f] hover:bg-gray-100 px-8 py-4 text-lg">
            Get Your Quote Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#8cc63f] px-8 py-4 text-lg bg-transparent"
          >
            Schedule Consultation
          </Button>
        </div>
        <p className="text-sm mt-6 opacity-75">
          No commitment required • Get quote in 2 minutes • Local Iloilo support
        </p>
      </div>
    </section>
  )
}
