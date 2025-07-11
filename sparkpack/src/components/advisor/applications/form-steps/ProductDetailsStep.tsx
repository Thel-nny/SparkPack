"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Assuming Label component exists

// Import sub-components
import ProductCard from './product-details-subcomponents/ProductCard';
import ProductOverview from './product-details-subcomponents/ProductOverview';
import PackageConfiguration from './product-details-subcomponents/PackageConfiguration';
import OptionalBenefitsAndDonation from './product-details-subcomponents/OptionalBenefitsAndDonation';

// Updated import paths to use applicationFormData.ts
import { ProductDetails, AddOnDefinition, SelectedAddOn, ProductOption } from '@/types/applicationFormData'; 

interface ProductDetailsStepProps {
  formData: ProductDetails;
  onUpdate: (data: Partial<ProductDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const productIcons: { [key: string]: React.ReactNode } = { 
  medicalCareIcon: (
    <svg className="w-12 h-12 text-[#8cc63f] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  legacyInsuranceIcon: (
    <svg className="w-12 h-12 text-[#8cc63f] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
    </svg>
  ),
  medicareLegacyIcon: (
    <svg className="w-12 h-12 text-[#8cc63f] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ==========================================================
// Product and Add-on Definitions (Adjusted Pricing)
// ==========================================================

const productOptions: ProductOption[] = [
  {
    name: 'Medical Care Insurance',
    description: 'Basic Plan',
    premiumRange: '₱950 - ₱1,700',
    coverageRange: '₱20,000 - ₱30,000',
    details: [
      'Lasts for 1 year (renewable annually)',
      'Premium payment starts from ₱950 - ₱1,700 per year (monthly options available)',
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
        'Annual Premium: Starting from ₱950 - ₱1,700 per year (monthly options available).',
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
    premiumRange: '₱700 - ₱1,100',
    coverageRange: '₱5,000 - ₱20,000',
    details: [
      'Lasts for 1 year (renewable annually)',
      'Premium payment starts from ₱700 - ₱1,100 per year (monthly options available)',
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
        'Annual Premium: Starting from ₱700 - ₱1,100 per year (monthly options available).',
        'Total Annual Coverage Limit: Up to ₱5,000 - ₱20,000 for covered incidents.',
      ],
      "What's Covered": [
        'Accidental Death or Essential Euthanasia: Up to ₱12,000 in the event of accidental death or a veterinarian-prescribed essential euthanasia due to covered accidental injuries or severe illnesses (as defined by the policy).',
        'Burial/Cremation Assistance: Up to ₱9,000 to help cover the costs of your pet\'s dignified farewell.',
      ],
      'Important Notes': [
        'Waiting Periods: Accidental Death: <span class="font-bold">3 days</span>. Essential Euthanasia (illness): <span class="font-bold">14 days</span>.',
        'Exclusions: Death due to pre-existing conditions (unless explicitly covered after a waiting period), routine procedures, negligence, or intentional harm. Theft or mysterious disappearance without a formal report (e.g., barangay blotter for lost pet). Costs not directly related to burial/cremation or lost pet advertising.',
        'Claim Process: Detailed documentation (e.g., veterinary certificates, official receipts) will be required for claims.',
        'Eligibility: Your pet must be <span class="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.',
      ],
    },
  },
  {
    name: 'Medicare and Legacy Insurance',
    description: 'Comprehensive Plan',
    // REVISED premiumRange
    premiumRange: '₱1,800 - ₱4,500+',
    // REVISED coverageRange
    coverageRange: '₱7,500 - ₱80,000',
    details: [
      'Lasts for 1 year (renewable annually)',
      'Premium payment starts from ₱1,800 - ₱4,500+ per year (monthly options available, with potential discounts for combined coverage)',
      // REVISED coverage detail
      'Coverage up to ₱7,500 - ₱80,000'
    ],
    iconKey: 'medicareLegacyIcon',
    // REVISED coverageOptions
    coverageOptions: ['₱7,500', '₱25,000', '₱50,000', '₱80,000'],
    // REVISED deductibleOptions
    deductibleOptions: ['₱3,000', '₱5,000'],
    reimbursementOptions: ['80%', '90%'],
    paymentFreqOptions: ['Annually', 'Monthly'],
    fullDetails: {
      'Key Benefits': [
        'Coverage Term: 1 year, renewable annually.',
        'Annual Premium: Starting from ₱1,800 - ₱4,500+ per year (or inquire about our convenient monthly payment options and potential discounts for combined coverage).',
        // REVISED Total Annual Coverage Limit
        'Total Annual Coverage Limit: Up to ₱7,500 - ₱80,000 for all covered benefits combined.',
      ],
      "What's Covered": [
        'Extensive Accidental Injury & Illness Coverage: Up to ₱30,000 for vet consultations, diagnostics (X-rays, MRI, blood work), prescribed medications, surgeries, hospitalization, and emergency care. Covers both minor and major medical events.',
        'Accidental Death or Essential Euthanasia: Up to ₱15,000 for accidental death or veterinarian-prescribed essential euthanasia due to covered accidental injuries or severe illnesses.',
        'Burial/Cremation Assistance: Up to ₱10,000 to help cover end-of-life arrangements.',
      ],
      'Important Notes': [
        'Waiting Periods: Accidents: <span class="font-bold">3 days</span>. Illnesses: <span class="font-bold">14 days</span>. Cruciate Ligament Conditions: A longer waiting period of <span class="font-bold">6 months</span> may apply for specific orthopedic conditions like cruciate ligament injuries, or may require a vet waiver.',
        'Exclusions: Pre-existing conditions, Routine/Preventive Care (unless specific wellness add-ons are chosen), Behavioral issues, breeding/pregnancy, or cosmetic procedures. Conditions arising from negligence, intentional harm, or illegal activities.',
        'Deductibles/Co-payments: A deductible (e.g., a fixed amount per claim) or a co-payment percentage (e.g., you pay 20% of the vet bill, we cover 80%) may apply. Current deductible options are ₱3,000 or ₱5,000. Specified in your full policy document.',
        'Sub-limits: While there\'s a generous overall coverage limit, some specific treatments or conditions may have their own sub-limits (e.g., maximum amount for a single surgery).',
        'Claim Reimbursement: Claims are typically processed on a reimbursement basis, meaning you pay the vet first, then submit your claim for reimbursement up to your coverage limit.',
        'Eligibility: Your pet must be <span class="font-bold">3 months to 8 years old</span> and in good health at the time of enrollment.',
      ],
    },
  },
];

const addOnDefinitions: AddOnDefinition[] = [
  // Universal Add-ons
  {
    id: 'planting_ceremony',
    name: 'Planting Ceremony Experience',
    description: 'A personalized, simple ceremony where you can commemorate your pet, often involving the planting of a memorial tree or plant. Includes basic service and a certificate.',
    price: 2500, // One-time fee
    type: 'one-time',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'plantable_urn',
    name: 'Plantable Urn',
    description: 'A biodegradable urn designed to hold your pet\'s ashes, containing seeds that grow into a tree or plant, allowing you to create a living memorial.',
    price: 1800, // One-time fee
    type: 'one-time',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'online_vet_consults',
    name: 'Online Vet Consultations',
    description: 'Unlimited virtual consultations with a licensed veterinarian for non-emergency advice, follow-ups, and general health queries.',
    price: 1200, // Annual fee
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'behavioral_therapy_support',
    name: 'Behavioral Therapy Support',
    description: 'Covers a portion of vet-recommended behavioral therapy sessions for issues like anxiety, aggression, or excessive barking (e.g., up to ₱6,000 annual limit for professional consultations).',
    price: 1500, // Annual fee
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'travel_protection',
    name: 'Travel Protection',
    description: 'Extends coverage for accidents and illnesses while traveling with your pet within the Philippines (e.g., up to ₱10,000 per incident for medical emergencies occurring more than 50km from home address). Also includes emergency boarding if owner is hospitalized.',
    price: 900, // Annual fee
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
  // Insurance-Specific Add-ons
  {
    id: 'routine_dental_care',
    name: 'Routine Dental Care',
    description: 'Covers a portion of routine dental cleaning costs (e.g., up to ₱5,000 per year) to prevent major dental issues. Does *not* cover major dental surgery or pre-existing conditions.',
    price: 1800, // Annual fee
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Medicare and Legacy Insurance'],
  },
  {
    id: 'wellness_preventive_care',
    name: 'Wellness & Preventive Care',
    description: 'Covers a portion of routine annual check-ups, vaccinations, deworming, and flea/tick prevention (e.g., up to ₱7,500 annual limit).',
    price: 2500, // Annual fee
    type: 'annual',
    availableFor: ['Medical Care Insurance', 'Medicare and Legacy Insurance'],
  },
];

const donationPercentages = [0, 1, 2, 3, 5];

export const calculatePremium = (
  productName: string,
  coverageAmount: string,
  deductible: string,
  reimbursementRate: string,
  _paymentFrequency: string,
  selectedAddOns: SelectedAddOn[],
  donationPercentage: number,

): { baseAnnual: number; annualTotal: number; monthlyTotal: number; oneTimeTotal: number; donationAmount: number } => {
  let basePrice = 0;
  const coverageFactor = 1; // Keeping this at 1 as it's not explicitly used as a multiplier
  let deductibleFactor = 1;
  let reimbursementFactor = 1;

  const cleanCoverage = parseFloat(coverageAmount?.replace(/[₱,]/g, '') || '0');
  const cleanDeductible = parseFloat(deductible?.replace(/[₱,]/g, '') || '0');
  const cleanReimbursement = parseFloat(reimbursementRate?.replace(/%/g, '') || '0') / 100;

  switch (productName) {
    case 'Medical Care Insurance':
      basePrice = 950;
      if (cleanCoverage === 25000) basePrice = 1200;
      if (cleanCoverage === 30000) basePrice = 1500;
      if (cleanDeductible === 2000) deductibleFactor = 0.93;
      if (cleanReimbursement === 0.70) reimbursementFactor = 0.97;
      break;
    case 'Legacy Insurance':
      basePrice = 700;
      if (cleanCoverage === 10000) basePrice = 850;
      if (cleanCoverage === 20000) basePrice = 1050;
      if (cleanDeductible === 500) deductibleFactor = 0.97;
      break;
    case 'Medicare and Legacy Insurance':
      basePrice = 1800;
      if (cleanCoverage === 25000) basePrice = 2500;
      if (cleanCoverage === 50000) basePrice = 3500;
      // Adjusted for new max coverage ₱80,000
      if (cleanCoverage === 80000) basePrice = 4500; // New base price for ₱80,000 coverage
      // Deductible adjustments for new options ₱3,000 and ₱5,000
      if (cleanDeductible === 3000) deductibleFactor = 0.88;
      if (cleanDeductible === 5000) deductibleFactor = 0.85; // New deductible factor for ₱5,000
      if (cleanReimbursement === 0.80) reimbursementFactor = 0.93;
      break;
    default:
      return { baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0 };
  }

  const calculatedBaseAnnualPremium = basePrice * coverageFactor * deductibleFactor * reimbursementFactor;

  let annualAddOnCost = 0;
  let oneTimeAddOnCost = 0;
  selectedAddOns.forEach(addOn => {
    const def = addOnDefinitions.find(d => d.id === addOn.id);
    if (def) {
      if (def.type === 'annual') {
        annualAddOnCost += def.price;
      } else if (def.type === 'one-time') {
        oneTimeAddOnCost += def.price;
      }
    }
  });

const totalAnnualPremiumBeforeDonation = calculatedBaseAnnualPremium + annualAddOnCost;
  let calculatedDonationAmount = (totalAnnualPremiumBeforeDonation * (donationPercentage / 100));
  let finalAnnualTotalPremium = totalAnnualPremiumBeforeDonation + calculatedDonationAmount;
  const monthlySurchargeFactor = 1.05; // Keeping this at 5% as previously discussed
  let finalMonthlyTotalPremium = (finalAnnualTotalPremium / 12) * monthlySurchargeFactor;

  finalAnnualTotalPremium = Math.round(finalAnnualTotalPremium);
  finalMonthlyTotalPremium = Math.round(finalMonthlyTotalPremium * 100) / 100;
  calculatedDonationAmount = Math.round(calculatedDonationAmount * 100) / 100;

  return {
    baseAnnual: Math.round(calculatedBaseAnnualPremium),
    annualTotal: finalAnnualTotalPremium,
    monthlyTotal: finalMonthlyTotalPremium,
    oneTimeTotal: oneTimeAddOnCost,
    donationAmount: calculatedDonationAmount
  };
};

// ==========================================================
// ProductDetailsStep Component
// ==========================================================

const ProductDetailsStep = forwardRef<any, ProductDetailsStepProps>(
  ({ formData, onUpdate, onPrev, onNext }, ref) => {
    const [currentSubStep, setCurrentSubStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({}); // State for inline errors
    const totalSubSteps = 3;

    // Validation function for individual fields (for PackageConfiguration)
    const validateField = (name: keyof ProductDetails, value: string | number): string => {
      let error = '';
      const currentProduct = productOptions.find(p => p.name === formData.productName);

      switch (name) {
        case 'productName':
          if (!value) error = 'Please select an insurance package.';
          break;
        case 'coverageAmount':
          if (!value) {
            error = 'Coverage Amount is required.';
          } else if (currentProduct && currentProduct.coverageOptions && !currentProduct.coverageOptions.includes(value as string)) {
            error = 'Invalid coverage amount for this product.';
          }
          break;
        case 'deductible':
          if (!value) {
            error = 'Deductible is required.';
          } else if (currentProduct && currentProduct.deductibleOptions && !currentProduct.deductibleOptions.includes(value as string)) {
            error = 'Invalid deductible for this product.';
          }
          break;
        case 'reimbursementRate':
          if (!value) {
            error = 'Reimbursement Rate is required.';
          } else if (currentProduct && currentProduct.reimbursementOptions && !currentProduct.reimbursementOptions.includes(value as string)) {
            error = 'Invalid reimbursement rate for this product.';
          }
          break;
        case 'paymentFrequency':
          if (!value) {
            error = 'Payment Frequency is required.';
          } else if (currentProduct && currentProduct.paymentFreqOptions && !currentProduct.paymentFreqOptions.includes(value as string)) {
            error = 'Invalid payment frequency.';
          }
          break;
        case 'startDate':
          if (!value) error = 'Start Date is required.';
          break;
        // donationPercentage and selectedAddOns are optional and handled by handleAddOnToggle/handleChange
        default:
          break;
      }
      return error;
    };

    // Comprehensive validation for the current sub-step
    const validateSubStep = (): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      if (currentSubStep === 1) { // Product Selection
        const error = validateField('productName', formData.productName);
        if (error) {
          newErrors.productName = error;
          isValid = false;
        }
      } else if (currentSubStep === 2) { // Package Configuration
        const fieldsToValidate: Array<keyof ProductDetails> = [
          'coverageAmount', 'deductible', 'reimbursementRate', 'paymentFrequency', 'startDate'
        ];
        fieldsToValidate.forEach((field) => {
          const error = validateField(field, formData[field] as string);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
      } else if (currentSubStep === 3) { // Optional Benefits & Donation
        // No required fields for this step, it's all optional.
        isValid = true;
      }

      setErrors(newErrors);
      return isValid;
    };

    // Expose the validate function to the parent component via ref
    useImperativeHandle(ref, () => ({
      validate: validateSubStep,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      let newValue: string | number = value;

      if (name === 'donationPercentage') {
        newValue = parseFloat(value);
      }

      onUpdate({
        [name as keyof ProductDetails]: newValue,
      });

      // Validate field on change and update errors state
      const error = validateField(name as keyof ProductDetails, newValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const handleProductSelect = (productName: string) => {
      const selectedProduct = productOptions.find(p => p.name === productName);

      // Map productName to planType enum value
      let planType = '';
      switch (productName) {
        case 'Medical Care Insurance':
          planType = 'MEDICAL_CARE_INSURANCE';
          break;
        case 'Legacy Insurance':
          planType = 'LEGACY_INSURANCE';
          break;
        case 'Medicare and Legacy Insurance':
          planType = 'MEDICARE_AND_LEGACY_INSURANCE';
          break;
        default:
          planType = 'SINGLE_PRODUCT'; // Fallback or error state
      }

      // Update parent formData directly
      onUpdate({
        productName: productName,
        planType: planType,
        coverageAmount: selectedProduct?.coverageOptions?.[0] || '',
        deductible: selectedProduct?.deductibleOptions?.[0] || '',
        reimbursementRate: selectedProduct?.reimbursementOptions?.[0] || '',
        paymentFrequency: 'Annually', // Default to Annually
        startDate: new Date().toISOString().split('T')[0],
        coverageLength: '1 Year',
        selectedAddOns: [], // Reset add-ons on product change
        donationPercentage: 0, // Reset donation on product change
      });

      // Clear product-related errors when a new product is selected
      setErrors({});
    };

    const handleAddOnToggle = (addOn: AddOnDefinition) => {
      // Get the current selectedAddOns from formData
      const currentSelectedAddOns = formData.selectedAddOns || [];
      const isSelected = currentSelectedAddOns.some((item: SelectedAddOn) => item.id === addOn.id);
      
      let newSelectedAddOns: SelectedAddOn[];
      if (isSelected) {
        newSelectedAddOns = currentSelectedAddOns.filter((item: SelectedAddOn) => item.id !== addOn.id);
      } else {
        newSelectedAddOns = [...currentSelectedAddOns, {
          id: addOn.id,
          name: addOn.name,
          price: addOn.price,
          type: addOn.type
        }];
      }

      // Update parent formData with the new array of selectedAddOns
      onUpdate({ selectedAddOns: newSelectedAddOns });
    };

    const handleInternalNext = () => {
      if (!validateSubStep()) {
        return;
      }

      // No need to call onUpdate(formData) here, as handleChange and handleProductSelect already do this.

      if (currentSubStep < totalSubSteps) {
        setCurrentSubStep((prevSubStep) => prevSubStep + 1);
      } else {
        onNext(); // Move to next main step (PaymentDetailsStep)
      }
    };

    const handleInternalPrev = () => {
      // No validation needed when going back
      // No need to call onUpdate(formData) here, as handleChange and handleProductSelect already do this.

      if (currentSubStep > 1) {
        setCurrentSubStep((prevSubStep) => prevSubStep - 1);
      } else {
        onPrev(); // Move to previous main step (Pet Details)
      }
    };

    const selectedProductData = productOptions.find(p => p.name === formData.productName);
    const filteredAddOns = addOnDefinitions.filter(addOn =>
      selectedProductData && addOn.availableFor.includes(selectedProductData.name)
    );
    const oneTimeAddOns = filteredAddOns.filter(ao => ao.type === 'one-time');
    const annualAddOns = filteredAddOns.filter(ao => ao.type === 'annual');

    const renderSubStepContent = () => {
      switch (currentSubStep) {
        case 1: // Product Selection
          return (
            <>
              <p className="text-gray-700 mb-6">
                We offer three of the most common types of pet insurance. These products can be selected based on the one that best fits the reason you want pet insurance and is most useful for the specific needs of your pet.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {productOptions.map((product) => (
                  <ProductCard
                    key={product.name}
                    product={product}
                    isSelected={formData.productName === product.name}
                    onSelect={handleProductSelect}
                    productIcons={productIcons}
                  />
                ))}
              </div>
              {errors.productName && <p className="mt-1 text-sm text-red-500 text-center">{errors.productName}</p>}
              {selectedProductData && <ProductOverview selectedProductData={selectedProductData} />}
            </>
          );
        case 2: // Package Configuration
          return (
            <PackageConfiguration
              formData={formData} // Pass formData directly
              selectedProductData={selectedProductData}
              handleChange={handleChange}
              errors={errors} // Pass errors down
            />
          );
        case 3: // Optional Benefits & Donation
          return (
            <OptionalBenefitsAndDonation
              formData={formData} // Pass formData directly
              filteredAddOns={filteredAddOns}
              oneTimeAddOns={oneTimeAddOns}
              annualAddOns={annualAddOns}
              donationPercentages={donationPercentages}
              handleAddOnToggle={handleAddOnToggle}
              handleChange={handleChange}
              errors={errors} // Pass errors down (though likely less critical here)
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Product Details - Step {currentSubStep} of {totalSubSteps}</h2>
          <div className="mb-6 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#8cc63f] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentSubStep / totalSubSteps) * 100}%` }}
            ></div>
          </div>

          {renderSubStepContent()}
        </div>

        <div className="flex justify-between mt-4">
          <Button
            onClick={handleInternalPrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            {currentSubStep === 1 ? 'Previous: Pet Details' : 'Previous Step'}
          </Button>

          <Button
            onClick={handleInternalNext}
            className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
          >
            {currentSubStep === totalSubSteps ? 'Next: Payment Details' : 'Next Step'}
          </Button>
        </div>
      </div>
    );
  }
);

ProductDetailsStep.displayName = 'ProductDetailsStep';

export default ProductDetailsStep;