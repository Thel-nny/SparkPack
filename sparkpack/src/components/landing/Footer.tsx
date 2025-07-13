import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-12 bg-[#342d47] text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/Furrest_Logo-02.png"
              alt="Furrest Logo"
              width={125}
              height={40}
              className="mb-4 brightness-0 invert"
            />
            <p className="text-gray-300 mb-4">
              Your pet&apos;s lifetime companion in Iloilo. Comprehensive insurance and memorial services in one plan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Insurance</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#insurance-packages" className="hover:text-[#8cc63f]">
                  Medical Care Plans
                </Link>
              </li>
              <li>
                <Link href="#legacy-packages" className="hover:text-[#8cc63f]">
                  Legacy Insurance
                </Link>
              </li>
              <li>
                <Link href="#claims-process" className="hover:text-[#8cc63f]">
                  Claims Process
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#8cc63f]">
                  Coverage Details
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#cremation-services" className="hover:text-[#8cc63f]">
                  Memorial Services
                </Link>
              </li>
              <li>
                <Link href="#partner-vets" className="hover:text-[#8cc63f]">
                  Partner Network
                </Link>
              </li>
              <li>
                <Link href="#grief-support" className="hover:text-[#8cc63f]">
                  Grief Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#8cc63f]">
                  Emergency Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+63 912 727 7767</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>sparkpackteam@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Jaro, Iloilo City, Iloilo City, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Sparkpack. All rights reserved. Made with ❤️ in Iloilo.</p>
        </div>
      </div>
    </footer>
  )
}
