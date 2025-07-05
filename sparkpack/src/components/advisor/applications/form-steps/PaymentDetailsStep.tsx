"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { PaymentDetails, ProductDetails, AddOnDefinition, SelectedAddOn, ProductOption } from '@/types/formData'; // Import ProductDetails as we need it to calculate premium

import PremiumSummary from './payment-details-subcomponents/PremiumSummary';

import { calculatePremium } from './ProductDetailsStep';

const productOptions: ProductOption[] = [
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
    iconKey: 'medicalCareIcon',
    coverageOptions: ['₱20,000', '₱25,000', '₱30,000'],
    deductibleOptions: ['₱1,000', '₱2,000'],
    reimbursementOptions: ['70%', '80%'],
    paymentFreqOptions: ['Annually', 'Monthly'],
    fullDetails: {
      'Key Benefits': [
        'Coverage Term: 1 year, renewable annually.',
        'Annual Premium: Starting from ₱800 - ₱1,500 per year (monthly options available).',
        'Total Annual Coverage Limit: Up to ₱20,000 - ₱30,000 for covered accidental injuries and illnesses.',
      ],
      "What's Covered": [
        'Veterinary consultations and check-ups related to covered incidents.',
        'Diagnostic tests (e.g., X-rays, blood tests, urinalysis) to determine the cause of illness or injury.',
        'Medications prescribed by a licensed veterinarian.',
        'Minor procedures and treatments for accidental injuries (e.g., cuts, sprains, minor burns) and common illnesses (e.g., ear infections, skin allergies, gastrointestinal issues).',
        'Emergency care if medically necessary due to a covered accident or illness.',
      ],
      'Important Notes': [
        'Waiting Periods: Accidents: <span class="font-bold">3 days</span>. Illnesses: <span class="font-bold">14 days</span>.',
        'Exclusions: Pre-existing conditions, Routine/Preventive Care, Behavioral issues, breeding/pregnancy, cosmetic procedures, negligence, intentional harm, illegal activities.',
        'Claim Reimbursement: Claims are typically processed on a reimbursement basis, meaning you pay the vet first, then submit your claim for reimbursement up to your coverage limit.',
        'Eligibility: Pet must be <span class="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.',
      ],
    },
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
    iconKey: 'legacyInsuranceIcon',
    coverageOptions: ['₱5,000', '₱10,000', '₱20,000'],
    deductibleOptions: ['₱0', '₱500'],
    reimbursementOptions: ['100%'],
    paymentFreqOptions: ['Annually', 'Monthly'],
    fullDetails: {
      'Key Benefits': [
        'Coverage Term: 1 year, renewable annually.',
        'Annual Premium: Starting from ₱600 - ₱1,000 per year (monthly options available).',
        'Total Annual Coverage Limit: Up to ₱5,000 - ₱20,000 for covered incidents.',
      ],
      "What's Covered": [
        'Accidental Death or Essential Euthanasia: Up to ₱15,000 in the event of accidental death or a veterinarian-prescribed essential euthanasia due to covered accidental injuries or severe illnesses (as defined by the policy).',
        'Burial/Cremation Assistance: Up to ₱7,500 to help cover the costs of your pet\'s dignified farewell.',
        'Lost Pet Advertising and Reward: Up to ₱7,500 to assist with advertising costs and reward money to help find your lost pet.',
      ],
      'Important Notes': [
        'Waiting Periods: Accidental Death: <span class="font-bold">3 days</span>. Essential Euthanasia (illness): <span class="font-bold">14 days</span>. Lost Pet: <span class="font-bold">14 days</span>.',
        'Exclusions: Death due to pre-existing conditions (unless explicitly covered after a waiting period), routine procedures, negligence, or intentional harm. Theft or mysterious disappearance without a formal report (e.g., barangay blotter for lost pet). Costs not directly related to burial/cremation or lost pet advertising.',
        'Claim Process: Detailed documentation (e.g., veterinary certificates, official receipts, police/barangay reports for lost pets) will be required for claims.',
        'Eligibility: Your pet must be <span class="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.',
      ],
    },
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
    iconKey: 'medicareLegacyIcon',
    coverageOptions: ['₱7,500', '₱25,000', '₱50,000', '₱100,000+'],
    deductibleOptions: ['₱1,000', '₱2,000', '₱3,000'],
    reimbursementOptions: ['80%', '90%'],
    paymentFreqOptions: ['Annually', 'Monthly'],
    fullDetails: {
      'Key Benefits': [
        'Coverage Term: 1 year, renewable annually.',
        'Annual Premium: Starting from ₱1,500 - ₱3,000+ per year (or inquire about our convenient monthly payment options and potential discounts for combined coverage).',
        'Total Annual Coverage Limit: Up to ₱7,500 - ₱100,000+ for all covered benefits combined.',
      ],
      "What's Covered": [
        'Extensive Accidental Injury & Illness Coverage: Up to ₱70,000+ for vet consultations, diagnostics (X-rays, MRI, blood work), prescribed medications, surgeries, hospitalization, and emergency care. Covers both minor and major medical events.',
        'Accidental Death or Essential Euthanasia: Up to ₱20,000 for accidental death or veterinarian-prescribed essential euthanasia due to covered accidental injuries or severe illnesses.',
        'Burial/Cremation Assistance: Up to 10,000 for end-of-life arrangements.',
        'Lost Pet Advertising and Reward: Up to 10,000 for advertising costs and reward to help locate your missing pet.',
      ],
      'Important Notes': [
        'Waiting Periods: Accidents: <span class="font-bold">3 days</span>. Illnesses: <span class="font-bold">14 days</span>. Cruciate Ligament Conditions: A longer waiting period of <span class="font-bold">6 months</span> may apply for specific orthopedic conditions like cruciate ligament injuries, or may require a vet waiver.',
        'Exclusions: Pre-existing conditions, Routine/Preventive Care (unless specific wellness add-ons are chosen), Behavioral issues, breeding/pregnancy, or cosmetic procedures. Conditions arising from negligence, intentional harm, or illegal activities.',
        'Deductibles/Co-payments: A deductible (e.g., a fixed amount per claim) or a co-payment percentage (e.g., you pay 20% of the vet bill, we cover 80%) may apply. Specified in your full policy document.',
        'Sub-limits: While there\'s a generous overall coverage limit, some specific treatments or conditions may have their own sub-limits (e.g., maximum amount for a single surgery).',
        'Claim Reimbursement: Claims are typically processed on a reimbursement basis, meaning you pay the vet first, then submit your claim for reimbursement up to your coverage limit.',
        'Eligibility: Your pet must be <span class="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.',
      ],
    },
  },
];

const addOnDefinitions: AddOnDefinition[] = [
  {
    id: 'planting_ceremony',
    name: 'Planting Ceremony Experience',
    description: 'A personalized, simple ceremony where you can commemorate your pet, often involving the planting of a memorial tree or plant. Includes basic service and a certificate.',
    price: 2500,
    type: 'one-time',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'plantable_urn',
    name: 'Plantable Urn',
    description: 'A biodegradable urn designed to hold your pet\'s ashes, containing seeds that grow into a tree or plant, allowing you to create a living memorial.',
    price: 1800,
    type: 'one-time',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'online_vet_consults',
    name: 'Online Vet Consultations',
    description: 'Unlimited virtual consultations with a licensed veterinarian for non-emergency advice, follow-ups, and general health queries.',
    price: 1200,
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'behavioral_therapy_support',
    name: 'Behavioral Therapy Support',
    description: 'Covers a portion of vet-recommended behavioral therapy sessions for issues like anxiety, aggression, or excessive barking (e.g., up to ₱6,000 annual limit for professional consultations).',
    price: 1500,
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'travel_protection',
    name: 'Travel Protection',
    description: 'Extends coverage for accidents and illnesses while traveling with your pet within the Philippines (e.g., up to ₱10,000 per incident for medical emergencies occurring more than 50km from home address). Also includes emergency boarding if owner is hospitalized.',
    price: 900,
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'routine_dental_care',
    name: 'Routine Dental Care',
    description: 'Covers a portion of routine dental cleaning costs (e.g., up to ₱5,000 per year) to prevent major dental issues. Does *not* cover major dental surgery or pre-existing conditions.',
    price: 1800,
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'wellness_preventive_care',
    name: 'Wellness & Preventive Care',
    description: 'Covers a portion of routine annual check-ups, vaccinations, deworming, and flea/tick prevention (e.g., up to ₱7,500 annual limit).',
    price: 2500,
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'lost_pet_recovery_enhanced',
    name: 'Lost Pet Recovery (Enhanced)',
    description: 'Increases coverage for lost pet advertising and reward beyond the basic Legacy limit (e.g., up to ₱15,000) and includes professional pet recovery specialist consultation.',
    price: 1000,
    type: 'annual',
    availableFor: ['Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
];

const donationPercentages = [0, 1, 2, 3, 5];


interface PaymentDetailsStepProps {
  formData: PaymentDetails; // This component handles PaymentDetails specific data
  productDetails: ProductDetails; // We need the *full* ProductDetails to calculate premium
  onUpdate: (data: Partial<PaymentDetails>) => void;
  onPrev: () => void; // Moves back to ProductDetailsStep
  onNext: () => void; // Moves to next step (e.g., Confirmation)
}

const PaymentDetailsStep: React.FC<PaymentDetailsStepProps> = ({
  formData,
  productDetails, // Receive productDetails from parent
  onUpdate,
  onPrev,
  onNext,
}) => {
  const [localFormData, setLocalFormData] = useState<PaymentDetails>(formData);
  const [premiumCalculation, setPremiumCalculation] = useState({
    baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0
  });

  // Recalculate premium whenever productDetails change
  const memoizedCalculatePremium = useCallback(() => {
    // Ensure all product details are available for calculation
    if (productDetails.productName && productDetails.coverageAmount && productDetails.deductible &&
        productDetails.reimbursementRate && productDetails.paymentFrequency) {
      const calculated = calculatePremium(
        productDetails.productName,
        productDetails.coverageAmount,
        productDetails.deductible,
        productDetails.reimbursementRate,
        productDetails.paymentFrequency,
        productDetails.selectedAddOns,
        productDetails.donationPercentage
      );
      setPremiumCalculation(calculated);
    } else {
      setPremiumCalculation({ baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0 });
    }
  }, [productDetails]); // Dependency on productDetails

  useEffect(() => {
    memoizedCalculatePremium();
  }, [memoizedCalculatePremium]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(localFormData);
      onNext();
    }
  };

  const validateForm = (): boolean => {
    if (!localFormData.paymentMethod) {
      alert('Please select a payment method.');
      return false;
    }

    if (localFormData.paymentMethod === 'Credit/Debit Card') {
      if (!localFormData.cardNumber || localFormData.cardNumber.length < 16) {
        alert('Please enter a valid 16-digit card number.');
        return false;
      }
      if (!localFormData.cardName) {
        alert('Please enter the name on the card.');
        return false;
      }
      if (!localFormData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(localFormData.expiryDate)) {
        alert('Please enter a valid expiry date (MM/YY).');
        return false;
      }
      if (!localFormData.cvv || localFormData.cvv.length < 3 || localFormData.cvv.length > 4) {
        alert('Please enter a valid 3 or 4-digit CVV.');
        return false;
      }
    } else if (localFormData.paymentMethod === 'Bank Transfer') {
      if (!localFormData.bankName) {
        alert('Please enter the bank name for bank transfer.');
        return false;
      }
      if (!localFormData.accountNumber) {
        alert('Please enter the account number for bank transfer.');
        return false;
      }
      if (!localFormData.accountName) {
        alert('Please enter the account name for bank transfer.');
        return false;
      }
    } else if (localFormData.paymentMethod === 'GCash') {
      if (!localFormData.gcashNumber || localFormData.gcashNumber.length < 11 || !/^\d+$/.test(localFormData.gcashNumber)) {
        alert('Please enter a valid 11-digit GCash number.');
        return false;
      }
      if (!localFormData.gcashName) {
        alert('Please enter the GCash account name.');
        return false;
      }
    }

    return true;
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Payment Details</h2>

        <p className="text-gray-700 mb-6">
          Review your estimated premium and choose your preferred payment method.
        </p>

        {/* Premium Summary is now here */}
        <div className="mb-8">
          <PremiumSummary
            premiumCalculation={premiumCalculation}
            selectedPaymentFrequency={productDetails.paymentFrequency} // Use payment frequency from productDetails
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-bold text-[#342d47] mb-4">Choose Payment Method</h3>

          <div className="space-y-4">
            {/* Credit/Debit Card */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodCard"
                name="paymentMethod"
                value="Credit/Debit Card"
                checked={localFormData.paymentMethod === 'Credit/Debit Card'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodCard" className="ml-2 block text-sm font-medium text-gray-700">
                Credit/Debit Card
              </Label>
            </div>
            {localFormData.paymentMethod === 'Credit/Debit Card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <Label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</Label>
                  <Input type="text" id="cardNumber" name="cardNumber" value={localFormData.cardNumber || ''} onChange={handleChange} placeholder="XXXX XXXX XXXX XXXX" required />
                </div>
                <div>
                  <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</Label>
                  <Input type="text" id="cardName" name="cardName" value={localFormData.cardName || ''} onChange={handleChange} placeholder="Full Name" required />
                </div>
                <div>
                  <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</Label>
                  <Input type="text" id="expiryDate" name="expiryDate" value={localFormData.expiryDate || ''} onChange={handleChange} placeholder="MM/YY" required />
                </div>
                <div>
                  <Label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</Label>
                  <Input type="text" id="cvv" name="cvv" value={localFormData.cvv || ''} onChange={handleChange} placeholder="XXX" required />
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodBankTransfer"
                name="paymentMethod"
                value="Bank Transfer"
                checked={localFormData.paymentMethod === 'Bank Transfer'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodBankTransfer" className="ml-2 block text-sm font-medium text-gray-700">
                Bank Transfer (Instructions will be provided)
              </Label>
            </div>
            {localFormData.paymentMethod === 'Bank Transfer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</Label>
                  <Input type="text" id="bankName" name="bankName" value={localFormData.bankName || ''} onChange={handleChange} placeholder="e.g., BDO, BPI" required />
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</Label>
                  <Input type="text" id="accountNumber" name="accountNumber" value={localFormData.accountNumber || ''} onChange={handleChange} placeholder="e.g., 001234567890" required />
                </div>
                <div className="col-span-full"> {/* Make this span full width */}
                  <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account Name</Label>
                  <Input type="text" id="accountName" name="accountName" value={localFormData.accountName || ''} onChange={handleChange} placeholder="Full Name of Account Holder" required />
                </div>
              </div>
            )}

            {/* GCash */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodGcash"
                name="paymentMethod"
                value="GCash"
                checked={localFormData.paymentMethod === 'GCash'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodGcash" className="ml-2 block text-sm font-medium text-gray-700">
                GCash
              </Label>
            </div>
            {localFormData.paymentMethod === 'GCash' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <Label htmlFor="gcashNumber" className="block text-sm font-medium text-gray-700 mb-1">GCash Number</Label>
                  <Input type="text" id="gcashNumber" name="gcashNumber" value={localFormData.gcashNumber || ''} onChange={handleChange} placeholder="e.g., 0917XXXXXXX" required />
                </div>
                <div>
                  <Label htmlFor="gcashName" className="block text-sm font-medium text-gray-700 mb-1">GCash Account Name</Label>
                  <Input type="text" id="gcashName" name="gcashName" value={localFormData.gcashName || ''} onChange={handleChange} placeholder="Full Name of GCash Account Holder" required />
                </div>
              </div>
            )}

             {/* Cash/Cheque - no additional fields for now */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodCashCheque"
                name="paymentMethod"
                value="Cash/Cheque"
                checked={localFormData.paymentMethod === 'Cash/Cheque'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodCashCheque" className="ml-2 block text-sm font-medium text-gray-700">
                Cash / Cheque (For in-person payment)
              </Label>
            </div>

          </div>
        </form>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          onClick={onPrev} // Go back to Product Details step
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Previous: Product Details
        </Button>

        <Button
          type="submit" // This button will trigger form submission
          onClick={handleSubmit} // Call handleSubmit when this button is clicked
          className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
        >
          Next: Review & Confirm
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetailsStep;