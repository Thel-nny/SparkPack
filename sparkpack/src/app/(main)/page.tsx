import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Heart,
  Shield,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  TreePine,
  Stethoscope,
  Home,
  Award,
  Clock,
  DollarSign,
  FileText,
  Camera,
  Calendar,
  Building,
  UserCheck,
  Handshake,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
                  Your Pet&apos;s Lifetime Companion in <span className="text-[#8cc63f]">Iloilo</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Complete peace of mind from playful puppy days to a dignified farewell. Sparkpack combines
                  comprehensive medical insurance with unique memorial services in one simple plan.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#8cc63f] hover:bg-[#7eb238] text-white px-8 py-4 text-lg">
                  Get Quote Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-[#8cc63f] text-[#8cc63f] hover:bg-[#8cc63f] hover:text-white bg-transparent"
                >
                  Learn More
                </Button>
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

      {/* Insurance Section */}
      <section id="insurance-packages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-[#8cc63f] text-white mb-4">Insurance Plans</Badge>
            <h2 className="text-4xl font-bold text-[#342d47] mb-4">Comprehensive Pet Insurance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From routine checkups to emergency care, we've got your pet covered with our locally-tailored insurance
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

          {/* Claims Process */}
          <div id="claims-process" className="bg-[#f5f7f8] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#342d47] mb-8 text-center">Simple Claims Process</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-[#342d47] mb-2">1. Submit Claim</h4>
                <p className="text-gray-600">File your claim online or through our mobile app</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 bg-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-[#342d47] mb-2">2. Quick Review</h4>
                <p className="text-gray-600">Our team reviews your claim within 24 hours</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 bg-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-[#342d47] mb-2">3. Approval</h4>
                <p className="text-gray-600">Get approval notification via SMS and email</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 bg-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-[#342d47] mb-2">4. Payment</h4>
                <p className="text-gray-600">Receive reimbursement within 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memorial Services Section */}
      <section id="cremation-services" className="py-20 bg-[#f5f7f8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-[#8cc63f] text-white mb-4">Memorial Services</Badge>
            <h2 className="text-4xl font-bold text-[#342d47] mb-4">Honoring Your Pet's Memory</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When the time comes to say goodbye, we provide compassionate memorial services that celebrate your pet's
              life and create lasting memories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-[#8cc63f]" />
                </div>
                <CardTitle className="text-[#342d47]">Cremation Services</CardTitle>
                <CardDescription>Dignified individual cremation with personalized urns and keepsakes</CardDescription>
              </CardHeader>
            </Card>

            <Card id="tree-planting" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                  <TreePine className="h-6 w-6 text-[#8cc63f]" />
                </div>
                <CardTitle className="text-[#342d47]">Tree Planting Ceremony</CardTitle>
                <CardDescription>
                  Plant a tree in your pet's memory at our dedicated memorial forest in Iloilo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card id="memorial-options" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-[#8cc63f]" />
                </div>
                <CardTitle className="text-[#342d47]">Memorial Options</CardTitle>
                <CardDescription>Custom memorial stones, photo albums, and digital memory books</CardDescription>
              </CardHeader>
            </Card>

            <Card id="tree-care" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#8cc63f]" />
                </div>
                <CardTitle className="text-[#342d47]">Tree Care & Maintenance</CardTitle>
                <CardDescription>
                  Professional care for your memorial tree with regular updates and photos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card id="memorial-gallery" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-[#8cc63f]" />
                </div>
                <CardTitle className="text-[#342d47]">Memorial Gallery</CardTitle>
                <CardDescription>Online gallery to share memories and photos with family and friends</CardDescription>
              </CardHeader>
            </Card>

            <Card id="grief-support" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-[#8cc63f]" />
                </div>
                <CardTitle className="text-[#342d47]">Grief Support</CardTitle>
                <CardDescription>Professional counseling and support groups for pet loss in Iloilo</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Local Partners Section */}
      <section id="partner-vets" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-[#8cc63f] text-white mb-4">Local Partners</Badge>
            <h2 className="text-4xl font-bold text-[#342d47] mb-4">Trusted Network in Iloilo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've partnered with the best veterinarians and pet-friendly businesses across Iloilo to provide you with
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

          {/* Community Impact & Events */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card id="community-impact" className="p-8 bg-[#f5f7f8]">
              <h3 className="text-2xl font-bold text-[#342d47] mb-4">Community Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                  <span>500+ trees planted in memorial forest</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                  <span>₱2M+ donated to local animal shelters</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                  <span>1,000+ pets helped through our network</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                  <span>50+ local businesses partnered</span>
                </div>
              </div>
            </Card>

            <Card id="local-events" className="p-8">
              <h3 className="text-2xl font-bold text-[#342d47] mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#8cc63f] mt-1" />
                  <div>
                    <h4 className="font-semibold">Pet Health Fair</h4>
                    <p className="text-gray-600 text-sm">March 15, 2024 • Iloilo Sports Complex</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#8cc63f] mt-1" />
                  <div>
                    <h4 className="font-semibold">Memorial Tree Planting</h4>
                    <p className="text-gray-600 text-sm">March 22, 2024 • Sparkpack Memorial Forest</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#8cc63f] mt-1" />
                  <div>
                    <h4 className="font-semibold">Pet Adoption Drive</h4>
                    <p className="text-gray-600 text-sm">April 5, 2024 • SM City Iloilo</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
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
                that pet insurance in the Philippines was either too expensive, too complicated, or didn't truly
                understand the local needs.
              </p>
              <p className="text-gray-600 mb-6">
                What makes us unique is our combination of comprehensive medical insurance with meaningful memorial
                services. We believe that caring for your pet shouldn't end when they pass away – it should continue
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
                  Deep understanding of Iloilo's pet care landscape and local veterinary network
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

          {/* Team */}
          <div id="team">
            <h3 className="text-2xl font-bold text-[#342d47] mb-8 text-center">Meet Our Team</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Row 1 */}
              <Card className="text-center p-6 border-0 shadow-lg">
                <Image
                  src="/COO.png" // Replace with your default avatar icon path
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
                  src="/CEO.png" // Replace with your default avatar icon path
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
                  src="/CFO.png" // Replace with your default avatar icon path
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

            <div className="grid md:grid-cols-3 gap-8 mt-8"> {/* Added mt-8 for spacing between rows */}
              {/* Row 2 */}
              <Card className="text-center p-6 border-0 shadow-lg">
                <Image
                  src="/CMO.png" // Replace with your default avatar icon path
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
                  src="/COA.png" // Replace with your default avatar icon path
                  alt="Jan Kristoff Azuscena"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h4 className="font-bold text-[#342d47] mb-1">Jan Kristoff Azuscena</h4>
                <p className="text-[#8cc63f] mb-2">COA</p>
                <p className="text-gray-600 text-sm">Dedicated to seamless administrative operations and customer satisfaction.</p>
              </Card>
              {/* Empty cards to maintain 3-column grid alignment if desired, or remove if you want 2 columns in the second row */}
              <div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-[#8cc63f] text-white mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-[#342d47] mb-4">What Pet Parents Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real pet families in Iloilo who trust Sparkpack with their beloved companions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "When our Golden Retriever Max needed emergency surgery, Sparkpack covered everything. The claims
                process was so easy, and the memorial tree planting ceremony gave us comfort during our grief."
              </p>
              <div className="flex items-center gap-3">
                <UserRound className="h-24 w-24 text-gray-500" />
                <div>
                  <p className="font-semibold text-[#342d47]">Sarah Gonzales</p>
                  <p className="text-sm text-gray-500">Jaro, Iloilo City</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The local network of vets is amazing. We can get appointments easily, and the quality of care is
                excellent. Plus, knowing that memorial services are included gives us peace of mind."
              </p>
              <div className="flex items-center gap-3">
                <UserRound className="h-24 w-24 text-gray-500" />
                <div>
                  <p className="font-semibold text-[#342d47]">Roberto Martinez</p>
                  <p className="text-sm text-gray-500">Mandurriao, Iloilo City</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Sparkpack truly understands pet parents in Iloilo. The pricing is fair, the service is exceptional, and
                they really care about our pets' wellbeing throughout their entire lives."
              </p>
              <div className="flex items-center gap-3">
                <UserRound className="h-24 w-24 text-gray-500" />
                <div>
                  <p className="font-semibold text-[#342d47]">Lisa Chen</p>
                  <p className="text-sm text-gray-500">La Paz, Iloilo City</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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

      {/* Footer */}
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
                Your pet's lifetime companion in Iloilo. Comprehensive insurance and memorial services in one plan.
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
    </div>
  )
}
