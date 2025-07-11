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
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-[#8cc63f]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#8cc63f]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </Link>
            </div>
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
                <span>(033) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@sparkpack.ph</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Iloilo City, Philippines</span>
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
