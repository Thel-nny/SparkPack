// sparkpack/src/components/advisor/applications/NewApplicationForm.tsx

"use client";

import React, { useState } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar'; // Corrected import
import ClientDetailsStep from './form-steps/ClientDetailsStep';

interface ClientDetails {
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  pob: string;
  gender: string;
  allowPhoneCollection: boolean;
  phoneNumber?: string;
  email: string;
  streetAddress: string;
  country: string;
  city: string;
  province: string;
  postalCode: string;
  declarationAccuracy: boolean;
}

interface ApplicationFormData {
  client: ClientDetails;
}

const NewApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>({
    client: {
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      pob: '',
      gender: '',
      allowPhoneCollection: false,
      phoneNumber: '',
      email: '',
      streetAddress: '',
      country: 'Philippines',
      city: 'Iloilo City',
      province: 'Iloilo',
      postalCode: '5000',
      declarationAccuracy: false,
    },
  });

  const updateFormData = (field: 'client', data: Partial<ClientDetails>) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: { ...prevData[field], ...data },
    }));
  };

  const handleNextStep = () => {
    console.log("Attempting to proceed from Client Details. Form data:", formData.client);
    alert("Client Details submitted (check console). This is the end of the form for now!");
  };

  const handlePrevStep = () => {
    // Not applicable for the first step alone
  };

  const handleSubmit = () => {
    console.log('Final Form Submission (if applicable):', formData);
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
      default:
        return <div className="p-4 text-center text-red-500">Error: Invalid step. Currently displaying only Client Details.</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      <ApplicationStepNavbar currentStepId={currentStep} />
      <div className="flex-1 py-8 px-4 h-full">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl w-full mx-auto flex flex-col h-full overflow-y-auto">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default NewApplicationForm;