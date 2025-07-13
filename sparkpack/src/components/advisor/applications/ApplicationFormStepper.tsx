"use client";

import React, { useState, useRef } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';
import ProductDetailsStep from './form-steps/ProductDetailsStep';
import PaymentDetailsStep from './form-steps/PaymentDetailsStep';
import SummaryDetailsStep from './form-steps/SummaryDetailsStep';
import SubmitStep from './form-steps/SubmitStep';
import { ApplicationFormData } from '@/types/applicationFormData';

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

interface ApplicationFormStepperProps {
  formData: ApplicationFormData;
  onUpdate: <T extends keyof ApplicationFormData>(field: T, data: Partial<ApplicationFormData[T]>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  openModal: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

const ApplicationFormStepper: React.FC<ApplicationFormStepperProps> = ({
  formData,
  onUpdate,
  onSubmit,
  isSubmitting,
  openModal,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const stepRef = useRef<StepValidationRef | null>(null);

  const handleNextStep = () => {
    if (stepRef.current && !stepRef.current.validate()) {
      openModal('Validation Error', 'Please correct the errors in the current step before proceeding.', 'error');
      return;
    }

    if (currentStep === applicationSteps.length) {
      onSubmit();
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const renderStepContent = () => {
    const petAge = parseInt(formData.pet.estimatedAge || '0', 10);
    const petBreed = formData.pet.breed;
    const hasPreExistingConditions =
      formData.pet.chronicIllness === 'Yes' ||
      formData.pet.surgeryHistory === 'Yes' ||
      formData.pet.recurringConditions === 'Yes' ||
      formData.pet.onMedication === 'Yes';

    switch (currentStep) {
      case 1:
        return (
          <ClientDetailsStep
            ref={stepRef}
            formData={formData.client}
            onUpdate={(data) => onUpdate('client', data)}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <PetDetailsStep
            ref={stepRef}
            formData={formData.pet}
            onUpdate={(data) => onUpdate('pet', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <ProductDetailsStep
            ref={stepRef}
            formData={formData.product}
            onUpdate={(data) => onUpdate('product', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            petAge={petAge}
            petBreed={petBreed}
            hasPreExistingConditions={hasPreExistingConditions}
          />
        );
      case 4:
        return (
          <PaymentDetailsStep
            ref={stepRef}
            formData={formData.payment}
            productDetails={formData.product}
            onUpdate={(data) => onUpdate('payment', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 5:
        return (
          <SummaryDetailsStep
            ref={stepRef}
            formData={formData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 6:
        return (
          <SubmitStep
            ref={stepRef}
            formData={formData}
            onPrev={handlePrevStep}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
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

export default ApplicationFormStepper;
