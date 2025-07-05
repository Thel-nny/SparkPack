// sparkpack/src/components/advisor/applications/NewApplicationForm.tsx
"use client";

import React, { useState } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';
import ProductDetailsStep from './form-steps/ProductDetailsStep'; // Import the new step
import { ApplicationFormData, ClientDetails, PetDetails, ProductDetails } from '@/types/formData'; // Import all interfaces

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
    // Initialize product details
    product: {
      productName: '',
      coverageType: '',
      coverageAmount: '',
      deductible: '',
      reimbursementRate: '',
      paymentFrequency: '',
      startDate: '',
      coverageLength: '', // Initialize new field
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
      console.log("Pet Details submitted (check console). Proceeding to Product Details.", formData.pet);
    } else if (currentStep === 3) {
      console.log("Product Details submitted (check console). This is the end of the form for now!");
      // In a real app, you might trigger the final submission here or move to a summary step
      alert("Product Details submitted (check console). This is the end of the form for now!");
    }

    // Only proceed if not on the last step (which is now 3)
    if (currentStep < 3) { // Changed from 2 to 3
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  // The handleSubmit function would typically be called on the final step's "Next" or a dedicated "Submit" button
  const handleSubmit = () => {
    console.log('Final Form Submission:', formData);
    alert('Form Submitted! Check console for data.');
    // In a real application, you would send this formData to your API
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
      case 3: // New case for Product Details
        return (
          <ProductDetailsStep
            formData={formData.product}
            onUpdate={(data) => updateFormData('product', data)}
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
      {/* Application Step Navbar is always visible at the top */}
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
