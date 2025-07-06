'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ClaimFormData } from '@/types/formData'; // Import the full ClaimFormData type

interface SubmitStepProps {
  formData: ClaimFormData; // Now expects the full ClaimFormData
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SubmitStep: React.FC<SubmitStepProps> = ({ formData, onPrev, onSubmit, isSubmitting }) => {
  // Destructure relevant data for display or final checks
  // It's good to destructure here to ensure all expected sub-objects are present.
  // If any sub-object might be undefined, consider optional chaining (e.g., client?.firstName)
  const {
    policyNumber,
    client,
    petDetails,
    incidentDetails,
    veterinaryClinicTreatmentDetails, // Not directly used in summary, but available
    financialReimbursementDetails,
    declarationsAuthorization
  } = formData;

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Review & Submit Claim</h2>
        <p className="mb-4 text-gray-700">
          Please review your claim details one last time. Once you click &quot;Submit Claim&quot;, your claim will be sent for processing.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-6 rounded-md" role="alert">
          <p className="font-bold">Important!</p>
          <p className="text-sm">By submitting this claim, you confirm that all information provided is accurate and that you agree to the declarations and authorizations.</p>
        </div>

        {/* Display a summary of key details for final confirmation */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-3 text-gray-800">Claim Summary</h3>
          <p className="text-sm text-gray-700">
            <strong>Policy Number:</strong> {policyNumber || 'N/A'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Client:</strong> {client?.firstName} {client?.lastName} ({client?.email})
          </p>
          <p className="text-sm text-gray-700">
            <strong>Pet:</strong> {petDetails?.petName} ({petDetails?.species}, {petDetails?.breed})
          </p>
          <p className="text-sm text-gray-700">
            <strong>Incident Date:</strong> {incidentDetails?.incidentOrSymptomDate || 'N/A'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Total Vet Bill:</strong> ${financialReimbursementDetails?.totalVetBillAmount || '0.00'}
          </p>
          <hr className="my-3 border-gray-300"/>
          <h4 className="font-semibold text-gray-800 mb-2">Your Declarations</h4>
          <p className="text-sm text-gray-700">
            <strong>Declaration of Truthfulness:</strong> {declarationsAuthorization?.declarationTruthfulnessAccepted ? 'Accepted' : 'NOT Accepted'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Medical Records Authorization:</strong> {declarationsAuthorization?.medicalRecordsAuthorizationAccepted ? 'Accepted' : 'NOT Accepted'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Data Privacy Consent:</strong> {declarationsAuthorization?.dataPrivacyConsentAccepted ? 'Accepted' : 'NOT Accepted'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Signed By:</strong> {declarationsAuthorization?.policyholderSignatureName || 'N/A'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Date Signed:</strong> {declarationsAuthorization?.signatureDate || 'N/A'}
          </p>
        </div>

      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Claim'}
        </Button>
      </div>
    </div>
  );
};

export default SubmitStep;