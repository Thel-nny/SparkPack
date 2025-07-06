'use client';

import React, { useState } from 'react';
import ClientDetailsStep from './form-steps/ClientDetailsStep';
import PetDetailsStep from './form-steps/PetDetailsStep';
import IncidentDetailsStep from './form-steps/IncidentDetailsStep';
import VeterinaryClinicTreatmentStep from './form-steps/VeterinaryClinicTreatmentStep';
import FinancialReimbursementStep from './form-steps/FinancialReimbursementStep';
import DeclarationsAuthorizationStep from './form-steps/DeclarationsAuthorizationStep';
import SubmitStep from './form-steps/SubmitStep';
import { useRouter } from 'next/navigation';
import ClaimStepNavbar from './ClaimStepNavbar';

// Import all necessary types from your formData.ts
import {
  ClaimFormData,
  ClientDetails,
  PetDetails,
  IncidentDetails,
  VeterinaryClinicTreatmentDetails,
  FinancialReimbursementDetails,
  DeclarationsAuthorizationDetails
} from '@/types/formData';

// Corrected step names for brevity in the navbar
const claimSteps = [
  { id: 1, name: 'Client' },
  { id: 2, name: 'Pet' },
  { id: 3, name: 'Incident' },
  { id: 4, name: 'Vet & Rx' }, // Shorter name
  { id: 5, name: 'Financial' }, // Shorter name
  { id: 6, name: 'Declarations' },
  { id: 7, name: 'Submit' },
];

// --- NEW: Define default empty objects for each nested type ---
// This ensures that the initial state fully conforms to the interface types.
const initialClientDetails: ClientDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  pob: '',
  gender: '',
  phoneNumber: '',
  email: '',
  streetAddress: '',
  country: '',
  city: '',
  province: '',
  postalCode: '',
  declarationAccuracy: false,
};

const initialPetDetails: PetDetails = {
  petName: '',
  dobOrAdoptionDate: '',
  estimatedAge: '',
  weight: '',
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
  vetName: '',
  vetClinicName: '',
  clinicPhoneNumber: '',
  clinicAddress: '',
  lastVetVisitDate: '',
  chronicIllness: '',
  chronicIllnessExplanation: '',
  surgeryHistory: '',
  surgeryHistoryExplanation: '',
  recurringConditions: '',
  recurringConditionsExplanation: '',
  onMedication: '',
  onMedicationExplanation: '',
};

const initialIncidentDetails: IncidentDetails = {
  incidentOrSymptomDate: '',
  vetVisitDate: '',
  incidentType: '', // This '' is now explicitly part of the union in formData.ts
  accidentDescription: '',
  accidentLocation: '',
  accidentWitnesses: '',
  symptomsDescription: '',
  symptomsFirstAppearance: '',
  symptomsDuration: '',
  affectedBodyPart: '',
  previousRelatedConditions: '',
  previousConditionDetails: '',
  reasonForClaim: '',
};

const initialVeterinaryClinicTreatmentDetails: VeterinaryClinicTreatmentDetails = {
  clinicName: '',
  clinicAddress: '',
  clinicPhoneNumber: '',
  attendingVetName: '',
  treatmentDates: '',
  diagnosis: '',
  prognosis: '',
  treatmentProvided: '',
  isEmergency: '', // This '' is now explicitly part of the union in formData.ts
};

const initialFinancialReimbursementDetails: FinancialReimbursementDetails = {
  totalVetBillAmount: '',
  itemizedBillAttached: '', // '' is part of the union
  officialReceiptsAttached: '', // '' is part of the union
  reimbursementMethod: '', // '' is part of the union
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  gcashNumber: '',
  gcashName: '',
  reimbursementDescription: '',
  preferredContactForUpdates: '', // '' is part of the union
};

const initialDeclarationsAuthorizationDetails: DeclarationsAuthorizationDetails = {
  declarationTruthfulnessAccepted: false,
  medicalRecordsAuthorizationAccepted: false,
  dataPrivacyConsentAccepted: false,
  policyholderSignatureName: '',
  signatureDate: '',
};
// --- END NEW ---

const ClientSubmitClaimForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize with the correct ClaimFormData structure using the new default objects
  const [formData, setFormData] = useState<ClaimFormData>({
    policyNumber: '',
    client: initialClientDetails,
    petDetails: initialPetDetails,
    incidentDetails: initialIncidentDetails,
    veterinaryClinicTreatmentDetails: initialVeterinaryClinicTreatmentDetails,
    financialReimbursementDetails: initialFinancialReimbursementDetails,
    declarationsAuthorization: initialDeclarationsAuthorizationDetails,
  });

  const updateFormData = <K extends keyof ClaimFormData>(field: K, data: Partial<ClaimFormData[K]>) => {
    // This type assertion is still useful for the `...prev[field]` spread,
    // as it confirms that `prev[field]` will be an object.
    setFormData((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as object), ...data } as ClaimFormData[K],
    }));
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === claimSteps.length) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Client Details
        if (!formData.client.firstName || !formData.client.lastName || !formData.client.email) {
          alert('Please fill in all required Client Details.');
          return false;
        }
        break;
      case 2: // Pet Details
        if (!formData.petDetails.petName || !formData.petDetails.species || !formData.petDetails.dobOrAdoptionDate) {
          alert('Please fill in all required Pet Details.');
          return false;
        }
        break;
      case 3: // Incident Details
        if (!formData.incidentDetails.incidentOrSymptomDate || !formData.incidentDetails.incidentType) {
          alert('Please fill in all required Incident Details.');
          return false;
        }
        break;
      case 4: // Veterinary Clinic & Treatment
        if (!formData.veterinaryClinicTreatmentDetails.clinicName || !formData.veterinaryClinicTreatmentDetails.diagnosis) {
          alert('Please fill in all required Veterinary Clinic & Treatment Details.');
          return false;
        }
        break;
      case 5: // Financial Reimbursement
        if (!formData.financialReimbursementDetails.totalVetBillAmount || !formData.financialReimbursementDetails.reimbursementMethod) {
          alert('Please fill in all required Financial & Reimbursement Details.');
          return false;
        }
        // More detailed conditional validation for financial is handled within the step itself
        break;
      case 6: // Declarations & Authorization
        if (!formData.declarationsAuthorization.declarationTruthfulnessAccepted ||
            !formData.declarationsAuthorization.medicalRecordsAuthorizationAccepted ||
            !formData.declarationsAuthorization.dataPrivacyConsentAccepted ||
            !formData.declarationsAuthorization.policyholderSignatureName) {
          alert('Please accept all declarations and provide your signature.');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting claim:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call delay

      alert('Claim submitted successfully!');
      router.push('/client/claims');
    } catch (error: any) {
      alert(`Submission failed: ${error.message || 'Unknown error'}`);
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
            onPrev={handlePrevStep}
          />
        );
      case 2:
        return (
          <PetDetailsStep
            formData={formData.petDetails}
            onUpdate={(data) => updateFormData('petDetails', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <IncidentDetailsStep
            formData={formData.incidentDetails}
            onUpdate={(data) => updateFormData('incidentDetails', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <VeterinaryClinicTreatmentStep
            formData={formData.veterinaryClinicTreatmentDetails}
            onUpdate={(data) => updateFormData('veterinaryClinicTreatmentDetails', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 5:
        return (
          <FinancialReimbursementStep
            formData={formData.financialReimbursementDetails}
            onUpdate={(data) => updateFormData('financialReimbursementDetails', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 6:
        return (
          <DeclarationsAuthorizationStep
            formData={formData.declarationsAuthorization}
            onUpdate={(data) => updateFormData('declarationsAuthorization', data)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 7:
        return (
          <SubmitStep
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ClaimStepNavbar currentStepId={currentStep} steps={claimSteps} />
      <div className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl w-full mx-auto flex flex-col min-h-[calc(100vh-160px)]">
          {isSubmitting ? (
            <div className="flex items-center justify-center h-full text-lg text-[#8cc63f]">
              <p>Submitting your claim, please wait...</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSubmitClaimForm;