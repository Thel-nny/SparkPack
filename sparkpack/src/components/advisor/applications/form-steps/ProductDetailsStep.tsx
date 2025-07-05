"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProductDetails } from '@/types/formData';

interface ProductDetailsStepProps {
  formData: ProductDetails;
  onUpdate: (data: Partial<ProductDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ProductDetailsStep: React.FC<ProductDetailsStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  // Local state to manage form inputs for this step (only productName now)
  const [localFormData, setLocalFormData] = useState<ProductDetails>(formData);

  // Effect to update localFormData when parent formData changes (e.g., on back navigation)
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const productOptions = [
    {
      name: 'Medical Care Insurance',
      description: 'Basic Plan',
      premiumRange: '₱800 - ₱1,500',
      coverageRange: '₱20,000 - ₱30,000',
      details: [
        'Lasts for 1 year (renewable annually)',
        'Premium payment starts from ₱800 - ₱1,500 per year (monthly options available)',
        'Coverage up to ₱20,000 - ₱30,000',
      ],
      icon: (
        <svg className="w-12 h-12 text-[#8cc63f] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Legacy Insurance',
      description: 'Protection & Peace of Mind',
      premiumRange: '₱600 - ₱1,000',
      coverageRange: '₱5,000 - ₱20,000',
      details: [
        'Lasts for 1 year (renewable annually)',
        'Premium payment starts from ₱600 - ₱1,000 per year (monthly options available)',
        'Coverage up to ₱5,000 - ₱20,000'
      ],
      icon: (
        <svg className="w-12 h-12 text-[#8cc63f] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      name: 'Medicare and Legacy Insurance',
      description: 'Comprehensive Plan',
      premiumRange: '₱1,500 - ₱3,000+',
      coverageRange: '₱7,500 - ₱100,000+',
      details: [
        'Lasts for 1 year (renewable annually)',
        'Premium payment starts from ₱1,500 - ₱3,000+ per year (monthly options available, with potential discounts for combined coverage)',
        'Coverage up to ₱7,500 - ₱100,000+'
      ],
      icon: (
        <svg className="w-12 h-12 text-[#8cc63f] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const handleProductSelect = (productName: string) => {
    setLocalFormData({
      ...localFormData,
      productName: productName,
      coverageType: '',
      coverageAmount: '',
      deductible: '',
      reimbursementRate: '',
      paymentFrequency: '',
      startDate: '',
      coverageLength: '',
    });
  };

  /**
   * Validates that a product has been selected.
   */
  const validateStep = (): boolean => {
    if (!localFormData.productName.trim()) {
      alert('Please select an insurance package to proceed.');
      return false;
    }
    return true;
  };

  /**
   * Handles navigation to the next major form step (Payment Details).
   */
  const handleNextStep = () => {
    if (!validateStep()) {
      return; // Stop if validation fails
    }
    // Update parent data with only the selected product name
    onUpdate({ productName: localFormData.productName });
    onNext(); // Move to the next main form step (Payment Details)
  };

  /**
   * Handles navigation to the previous major form step (Pet Details).
   */
  const handlePrevStep = () => {
    onUpdate(localFormData); // Save current product selection before going back
    onPrev();
  };

  const selectedProductData = productOptions.find(p => p.name === localFormData.productName);

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Product Details</h2>

        <p className="text-gray-700 mb-6">We offer three of the most common types of pet insurance. These products can be selected based on the one that best fits the reason you want pet insurance and is most useful for the specific needs of your pet.</p>
        
        {/* Product Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {productOptions.map((product) => (
            <div
              key={product.name}
              onClick={() => handleProductSelect(product.name)}
              className={`
                flex flex-col items-center text-center p-6 rounded-xl shadow-md cursor-pointer
                transition-all duration-300 border-2
                ${localFormData.productName === product.name
                  ? 'border-[#8cc63f] bg-[#e6f4d9] scale-105' // Selected state
                  : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300' // Unselected state
                }
              `}
            >
              {product.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <ul className="text-left w-full text-gray-700 space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Product Overview Section (conditionally displayed if a product is selected) */}
        {selectedProductData && (
          <div className="space-y-6 mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-gray-800">Overview: {selectedProductData.name}</h3>
            <p className="text-gray-700">Here's a detailed overview of the <span className="font-semibold">{selectedProductData.name}</span> plan:</p>

            {/* Render specific details based on selected product */}
            {localFormData.productName === 'Medical Care Insurance' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="text-lg font-bold text-[#8cc63f] mb-3">Medical Care Insurance (Basic Plan) - Overview</h4>
                <p className="mb-4">This plan is designed to help you manage the financial impact of unexpected veterinary expenses due to accidents and common illnesses, ensuring your pet gets the essential care they need.</p>

                <h5 className="font-semibold text-gray-800 mb-2">Key Benefits:</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Coverage Term:</span> 1 year, renewable annually to ensure continuous protection.</li>
                  <li><span className="font-medium">Annual Premium:</span> Starting from {selectedProductData?.premiumRange} per year (or inquire about our convenient monthly payment options).</li>
                  <li><span className="font-medium">Total Annual Coverage Limit:</span> Up to {selectedProductData?.coverageRange} for covered accidental injuries and illnesses.</li>
                </ul>

                <h5 className="font-semibold text-gray-800 mt-4 mb-2">What's Covered:</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li>Veterinary consultations and check-ups related to covered incidents.</li>
                  <li>Diagnostic tests (e.g., X-rays, blood tests, urinalysis) to determine the cause of illness or injury.</li>
                  <li>Medications prescribed by a licensed veterinarian.</li>
                  <li>Minor procedures and treatments for accidental injuries (e.g., cuts, sprains, minor burns) and common illnesses (e.g., ear infections, skin allergies, gastrointestinal issues).</li>
                  <li>Emergency care if medically necessary due to a covered accident or illness.</li>
                </ul>

                <p className="mt-4 text-gray-700 italic">Ideal for: Pet owners in Iloilo City seeking fundamental financial support for day-to-day medical emergencies and common health concerns for their pets.</p>

                <h5 className="font-semibold text-gray-800 mt-6 mb-2">Important Notes (Please Read Carefully):</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Waiting Periods:</span>
                    <ul className="list-circle list-inside ml-4">
                      <li><span className="font-medium">Accidents:</span> Coverage for accidental injuries typically begins <span className="font-bold">3 days</span> after your policy's effective date.</li>
                      <li><span className="font-medium">Illnesses:</span> Coverage for illnesses typically begins <span className="font-bold">14 days</span> after your policy's effective date.</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Exclusions:</span>
                    <ul className="list-circle list-inside ml-4">
                      <li>Pre-existing conditions: Any illness or injury your pet had before the policy started or during the waiting period.</li>
                      <li>Routine/Preventive Care: This plan does not cover vaccinations, deworming, flea/tick prevention, routine dental cleaning, grooming, or elective procedures (e.g., spaying/neutering).</li>
                      <li>Behavioral issues, breeding/pregnancy, or cosmetic procedures.</li>
                      <li>Conditions arising from negligence, intentional harm, or illegal activities.</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Claim Reimbursement:</span> Claims are typically processed on a reimbursement basis, meaning you pay the vet first, then submit your claim for reimbursement up to your coverage limit.</li>
                  <li><span className="font-medium">Eligibility:</span> Your pet must be <span className="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.</li>
                </ul>
              </div>
            )}

            {localFormData.productName === 'Legacy Insurance' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="text-lg font-bold text-[#8cc63f] mb-3">Legacy Insurance (Protection & Peace of Mind) - Overview</h4>
                <p className="mb-4">This plan offers crucial financial assistance and peace of mind during challenging and unforeseen circumstances, focusing on support for lost pets and end-of-life care.</p>

                <h5 className="font-semibold text-gray-800 mb-2">Key Benefits:</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Coverage Term:</span> 1 year, renewable annually.</li>
                  <li><span className="font-medium">Annual Premium:</span> Starting from {selectedProductData?.premiumRange} per year (or inquire about our convenient monthly payment options).</li>
                  <li><span className="font-medium">Total Annual Coverage Limit:</span> Up to {selectedProductData?.coverageRange} for covered incidents.</li>
                </ul>

                <h5 className="font-semibold text-gray-800 mt-4 mb-2">What's Covered:</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Accidental Death or Essential Euthanasia:</span> Up to ₱15,000 in the event of accidental death or a veterinarian-prescribed essential euthanasia due to covered accidental injuries or severe illnesses (as defined by the policy).</li>
                  <li><span className="font-medium">Burial/Cremation Assistance:</span> Up to ₱7,500 to help cover the costs of your pet's dignified farewell.</li>
                  <li><span className="font-medium">Lost Pet Advertising and Reward:</span> Up to ₱7,500 to assist with advertising costs and reward money to help find your lost pet.</li>
                </ul>

                <p className="mt-4 text-gray-700 italic">Ideal for: Pet owners in Iloilo City who prioritize financial protection for the most difficult moments, ensuring support for lost pets and dignified end-of-life arrangements.</p>

                <h5 className="font-semibold text-gray-800 mt-6 mb-2">Important Notes (Please Read Carefully):</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Waiting Periods:</span>
                    <ul className="list-circle list-inside ml-4">
                      <li><span className="font-medium">Accidental Death:</span> Coverage typically begins <span className="font-bold">3 days</span> after your policy's effective date.</li>
                      <li><span className="font-medium">Essential Euthanasia (due to illness):</span> A waiting period of <span className="font-bold">14 days</span> may apply for illness-related euthanasia.</li>
                      <li><span className="font-medium">Lost Pet:</span> Coverage typically begins <span className="font-bold">14 days</span> after your policy's effective date.</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Exclusions:</span>
                    <ul className="list-circle list-inside ml-4">
                      <li>Death due to pre-existing conditions (unless explicitly covered after a waiting period), routine procedures, negligence, or intentional harm.</li>
                      <li>Theft or mysterious disappearance without a formal report (e.g., barangay blotter for lost pet).</li>
                      <li>Costs not directly related to burial/cremation or lost pet advertising.</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Claim Process:</span> Detailed documentation (e.g., veterinary certificates, official receipts, police/barangay reports for lost pets) will be required for claims.</li>
                  <li><span className="font-medium">Eligibility:</span> Your pet must be <span className="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.</li>
                </ul>
              </div>
            )}

            {localFormData.productName === 'Medicare and Legacy Insurance' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="text-lg font-bold text-[#8cc63f] mb-3">Medicare and Legacy Insurance (Comprehensive Plan) - Overview</h4>
                <p className="mb-4">This comprehensive plan offers the broadest financial safety net, combining extensive medical coverage with crucial support for lost pets and end-of-life scenarios, giving you ultimate peace of mind.</p>

                <h5 className="font-semibold text-gray-800 mb-2">Key Benefits:</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Coverage Term:</span> 1 year, renewable annually.</li>
                  <li><span className="font-medium">Annual Premium:</span> Starting from {selectedProductData?.premiumRange} per year (or inquire about our convenient monthly payment options and potential discounts for combined coverage).</li>
                  <li><span className="font-medium">Total Annual Coverage Limit:</span> Up to {selectedProductData?.coverageRange} for all covered benefits combined.</li>
                </ul>

                <h5 className="font-semibold text-gray-800 mt-4 mb-2">What's Covered (Comprehensive):</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Extensive Accidental Injury & Illness Coverage:</span> Up to ₱70,000+ for vet consultations, diagnostics (X-rays, MRI, blood work), prescribed medications, surgeries, hospitalization, and emergency care. Covers both minor and major medical events.</li>
                  <li><span className="font-medium">Accidental Death or Essential Euthanasia:</span> Up to ₱20,000 for accidental death or veterinarian-prescribed essential euthanasia due to covered accidental injuries or severe illnesses.</li>
                  <li><span className="font-medium">Burial/Cremation Assistance:</span> Up to ₱10,000 to help cover end-of-life arrangements.</li>
                  <li><span className="font-medium">Lost Pet Advertising and Reward:</span> Up to ₱10,000 for advertising costs and reward to help locate your missing pet.</li>
                </ul>

                <p className="mt-4 text-gray-700 italic">Ideal for: Pet owners in Iloilo City who want the most complete protection, covering high-cost medical treatments, and providing comprehensive support for difficult lost pet or end-of-life situations.</p>

                <h5 className="font-semibold text-gray-800 mt-6 mb-2">Important Notes (Please Read Carefully):</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                  <li><span className="font-medium">Waiting Periods:</span>
                    <ul className="list-circle list-inside ml-4">
                      <li><span className="font-medium">Accidents:</span> Coverage for accidental injuries typically begins <span className="font-bold">3 days</span> after your policy's effective date.</li>
                      <li><span className="font-medium">Illnesses:</span> Coverage for illnesses typically begins <span className="font-bold">14 days</span> after your policy's effective date.</li>
                      <li><span className="font-medium">Cruciate Ligament Conditions:</span> A longer waiting period of <span className="font-bold">6 months</span> may apply for specific orthopedic conditions like cruciate ligament injuries, or may require a vet waiver.</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Exclusions:</span>
                    <ul className="list-circle list-inside ml-4">
                      <li>Pre-existing conditions: Any illness or injury your pet had before the policy started or during the waiting period.</li>
                      <li>Routine/Preventive Care: Vaccinations, deworming, flea/tick prevention, routine dental cleaning, grooming, or elective procedures (e.g., spaying/neutering) are generally not covered unless specific wellness add-ons are available and chosen.</li>
                      <li>Behavioral issues, breeding/pregnancy, or cosmetic procedures.</li>
                      <li>Conditions arising from negligence, intentional harm, or illegal activities.</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Deductibles/Co-payments:</span> A small deductible (e.g., a fixed amount per claim) or a co-payment percentage (e.g., you pay 20% of the vet bill, we cover 80%) may apply to claims. This will be specified in your full policy document.</li>
                  <li><span className="font-medium">Sub-limits:</span> While there's a generous overall coverage limit, some specific treatments or conditions may have their own sub-limits (e.g., maximum amount for a single surgery).</li>
                  <li><span className="font-medium">Claim Reimbursement:</span> Claims are typically processed on a reimbursement basis, meaning you pay the vet first, then submit your claim for reimbursement up to your coverage limit.</li>
                  <li><span className="font-medium">Eligibility:</span> Your pet must be <span className="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePrevStep}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Previous: Pet Details
        </Button>

        <Button
          onClick={handleNextStep}
          className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
        >
          Next: Payment Details
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsStep;