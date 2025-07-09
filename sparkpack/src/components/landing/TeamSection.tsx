import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function TeamSection() {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-[#342d47] mb-8 text-center">Meet Our Team</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Row 1 */}
          <Card className="text-center p-6 border-0 shadow-lg">
            <Image
              src="/COO.png"
              alt="Kacy Hera Villanueva"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h4 className="font-bold text-[#342d47] mb-1">Kacy Hera Villanueva</h4>
            <p className="text-[#8cc63f] mb-2">COO</p>
            <p className="text-gray-600 text-sm">Passionate about optimizing operations and enhancing pet care services.</p>
          </Card>
          <Card className="text-center p-6 border-0 shadow-lg">
            <Image
              src="/CEO.png"
              alt="Thelanny Maguillano"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h4 className="font-bold text-[#342d47] mb-1">Thelanny Maguillano</h4>
            <p className="text-[#8cc63f] mb-2">CEO</p>
            <p className="text-gray-600 text-sm">Visionary leader committed to revolutionizing pet wellness in Iloilo.</p>
          </Card>
          <Card className="text-center p-6 border-0 shadow-lg">
            <Image
              src="/CFO.png"
              alt="Franchescka Jewel Puljanan"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h4 className="font-bold text-[#342d47] mb-1">Franchescka Jewel Puljanan</h4>
            <p className="text-[#8cc63f] mb-2">CFO</p>
            <p className="text-gray-600 text-sm">Ensuring financial stability and growth to support our community initiatives.</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {/* Row 2 */}
          <Card className="text-center p-6 border-0 shadow-lg">
            <Image
              src="/CMO.png"
              alt="Nhel Ryan Leyte"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h4 className="font-bold text-[#342d47] mb-1">Nhel Ryan Leyte</h4>
            <p className="text-[#8cc63f] mb-2">CMO</p>
            <p className="text-gray-600 text-sm">Driving our mission to reach every pet parent in Iloilo.</p>
          </Card>
          <Card className="text-center p-6 border-0 shadow-lg">
            <Image
              src="/COA.png"
              alt="Jan Kristoff Azuscena"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h4 className="font-bold text-[#342d47] mb-1">Jan Kristoff Azuscena</h4>
            <p className="text-[#8cc63f] mb-2">COA</p>
            <p className="text-gray-600 text-sm">Dedicated to seamless administrative operations and customer satisfaction.</p>
          </Card>
          <div></div>
        </div>
      </div>
    </section>
  )
}
