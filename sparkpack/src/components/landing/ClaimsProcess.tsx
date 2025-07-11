import { Card } from "@/components/ui/card"
import { DollarSign, FileText, Clock, UserCheck } from "lucide-react"

export default function ClaimsProcess() {
  return (
    <div id="claims-process" className="bg-[#f5f7f8] rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-[#342d47] mb-8 text-center">Simple Claims Process</h3>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="h-16 w-16 bg-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold text-[#342d47] mb-2">1. Submit Claim</h4>
          <p className="text-gray-600">File your claim online</p>
        </div>
        <div className="text-center">
          <div className="h-16 w-16 bg-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold text-[#342d47] mb-2">2. Quick Review</h4>
          <p className="text-gray-600">Our team reviews your claim within 48 hours</p>
        </div>
        <div className="text-center">
          <div className="h-16 w-16 bg-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold text-[#342d47] mb-2">3. Approval</h4>
          <p className="text-gray-600">Get approval notification via SMS or email</p>
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
  )
}
