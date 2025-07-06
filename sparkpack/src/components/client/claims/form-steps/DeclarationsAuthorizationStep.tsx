'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Assuming you have this import

// Import the updated DeclarationsAuthorizationDetails interface
import { DeclarationsAuthorizationDetails } from '@/types/formData';

interface DeclarationsAuthorizationStepProps {
  formData: DeclarationsAuthorizationDetails;
  onUpdate: (data: Partial<DeclarationsAuthorizationDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const DeclarationsAuthorizationStep: React.FC<DeclarationsAuthorizationStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  // Initialize local state with existing form data
  const [localFormData, setLocalFormData] = useState<DeclarationsAuthorizationDetails>(formData);

  // --- CHANGE 1: Define errors state with correct type ---
  const [errors, setErrors] = useState<Partial<Record<keyof DeclarationsAuthorizationDetails, string>>>({});
  // --- END CHANGE 1 ---

  // --- CHANGE 2: useEffect to sync formData from parent and set initial signatureDate ---
  useEffect(() => {
    setLocalFormData(formData); // Sync with parent formData

    // Set signature date automatically if not already set
    if (!formData.signatureDate) { // Check parent's formData for initial value
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      setLocalFormData(prev => ({ ...prev, signatureDate: today }));
    }
  }, [formData]); // Depend on formData to re-sync if parent data changes

  // --- CHANGE 3: Simplified handleChange for text inputs ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  // --- END CHANGE 3 ---

  // --- CHANGE 4: Dedicated handleCheckboxChange for Checkbox component ---
  const handleCheckboxChange = (id: keyof DeclarationsAuthorizationDetails, checked: boolean) => {
    setLocalFormData(prev => ({
      ...prev,
      [id]: checked,
    }));
  };
  // --- END CHANGE 4 ---

  // --- CHANGE 5: Implement detailed validation function ---
  const validate = () => {
    const newErrors: Partial<Record<keyof DeclarationsAuthorizationDetails, string>> = {};

    if (!localFormData.declarationTruthfulnessAccepted) {
      newErrors.declarationTruthfulnessAccepted = 'You must accept the declaration of truthfulness.';
    }
    if (!localFormData.medicalRecordsAuthorizationAccepted) {
      newErrors.medicalRecordsAuthorizationAccepted = 'You must authorize the release of medical records.';
    }
    if (!localFormData.dataPrivacyConsentAccepted) {
      newErrors.dataPrivacyConsentAccepted = 'You must consent to data privacy.';
    }
    if (!localFormData.policyholderSignatureName.trim()) {
      newErrors.policyholderSignatureName = 'Policyholder\'s full name (signature) is required.';
    }
    if (!localFormData.signatureDate) { // Although auto-filled, it's good to validate it exists
      newErrors.signatureDate = 'Signature date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // --- END CHANGE 5 ---

  const handleNextClick = () => {
    // --- CHANGE 6: Use validate function ---
    if (validate()) {
      onUpdate(localFormData);
      onNext();
    } else {
      alert('Please accept all declarations and provide your signature to proceed.');
    }
    // --- END CHANGE 6 ---
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Declarations & Authorization</h2>
        <p className="mb-4 text-gray-700">
          To finalize your claim submission, please carefully review and accept the following statements.
        </p>

        {/* Declaration of Truthfulness */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
          <div className="flex items-center mb-2">
            <Checkbox
              id="declarationTruthfulnessAccepted"
              name="declarationTruthfulnessAccepted"
              checked={localFormData.declarationTruthfulnessAccepted}
              onCheckedChange={(checked) => handleCheckboxChange('declarationTruthfulnessAccepted', checked as boolean)}
              className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300 rounded"
            />
            <label htmlFor="declarationTruthfulnessAccepted" className="ml-2 block text-base font-medium text-gray-900">
              {/* --- FIX 7: Wrap label content in a fragment --- */}
              <>Declaration of Truthfulness <span className="text-red-500">*</span></>
            </label>
          </div>
          <p className="text-sm text-gray-600 pl-6">
            I declare that all information provided in this claim form, including any attachments or supplementary documents, is accurate, complete, and truthful to the best of my knowledge and belief. I understand that providing false or misleading information may result in the denial of this claim, termination of my policy, and/or legal action.
          </p>
          {errors.declarationTruthfulnessAccepted && <p className="text-red-500 text-xs mt-1 pl-6">{errors.declarationTruthfulnessAccepted}</p>}
        </div>

        {/* Authorization for Release of Medical Records */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
          <div className="flex items-center mb-2">
            <Checkbox
              id="medicalRecordsAuthorizationAccepted"
              name="medicalRecordsAuthorizationAccepted"
              checked={localFormData.medicalRecordsAuthorizationAccepted}
              onCheckedChange={(checked) => handleCheckboxChange('medicalRecordsAuthorizationAccepted', checked as boolean)}
              className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300 rounded"
            />
            <label htmlFor="medicalRecordsAuthorizationAccepted" className="ml-2 block text-base font-medium text-gray-900">
              {/* --- FIX 8: Wrap label content in a fragment --- */}
              <>Authorization for Release of Medical Records <span className="text-red-500">*</span></>
            </label>
          </div>
          <p className="text-sm text-gray-600 pl-6">
            I hereby authorize [Your Company Name] to obtain and review my pet&apos;s full medical history from any veterinary clinic(s) or provider(s) relevant to this claim. This includes, but is not limited to, veterinary records, diagnoses, treatment plans, invoices, and any other information necessary for the accurate assessment and processing of this claim.
          </p>
          {errors.medicalRecordsAuthorizationAccepted && <p className="text-red-500 text-xs mt-1 pl-6">{errors.medicalRecordsAuthorizationAccepted}</p>}
        </div>

        {/* Consent to Data Privacy (Data Privacy Act of 2012, Philippines) */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
          <div className="flex items-center mb-2">
            <Checkbox
              id="dataPrivacyConsentAccepted"
              name="dataPrivacyConsentAccepted"
              checked={localFormData.dataPrivacyConsentAccepted}
              onCheckedChange={(checked) => handleCheckboxChange('dataPrivacyConsentAccepted', checked as boolean)}
              className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300 rounded"
            />
            <label htmlFor="dataPrivacyConsentAccepted" className="ml-2 block text-base font-medium text-gray-900">
              {/* --- FIX 9: Wrap label content in a fragment --- */}
              <>Consent to Data Privacy (Philippines Data Privacy Act of 2012) <span className="text-red-500">*</span></>
            </label>
          </div>
          <p className="text-sm text-gray-600 pl-6">
            I understand and consent to the collection, processing, and storage of my personal data and my pet&apos;s data by [Your Company Name] in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines. This data will be used solely for the purpose of processing and managing my insurance policy and claim, and will be protected with appropriate security measures. I affirm that I have read and understood [Your Company Name]&apos;s Privacy Policy.
          </p>
          {errors.dataPrivacyConsentAccepted && <p className="text-red-500 text-xs mt-1 pl-6">{errors.dataPrivacyConsentAccepted}</p>}
        </div>

        {/* Signature of Policyholder */}
        <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-sm">
          <Label htmlFor="policyholderSignatureName" className="block text-sm font-medium text-gray-700 mb-1">
            {/* --- FIX 10: Wrap label content in a fragment --- */}
            <>Policyholder&apos;s Full Name (Digital Signature) <span className="text-red-500">*</span></>
          </Label>
          <Input
            id="policyholderSignatureName"
            name="policyholderSignatureName"
            type="text"
            value={localFormData.policyholderSignatureName}
            onChange={handleChange}
            placeholder="Type your full name here"
            required
            className="shadow-sm"
          />
          {errors.policyholderSignatureName && <p className="text-red-500 text-xs mt-1">{errors.policyholderSignatureName}</p>}

          <Label htmlFor="signatureDate" className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            Date of Signature
          </Label>
          <Input
            id="signatureDate"
            name="signatureDate"
            type="date"
            value={localFormData.signatureDate}
            readOnly // Make it read-only as it's auto-filled
            className="shadow-sm bg-gray-100 cursor-not-allowed"
          />
          {errors.signatureDate && <p className="text-red-500 text-xs mt-1">{errors.signatureDate}</p>}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          Back
        </Button>
        <Button className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded" onClick={handleNextClick}>
          Next: Sign & Submit
        </Button>
      </div>
    </div>
  );
};

export default DeclarationsAuthorizationStep;