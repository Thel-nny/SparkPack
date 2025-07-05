// sparkpack/src/components/advisor/applications/NewApplicationForm.tsx
"use client";

import React, { useState } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';
import ProductDetailsStep from './form-steps/ProductDetailsStep';
import PaymentDetailsStep from './form-steps/PaymentDetailsStep';
import { ApplicationFormData } from '@/types/formData';

const applicationSteps = [
  { id: 1, name: 'Client Details' },
  { id: 2, name: 'Pet Details' },
  { id: 3, name: 'Product Details' },
  { id: 4, name: 'Payment Details' },
  { id: 5, name: 'Evidence' },
  { id: 6, name: 'Summary' },
  { id: 7, name: 'Sign & Submit' },
];

const NewApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      // coverageType: '', // This line from your previous paste was the source of the 'coverageType' error. It should not be here if not in ProductDetails type.
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
    setFormData((prevData) => ({
      ...prevData,
      [field]: { ...prevData[field], ...data },
    }));
  };

  const handleNextStep = () => {
    if (currentStep < applicationSteps.length) {
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

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Form Submitted Successfully:', formData);
      alert('Application submitted successfully! Check console for data.');
    } catch (error: any) {
      console.error('Form submission error:', error);
      alert(`Submission failed: ${error.message || 'An unknown error occurred.'}`);
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
      case 5:
      case 6:
      case 7:
        return (
          <div className="p-4 text-center text-blue-600">
            <h3>Step {currentStep}: {applicationSteps.find(s => s.id === currentStep)?.name || 'Unknown Step'}</h3>
            <p>This step is currently under construction. Please use the navigation to go back or forward.</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Previous Step
              </button>
              {currentStep < applicationSteps.length && (
                  <button
                      onClick={handleNextStep}
                      className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
                  >
                      Next Step
                  </button>
              )}
            </div>
          </div>
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