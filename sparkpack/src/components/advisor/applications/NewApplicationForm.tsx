"use client";

import React, { useState } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';
import ProductDetailsStep from './form-steps/ProductDetailsStep';
import PaymentDetailsStep from './form-steps/PaymentDetailsStep';
import SummaryDetailsStep from './form-steps/SummaryDetailsStep'; 
import SubmitStep from './form-steps/SubmitStep';
import { ApplicationFormData } from '@/types/formData';
import { createApplication, updateApplication } from '@/lib/api/applications';
import { useRouter } from 'next/navigation';

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
  const router = useRouter(); // Initialize useRouter

  const [formData, setFormData] = useState<ApplicationFormData>({
    client: {
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      pob: '',
      gender: '',
      allowPhoneCollection: true,
      phoneNumber: '',
      email: '',
      streetAddress: '',
      country: 'Philippines',
      city: 'Iloilo City',
      province: 'Iloilo',
      postalCode: '5000',
      declarationAccuracy: false,
    },
    pet: {
      petName: '',
      dobOrAdoptionDate: '',
      weight: '',
      estimatedAge: '',
      gender: '',
      species: '',
      otherSpecies: '',
      breed: '',
      otherBreed: '',
      microchipNumber: '',
      colorMarkings: '',
      spayedNeutered: '',
      vaccinationStatus: '',
      lifestyle: '',
      chronicIllness: '',
      chronicIllnessExplanation: '',
      surgeryHistory: '',
      surgeryHistoryExplanation: '',
      recurringConditions: '',
      recurringConditionsExplanation: '',
      onMedication: '',
      onMedicationExplanation: '',
      vetName: '',
      vetClinicName: '',
      clinicPhoneNumber: '',
      clinicAddress: '',
      lastVetVisitDate: '',
    },
    product: {
      productName: '',
      planType: '', // Added planType field for validation
      coverageAmount: '',
      deductible: '',
      reimbursementRate: '',
      paymentFrequency: '',
      startDate: new Date().toISOString().split('T')[0],
      coverageLength: '1 Year',
      selectedAddOns: [],
      donationPercentage: 0
    },
    payment: {
      paymentMethod: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const updateFormData = <T extends keyof ApplicationFormData>(field: T, data: Partial<ApplicationFormData[T]>) => {
    setFormData((prevData: ApplicationFormData) => ({
      ...prevData,
      [field]: { ...prevData[field], ...data },
    }));
  };

  const handleNextStep = () => {
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

  const handleSubmit = async () => {
    console.log('Final Form Submission Attempt:', formData);

    // Frontend validation for required product fields
    if (!formData.product.productName) {
      alert('Product Name is required.');
      return;
    }
    if (!formData.product.planType) {
      alert('Plan Type is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API

      // Sanitize deductible to remove currency symbols and commas before sending
      const sanitizedProduct = {
        ...formData.product,
        deductible: formData.product.deductible.replace(/[^0-9.-]+/g, ''),
      };

      const applicationData = {
        client: formData.client,
        pet: formData.pet,
        product: sanitizedProduct,
        payment: formData.payment, // Include payment details in submission
      };

      // Call backend API to create application
      const response = await createApplication(applicationData); // Ensure createApplication expects this structure

      // After successful creation, update status to SUBMITTED
      // Assuming response.data.id is available and your API supports status updates
      const status = {updateData: { status: 'SUBMITTED' }};
      await updateApplication(response.data.id, status);

      alert('Application submitted successfully!');
      await router.push('/advisor/dashboard'); // Await redirect to advisor dashboard after successful submission
    } catch(error){
      console.error('Error submitting application:', error);
      alert(`Submission failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientDetailsStep
            formData={formData.client}
            onUpdate={(data) => updateFormData('client', data)}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <PetDetailsStep
            formData={formData.pet}
            onUpdate={(data) => updateFormData('pet', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <ProductDetailsStep
            formData={formData.product}
            onUpdate={(data) => updateFormData('product', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <PaymentDetailsStep
            formData={formData.payment}
            productDetails={formData.product}
            onUpdate={(data) => updateFormData('payment', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 5: // This is now the Summary Step
        return (
          <SummaryDetailsStep
            formData={formData} // Pass the entire formData for summary
            onNext={handleNextStep} // This will lead to the final "Sign & Submit"
            onPrev={handlePrevStep}
          />
        );
      case 6: // This is now the Sign & Submit Step (final step)
        return (
          <SubmitStep
            formData={formData}
            onPrev={handlePrevStep}
            onSubmit={handleSubmit} // Pass the main handleSubmit function
            isSubmitting={isSubmitting} // Pass the submitting state
          />
        );
      default:
        return <div className="p-4 text-center text-red-500">Error: Invalid step.</div>;
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
    </div>
  );
};

export default NewApplicationForm;
