"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// Import sub-components
import ProductCard from './product-details-subcomponents/ProductCard';
import ProductOverview from './product-details-subcomponents/ProductOverview';
import PackageConfiguration from './product-details-subcomponents/PackageConfiguration';
import OptionalBenefitsAndDonation from './product-details-subcomponents/OptionalBenefitsAndDonation';
import PremiumSummary from './product-details-subcomponents/PremiumSummary';


import { ProductDetails, AddOnDefinition, SelectedAddOn, ProductOption } from '@/types/formData'; 

import {
  ShieldCheck,
  Award,
  PlusCircle,
} from 'lucide-react';

interface ProductDetailsStepProps {
  formData: ProductDetails;
  onUpdate: (data: Partial<ProductDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const productIcons: { [key: string]: React.ReactNode } = { 
  medicalCareIcon: (
    <ShieldCheck className="w-12 h-12 text-[#8cc63f] mb-4" />
  ),
  legacyInsuranceIcon: (
    <Award className="w-12 h-12 text-[#8cc63f] mb-4" />
  ),
  medicareLegacyIcon: (
    <PlusCircle className="w-12 h-12 text-[#8cc63f] mb-4" />
  ),
};

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
    coverageOptions: ['₱5,000', '₱10,000', '₱20,000'], // For lost pet/end-of-life benefit amounts
    deductibleOptions: ['₱0', '₱500'], // Might have smaller deductibles or none for legacy
    reimbursementOptions: ['100%'], // Often 100% for specific lump sum payouts
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
    coverageOptions: ['₱7,500', '₱25,000', '₱50,000', '₱100,000+'], // High tiers
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
        'Burial/Cremation Assistance: Up to ₱10,000 to help cover end-of-life arrangements.',
        'Lost Pet Advertising and Reward: Up to ₱10,000 for advertising costs and reward to help locate your missing pet.',
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
  {
    id: 'lost_pet_recovery_enhanced',
    name: 'Lost Pet Recovery (Enhanced)',
    description: 'Increases coverage for lost pet advertising and reward beyond the basic Legacy limit (e.g., up to ₱15,000) and includes professional pet recovery specialist consultation.',
    price: 1000, // Annual fee
    type: 'annual',
    availableFor: ['Legacy Insurance', 'Medicare and Legacy Insurance'],
  },
];

const donationPercentages = [0, 1, 2, 3, 5];

// ==========================================================
// Premium Calculation Function (Kept here as it uses data from this file)
// ==========================================================

const calculatePremium = (
  productName: string,
  coverageAmount: string,
  deductible: string,
  reimbursementRate: string,
  _paymentFrequency: string,
  selectedAddOns: SelectedAddOn[],
  donationPercentage: number
): { baseAnnual: number; annualTotal: number; monthlyTotal: number; oneTimeTotal: number; donationAmount: number } => {
  let basePrice = 0;
  let coverageFactor = 1;
  let deductibleFactor = 1;
  let reimbursementFactor = 1;

  // 1. Calculate Base Premium based on Product and Core Options
  const cleanCoverage = parseFloat(coverageAmount?.replace(/[₱,]/g, '') || '0');
  const cleanDeductible = parseFloat(deductible?.replace(/[₱,]/g, '') || '0');
  const cleanReimbursement = parseFloat(reimbursementRate?.replace(/%/g, '') || '0') / 100;

  switch (productName) {
    case 'Medical Care Insurance':
      basePrice = 800;
      if (cleanCoverage === 25000) basePrice = 1000;
      if (cleanCoverage === 30000) basePrice = 1200;
      if (cleanDeductible === 2000) deductibleFactor = 0.9;
      if (cleanReimbursement === 0.70) reimbursementFactor = 0.95;
      break;
    case 'Legacy Insurance':
      basePrice = 600;
      if (cleanCoverage === 10000) basePrice = 750;
      if (cleanCoverage === 20000) basePrice = 900;
      if (cleanDeductible === 500) deductibleFactor = 0.95; // Small discount for minor deductible
      break;
    case 'Medicare and Legacy Insurance':
      basePrice = 1500;
      if (cleanCoverage === 25000) basePrice = 2000;
      if (cleanCoverage === 50000) basePrice = 2800;
      if (cleanCoverage === 100000) basePrice = 4000; // Higher tier, higher base
      if (cleanDeductible === 2000) deductibleFactor = 0.9;
      if (cleanDeductible === 3000) deductibleFactor = 0.85;
      if (cleanReimbursement === 0.80) reimbursementFactor = 0.9; // Lower reimbursement gives slightly lower premium
      break;
    default:
      return { baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0 };
  }

  let calculatedBaseAnnualPremium = basePrice * coverageFactor * deductibleFactor * reimbursementFactor;

  // 2. Add Annual Add-on Costs
  let annualAddOnCost = 0;
  let oneTimeAddOnCost = 0;
  selectedAddOns.forEach(addOn => {
    if (addOn.type === 'annual') {
      annualAddOnCost += addOn.price;
    } else if (addOn.type === 'one-time') {
      oneTimeAddOnCost += addOn.price;
    }
  });

  let totalAnnualPremiumBeforeDonation = calculatedBaseAnnualPremium + annualAddOnCost;

  // 3. Calculate Donation Amount (added to annual premium)
  let calculatedDonationAmount = (totalAnnualPremiumBeforeDonation * (donationPercentage / 100)); // Changed to 'let'

  let finalAnnualTotalPremium = totalAnnualPremiumBeforeDonation + calculatedDonationAmount;

  // 4. Calculate Monthly Premium (with slight surcharge for monthly)
  const monthlySurchargeFactor = 1.05; // 5% surcharge for monthly payments
  let finalMonthlyTotalPremium = (finalAnnualTotalPremium / 12) * monthlySurchargeFactor;

  // Round for display
  finalAnnualTotalPremium = Math.round(finalAnnualTotalPremium);
  finalMonthlyTotalPremium = Math.round(finalMonthlyTotalPremium * 100) / 100; // Keep two decimal places
  calculatedDonationAmount = Math.round(calculatedDonationAmount * 100) / 100; // Round donation amount

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

const ProductDetailsStep: React.FC<ProductDetailsStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  const [localFormData, setLocalFormData] = useState<ProductDetails>(formData);
  const [currentSubStep, setCurrentSubStep] = useState(1); // 1: Select Product, 2: Configure Package, 3: Optional Benefits & Donation, 4: Summary/Compare
  const [premiumCalculation, setPremiumCalculation] = useState({
    baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0
  });

  const totalSubSteps = 4; // Now four sub-steps

  // Effect to update localFormData when parent formData changes (e.g., on back navigation)
  useEffect(() => {
    setLocalFormData(formData);
    // Ensure calculation runs when component mounts or formData changes externally
    if (formData.productName) {
      setPremiumCalculation(calculatePremium(
        formData.productName,
        formData.coverageAmount,
        formData.deductible,
        formData.reimbursementRate,
        formData.paymentFrequency,
        formData.selectedAddOns,
        formData.donationPercentage
      ));
    } else {
      setPremiumCalculation({ baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0 });
    }
  }, [formData]);

  // Recalculate premium whenever relevant localFormData changes
  const memoizedCalculatePremium = useCallback(() => {
    if (localFormData.productName && localFormData.coverageAmount && localFormData.deductible &&
        localFormData.reimbursementRate && localFormData.paymentFrequency) {
      const calculated = calculatePremium(
        localFormData.productName,
        localFormData.coverageAmount,
        localFormData.deductible,
        localFormData.reimbursementRate,
        localFormData.paymentFrequency,
        localFormData.selectedAddOns,
        localFormData.donationPercentage
      );
      setPremiumCalculation(calculated);
    } else {
      setPremiumCalculation({ baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0 });
    }
  }, [
    localFormData.productName,
    localFormData.coverageAmount,
    localFormData.deductible,
    localFormData.reimbursementRate,
    localFormData.paymentFrequency,
    localFormData.selectedAddOns,
    localFormData.donationPercentage
  ]);

  useEffect(() => {
    memoizedCalculatePremium();
  }, [memoizedCalculatePremium]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'donationPercentage') {
      setLocalFormData((prevData) => ({
        ...prevData,
        donationPercentage: parseFloat(value),
      }));
    } else {
      setLocalFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleProductSelect = (productName: string) => {
    const selectedProduct = productOptions.find(p => p.name === productName);
    setLocalFormData({
      ...localFormData,
      productName: productName,
      // Reset config options to sensible defaults for the new product
      coverageAmount: selectedProduct?.coverageOptions?.[0] || '',
      deductible: selectedProduct?.deductibleOptions?.[0] || '',
      reimbursementRate: selectedProduct?.reimbursementOptions?.[0] || '',
      paymentFrequency: 'Annually', // Default to annual
      startDate: new Date().toISOString().split('T')[0], // Default to today
      coverageLength: '1 Year', // Assuming fixed 1 year for now
      selectedAddOns: [], // Clear add-ons when product changes
      donationPercentage: 0, // Reset donation
    });
  };

  const handleAddOnToggle = (addOn: AddOnDefinition) => {
    setLocalFormData(prevData => {
      const isSelected = prevData.selectedAddOns.some(item => item.id === addOn.id);
      if (isSelected) {
        return {
          ...prevData,
          selectedAddOns: prevData.selectedAddOns.filter(item => item.id !== addOn.id)
        };
      } else {
        return {
          ...prevData,
          selectedAddOns: [...prevData.selectedAddOns, {
            id: addOn.id,
            name: addOn.name,
            price: addOn.price,
            type: addOn.type
          }]
        };
      }
    });
  };

  const validateSubStep = (): boolean => {
    let isValid = true;
    let message = '';
    const currentProduct = productOptions.find(p => p.name === localFormData.productName);

    switch (currentSubStep) {
      case 1: // Product Selection
        if (!localFormData.productName.trim()) {
          message = 'Please select an insurance package to proceed.';
          isValid = false;
        }
        break;
      case 2: // Package Configuration
        if (!localFormData.coverageAmount ||
            !localFormData.deductible ||
            !localFormData.reimbursementRate ||
            !localFormData.paymentFrequency ||
            !localFormData.startDate) {
          message = 'Please configure all required package options.';
          isValid = false;
        } else if (currentProduct) {
          // Basic check that selected values are valid options for the chosen product
          if (currentProduct.coverageOptions && !currentProduct.coverageOptions.includes(localFormData.coverageAmount)) {
            message = 'Invalid coverage amount selected for this product.'; isValid = false;
          }
          if (currentProduct.deductibleOptions && !currentProduct.deductibleOptions.includes(localFormData.deductible)) {
            message = 'Invalid deductible selected for this product.'; isValid = false;
          }
          if (currentProduct.reimbursementOptions && !currentProduct.reimbursementOptions.includes(localFormData.reimbursementRate)) {
            message = 'Invalid reimbursement rate selected for this product.'; isValid = false;
          }
          if (currentProduct.paymentFreqOptions && !currentProduct.paymentFreqOptions.includes(localFormData.paymentFrequency)) {
            message = 'Invalid payment frequency selected.'; isValid = false;
          }
        }
        break;
      case 3: // Optional Benefits & Donation - No required fields for this step, it's all optional.
        isValid = true;
        break;
      case 4: // Summary & Comparison - No validation needed, just confirmation.
        isValid = true;
        break;
      default:
        isValid = false; // Should not happen
    }

    if (!isValid) {
      alert(message); // Replace with a toast notification in a real app
    }
    return isValid;
  };

  const handleInternalNext = () => {
    if (!validateSubStep()) {
      return;
    }

    onUpdate(localFormData); // Save current data to parent

    if (currentSubStep < totalSubSteps) {
      setCurrentSubStep((prevSubStep) => prevSubStep + 1);
    } else {
      // If it's the last sub-step, then call the parent onNext
      onNext(); // This moves to Payment Details
    }
  };

  const handleInternalPrev = () => {
    onUpdate(localFormData); // Save current data to parent

    if (currentSubStep > 1) {
      setCurrentSubStep((prevSubStep) => prevSubStep - 1);
    } else {
      // If it's the first sub-step, then call the parent onPrev
      onPrev(); // This moves to Pet Details
    }
  };

  const selectedProductData = productOptions.find(p => p.name === localFormData.productName);
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
                  isSelected={localFormData.productName === product.name}
                  onSelect={handleProductSelect}
                  productIcons={productIcons} // Pass the icons map
                />
              ))}
            </div>
            {selectedProductData && <ProductOverview selectedProductData={selectedProductData} />}
          </>
        );
      case 2: // Package Configuration
        return (
          <PackageConfiguration
            localFormData={localFormData}
            selectedProductData={selectedProductData}
            handleChange={handleChange}
          />
        );
      case 3: // Optional Benefits & Donation
        return (
          <OptionalBenefitsAndDonation
            localFormData={localFormData}
            filteredAddOns={filteredAddOns}
            oneTimeAddOns={oneTimeAddOns}
            annualAddOns={annualAddOns}
            donationPercentages={donationPercentages}
            handleAddOnToggle={handleAddOnToggle}
            handleChange={handleChange}
          />
        );
      case 4: // Summary & Comparison
        return (
          <PremiumSummary
            premiumCalculation={premiumCalculation}
            selectedPaymentFrequency={localFormData.paymentFrequency}
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
};

export default ProductDetailsStep;