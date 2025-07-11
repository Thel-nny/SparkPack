"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Heart, Stethoscope } from "lucide-react"
import { fetchApplications } from "@/lib/api/applications"

interface Application {
  id: string
  planType: string
  reimbursement: number
  deductible: number
  coverageAmount: number
  startDate: string
  coverageLength?: number
  donationPercentage?: number
  paymentFrequency?: string
  selectedAddOns?: { name: string; price: number; type: string }[]
}

export default function InsuranceSection() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true)
        const data = await fetchApplications()
        if (data.success) {
          setApplications(data.data.applications)
        } else {
          setError("Failed to load insurance plans")
        }
      } catch (err) {
        setError("Failed to load insurance plans")
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
  }, [])

  if (loading) {
    return (
      <section id="insurance-packages" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p>Loading insurance plans...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="insurance-packages" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      </section>
    )
  }

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
          {applications.map((app) => (
            <Card key={app.id} className="border-2 hover:border-[#8cc63f] transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-[#8cc63f]/10 rounded-lg flex items-center justify-center mb-4">
                  {/* Icon based on planType */}
                  {app.planType === "Essential Care" && <Stethoscope className="h-6 w-6 text-[#8cc63f]" />}
                  {app.planType === "Complete Care" && <Shield className="h-6 w-6 text-[#8cc63f]" />}
                  {app.planType === "Legacy Care" && <Heart className="h-6 w-6 text-[#8cc63f]" />}
                </div>
                <CardTitle className="text-[#342d47]">{app.planType}</CardTitle>
                <CardDescription>Plan details</CardDescription>
                <div className="text-3xl font-bold text-[#8cc63f]">
                  ₱{app.coverageAmount.toLocaleString()}<span className="text-sm text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                    <span>Reimbursement: {app.reimbursement}%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                    <span>Deductible: ₱{app.deductible.toLocaleString()}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                    <span>Coverage Length: {app.coverageLength ?? "N/A"} months</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#8cc63f]" />
                    <span>Payment Frequency: {app.paymentFrequency ?? "N/A"}</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-[#8cc63f] hover:bg-[#7eb238]">Choose Plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
