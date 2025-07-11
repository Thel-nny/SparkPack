"use client";

import React, { useState, useRef, useEffect } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';
import ProductDetailsStep from './form-steps/ProductDetailsStep';
import PaymentDetailsStep from './form-steps/PaymentDetailsStep';
import SummaryDetailsStep from './form-steps/SummaryDetailsStep'; 
import SubmitStep from './form-steps/SubmitStep';
import { ApplicationFormData, ClientDetails, PetDetails, ProductDetails, PaymentDetails, SelectedAddOn } from '@/types/applicationFormData'; 
import { createApplication, updateApplication } from '@/lib/api/applications';
import { useRouter } from 'next/navigation';
import MessageModal from '@/components/ui/MessageModal'; // Import the new MessageModal

// Define a type for the ref to the step components' validation functions
type StepValidationRef = {
  validate: () => boolean;
};

const applicationSteps = [
  { id: 1, name: 'Client Details' },
  { id: 2, name: 'Pet Details' },
  { id: 3, name: 'Product Details' },
  { id: 4, name: 'Payment Details' },
  { id: 5, name: 'Summary' },
  { id: 6, name: 'Sign & Submit' }, 
];

const NewApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // State for MessageModal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState('');

  // Ref to hold the validation function of the current step component
  const stepRef = useRef<StepValidationRef | null>(null);

  const [formData, setFormData] = useState<ApplicationFormData>({
    client: {
      // Initialize with default values to match ClientDetails interface
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      phoneNumber: '', // Now required as per applicationFormData.ts
      email: '',
      streetAddress: '',
      country: 'Philippines',
      city: 'Iloilo City',
      province: 'Iloilo',
      postalCode: '5000',
      declarationAccuracy: false,
      title: '',
      allowPhoneCollection: false,
      pob: '',
      middleName: '',
    },
    pet: {
      // Initialize with default values to match PetDetails interface
      petName: '',
      dobOrAdoptionDate: '',
      weight: '',
      gender: '',
      species: '',
      breed: '',
      spayedNeutered: '',
      vaccinationStatus: '',
      lifestyle: '',
      chronicIllness: '',
      surgeryHistory: '',
      recurringConditions: '',
      onMedication: '',
      estimatedAge: '',
      otherSpecies: '',
      otherBreed: '',
      microchipNumber: '',
      colorMarkings: '',
      chronicIllnessExplanation: '',
      surgeryHistoryExplanation: '',
      recurringConditionsExplanation: '',
      onMedicationExplanation: '',
      vetName: '',
      vetClinicName: '',
      clinicPhoneNumber: '',
      clinicAddress: '',
      lastVetVisitDate: '',
    },
    product: {
      // Initialize with default values to match ProductDetails interface
      productName: '',
      planType: '',
      coverageAmount: '',
      deductible: '',
      reimbursementRate: '',
      paymentFrequency: '',
      startDate: new Date().toISOString().split('T')[0],
      coverageLength: '1 Year',
      selectedAddOns: [] as SelectedAddOn[], // Correctly initialized as SelectedAddOn[]
      donationPercentage: 0,
    },
    payment: {
      // Initialize with default values to match the explicit PaymentDetails interface
      paymentMethod: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      gcashNumber: '',
      gcashName: '',
    },
  });

  const updateFormData = <T extends keyof ApplicationFormData>(field: T, data: Partial<ApplicationFormData[T]>) => {
    setFormData((prevData: ApplicationFormData) => ({
      ...prevData,
      [field]: { ...prevData[field], ...data },
    }));
  };

  const handleNextStep = () => {
    // Attempt to validate the current step using the ref
    if (stepRef.current && !stepRef.current.validate()) {
      setModalTitle('Validation Error');
      setModalMessage('Please correct the errors in the current step before proceeding.');
      setModalType('error');
      setShowModal(true);
      return; // Prevent progression if validation fails
    }

    if (currentStep === applicationSteps.length) {
      handleSubmit();
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  // Centralized final validation before submission
  const validateAllFormData = (): boolean => {
    const errors: string[] = [];

    // Client Details validation
    if (!formData.client.title) errors.push('Client Title is required.');
    if (!formData.client.firstName) errors.push('Client First Name is required.');
    if (!formData.client.lastName) errors.push('Client Last Name is required.');
    if (!formData.client.email || !/\S+@\S+\.\S+/.test(formData.client.email)) errors.push('Valid Client Email is required.');
    if (!formData.client.phoneNumber) errors.push('Client Phone Number is required.'); // Now required
    if (!formData.client.dob) errors.push('Client Date of Birth is required.');
    if (!formData.client.pob) errors.push('Client Place of Birth is required.');
    if (!formData.client.gender) errors.push('Client Gender is required.');
    if (!formData.client.streetAddress) errors.push('Client Street Address is required.');
    if (!formData.client.declarationAccuracy) errors.push('Declaration Accuracy must be confirmed.');


    // Pet Details validation
    if (!formData.pet.petName) errors.push('Pet Name is required.');
    if (!formData.pet.weight) errors.push('Pet Weight is required.');
    if (!formData.pet.estimatedAge) errors.push('Pet Estimated Age is required.');
    if (!formData.pet.gender) errors.push('Pet Gender is required.');
    if (!formData.pet.species) errors.push('Pet Species is required.');
    if (formData.pet.species === 'Other' && !formData.pet.otherSpecies) errors.push('Please specify other species.');
    if (!formData.pet.breed) errors.push('Pet Breed is required.');
    if ((formData.pet.breed === 'Other' || formData.pet.breed === 'Mixed Breed') && !formData.pet.otherBreed) errors.push('Please specify other breed details.');
    if (!formData.pet.colorMarkings) errors.push('Pet Color/Markings are required.');
    if (!formData.pet.spayedNeutered) errors.push('Pet Spayed/Neutered status is required.');
    if (!formData.pet.vaccinationStatus) errors.push('Pet Vaccination Status is required.');
    if (!formData.pet.lifestyle) errors.push('Pet Lifestyle is required.');
    if (formData.pet.chronicIllness === 'Yes' && !formData.pet.chronicIllnessExplanation) errors.push('Explanation for Pet Chronic Illness is required.');
    if (formData.pet.surgeryHistory === 'Yes' && !formData.pet.surgeryHistoryExplanation) errors.push('Explanation for Pet Surgery History is required.');
    if (formData.pet.recurringConditions === 'Yes' && !formData.pet.recurringConditionsExplanation) errors.push('Explanation for Pet Recurring Conditions is required.');
    if (formData.pet.onMedication === 'Yes' && !formData.pet.onMedicationExplanation) errors.push('Explanation for Pet On Medication is required.');
    if (!formData.pet.vetName) errors.push('Veterinarian\'s Name is required.');
    if (!formData.pet.vetClinicName) errors.push('Veterinary Clinic Name is required.');
    if (!formData.pet.clinicPhoneNumber) errors.push('Clinic Phone Number is required.');
    if (!formData.pet.clinicAddress) errors.push('Clinic Address is required.');


    // Product Details validation
    if (!formData.product.productName) errors.push('Product Name is required.');
    if (!formData.product.planType) errors.push('Plan Type is required.');
    if (!formData.product.coverageAmount) errors.push('Coverage Amount is required.');
    if (!formData.product.deductible) errors.push('Deductible is required.');
    if (!formData.product.reimbursementRate) errors.push('Reimbursement Rate is required.');
    if (!formData.product.paymentFrequency) errors.push('Payment Frequency is required.');
    if (!formData.product.startDate) errors.push('Product Start Date is required.');
    if (!formData.product.coverageLength) errors.push('Coverage Length is required.');

    // Payment Details validation
    if (!formData.payment.paymentMethod) errors.push('Payment Method is required.');
    if (formData.payment.paymentMethod === 'Credit/Debit Card') {
      if (!formData.payment.cardNumber) errors.push('Card Number is required for Credit/Debit Card.');
      if (!formData.payment.cardName) errors.push('Card Name is required for Credit/Debit Card.');
      if (!formData.payment.expiryDate) errors.push('Expiry Date is required for Credit/Debit Card.');
      if (!formData.payment.cvv) errors.push('CVV is required for Credit/Debit Card.');
    } else if (formData.payment.paymentMethod === 'Bank Transfer') {
      if (!formData.payment.bankName) errors.push('Bank Name is required for Bank Transfer.');
      if (!formData.payment.accountNumber) errors.push('Account Number is required for Bank Transfer.');
      if (!formData.payment.accountName) errors.push('Account Name is required for Bank Transfer.');
    } else if (formData.payment.paymentMethod === 'GCash') {
      if (!formData.payment.gcashNumber) errors.push('GCash Number is required for GCash.');
      if (!formData.payment.gcashName) errors.push('GCash Name is required for GCash.');
    }

    if (errors.length > 0) {
      setModalTitle('Submission Failed: Missing Information');
      setModalMessage(`Please complete all required fields:\n- ${errors.join('\n- ')}`);
      setModalType('error');
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('Final Form Submission Attempt:', formData);

    // Perform final comprehensive validation
    if (!validateAllFormData()) {
      // Errors will be shown via MessageModal by validateAllFormData
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize deductible to remove currency symbols and commas before sending
      const sanitizedProduct = {
        ...formData.product,
        deductible: formData.product.deductible.replace(/[^0-9.-]+/g, ''),
      };

      const applicationData = {
        client: formData.client,
        pet: formData.pet,
        product: sanitizedProduct,
        payment: formData.payment,
      };

      const response = await createApplication(applicationData);

      // After successful creation, update status to SUBMITTED
      if (response.data && response.data.id) {
        const statusUpdate = { updateData: { status: 'SUBMITTED' } };
        await updateApplication(response.data.id, statusUpdate);
      } else {
        throw new Error('Application ID not returned from creation.');
      }

      setModalTitle('Application Submitted!');
      setModalMessage('Your application has been submitted successfully.');
      setModalType('success');
      setShowModal(true);
      // router.push('/advisor/dashboard'); // Will navigate after modal close
    } catch(error){
      console.error('Error submitting application:', error);
      setModalTitle('Submission Failed');
      setModalMessage(`Submission failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
      setModalType('error');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientDetailsStep
            ref={stepRef} // Attach ref to get validation function
            formData={formData.client}
            onUpdate={(data) => updateFormData('client', data)}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <PetDetailsStep
            ref={stepRef}
            formData={formData.pet}
            onUpdate={(data) => updateFormData('pet', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <ProductDetailsStep
            ref={stepRef}
            formData={formData.product}
            onUpdate={(data) => updateFormData('product', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <PaymentDetailsStep
            ref={stepRef} // Add ref prop
            formData={formData.payment}
            productDetails={formData.product}
            onUpdate={(data) => updateFormData('payment', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 5:
        return (
          <SummaryDetailsStep
            ref={stepRef} // Add ref prop
            formData={formData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 6:
        return (
          <SubmitStep
            ref={stepRef} // Add ref prop
            formData={formData}
            onPrev={handlePrevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <div className="p-4 text-center text-red-500">Error: Invalid step.</div>;
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalType === 'success') {
      router.push('/advisor/dashboard'); // Navigate only after successful submission and modal close
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ApplicationStepNavbar currentStepId={currentStep} steps={applicationSteps} />
      <div className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl w-full mx-auto flex flex-col min-h-[calc(100vh-160px)]">
          {isSubmitting ? (
            <div className="flex items-center justify-center h-full text-lg text-[#8cc63f]">
              <p>Submitting your application, please wait...</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>
      </div>

      {showModal && (
        <MessageModal
          message={modalMessage}
          type={modalType}
          onClose={handleModalClose}
          title={modalTitle}
        />
      )}
    </div>
  );
};

export default NewApplicationForm;