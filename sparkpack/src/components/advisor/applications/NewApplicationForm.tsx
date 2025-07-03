"use client";

import React, { useState } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';

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

interface PetDetails {
  petName: string;
  dobOrAdoptionDate: string;
  estimatedAge: string;
  gender: string;
  species: string;
  otherSpecies?: string;
  breed: string;
  otherBreed?: string;
  microchipNumber?: string;
  colorMarkings: string;
  spayedNeutered: string;
  vaccinationStatus: string;
  lifestyle: string;
  chronicIllness: string;
  chronicIllnessExplanation?: string;
  surgeryHistory: string;
  surgeryHistoryExplanation?: string;
  recurringConditions: string;
  recurringConditionsExplanation?: string;
  onMedication: string;
  onMedicationExplanation?: string;
  vetName: string;
  vetClinicName: string;
  clinicPhoneNumber: string;
  clinicAddress: string;
  lastVetVisitDate: string;
}

// Define the overall ApplicationFormData interface to include both steps
interface ApplicationFormData {
  client: ClientDetails;
  pet: PetDetails; 
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
      breed: '',
      microchipNumber: '',
      colorMarkings: '',
      spayedNeutered: '',
      vaccinationStatus: '',
      lifestyle: '',
      chronicIllness: '',
      surgeryHistory: '',
      recurringConditions: '',
      onMedication: '',
      vetName: '',
      vetClinicName: '',
      clinicPhoneNumber: '',
      clinicAddress: '',
      lastVetVisitDate: '',
    },
  });

  // Generic update function for any form section
  const updateFormData = <T extends keyof ApplicationFormData>(field: T, data: Partial<ApplicationFormData[T]>) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: { ...prevData[field], ...data },
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
        console.log("Client Details submitted (check console). Proceeding to Pet Details.", formData.client);
    } else if (currentStep === 2) {
        console.log("Pet Details submitted (check console). This is the end of the form for now!");
        alert("Pet Details submitted (check console). This is the end of the form for now!");
    }

    if (currentStep < 2) { 
        setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Final Form Submission:', formData);
    alert('Form Submitted! Check console for data.');
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
      default:
        return <div className="p-4 text-center text-red-500">Error: Invalid step.</div>;
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