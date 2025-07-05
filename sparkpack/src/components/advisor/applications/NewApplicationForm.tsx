"use client";

import React, { useState } from 'react';
import ApplicationStepNavbar from './ApplicationStepNavbar';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';
import ProductDetailsStep from './form-steps/ProductDetailsStep'; // Import the new step
import { ApplicationFormData } from '@/types/formData'; // Import all interfaces
import { createApplication, updateApplication } from '@/lib/api/applications';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      // Prepare data for API
      const applicationData = {
        customer: formData.client,
        pet: formData.pet,
        product: formData.product,
        // Map fields as needed to match backend schema
        petId: '', // This should be set after pet creation or selection
        policyNumber: formData.product.productName, // Example mapping
        planType: formData.product.coverageType, // Example mapping
        premiumAmount: parseFloat(formData.product.coverageAmount) || 0,
        deductible: parseFloat(formData.product.deductible) || 0,
        coverageLimit: parseFloat(formData.product.coverageAmount) || 0,
        startDate: formData.product.startDate,
        endDate: '', // Optional
      };

      // Call backend API to create application
      const response = await createApplication(applicationData);

      // After successful creation, update status to SUBMITTED
      await updateApplication(response.data.id, { status: 'SUBMITTED' });

      alert('Application submitted successfully!');
      router.push('/advisor/applications/submitted'); // Redirect to submitted applications page
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
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
