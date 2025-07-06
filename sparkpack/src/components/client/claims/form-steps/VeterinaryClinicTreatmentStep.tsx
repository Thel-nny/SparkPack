'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Ensure this interface matches your shared types/formData.ts
interface VeterinaryClinicTreatmentDetails {
  clinicName: string;
  clinicAddress: string;
  clinicPhoneNumber: string;
  attendingVetName: string;
  treatmentDates: string; // Could be a comma-separated string or an array of dates
  diagnosis: string;
  treatmentProvided: string;
  prognosis?: string; // Marked as optional based on your form (Optional)
  isEmergency: 'Yes' | 'No' | ''; // Correct type for radio buttons
}

interface VeterinaryClinicTreatmentStepProps {
  formData: VeterinaryClinicTreatmentDetails;
  onUpdate: (data: Partial<VeterinaryClinicTreatmentDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const VeterinaryClinicTreatmentStep: React.FC<VeterinaryClinicTreatmentStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  const [localFormData, setLocalFormData] = useState<VeterinaryClinicTreatmentDetails>(formData);

  const [errors, setErrors] = useState<Partial<Record<keyof VeterinaryClinicTreatmentDetails, string>>>({});

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean; // Keep type broad for initial assignment

    // --- FIX APPLIED HERE ---
    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === 'radio') {
        // For radio buttons, we want the 'value' attribute (e.g., "Yes", "No")
        newValue = value;
      } else if (e.target.type === 'checkbox') {
        // For checkboxes, we want the boolean 'checked' status
        newValue = e.target.checked;
      } else {
        // For other input types (text, date), just use the value
        newValue = value;
      }
    } else {
      // For select or textarea elements, just use the value
      newValue = value;
    }
    // --- END FIX ---

    setLocalFormData((prev) => ({
      ...prev,
      [name]: newValue as any, // 'as any' can be used here for flexibility, but with proper type handling in 'newValue', it's less critical. The important part is that 'newValue' will now be a string for radio buttons.
    }));
  };

  const validate = () => {
    let newErrors: Partial<Record<keyof VeterinaryClinicTreatmentDetails, string>> = {};

    if (!localFormData.clinicName) {
      newErrors.clinicName = 'Clinic Name is required.';
    }
    if (!localFormData.clinicAddress) {
      newErrors.clinicAddress = 'Clinic Address is required.';
    }
    if (!localFormData.clinicPhoneNumber) {
      newErrors.clinicPhoneNumber = 'Clinic Phone Number is required.';
    }
    if (!localFormData.attendingVetName) {
      newErrors.attendingVetName = 'Attending Veterinarian\'s Name is required.';
    }
    if (!localFormData.treatmentDates) {
      newErrors.treatmentDates = 'Date(s) of Treatment are required.';
    }
    if (!localFormData.diagnosis) {
      newErrors.diagnosis = 'Diagnosis is required.';
    }
    if (!localFormData.treatmentProvided) {
      newErrors.treatmentProvided = 'Treatment Provided is required.';
    }
    // This correctly validates if 'isEmergency' is still the initial empty string
    if (!localFormData.isEmergency) {
      newErrors.isEmergency = 'Please indicate if this was an emergency.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validate()) {
      onUpdate(localFormData);
      onNext();
    } else {
      alert('Please fill in all mandatory fields and correct any errors.');
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Veterinary Clinic & Treatment Details</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNextClick();
          }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-[#8cc63f]">Veterinary Clinic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              <div>
                <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
                  <>Clinic Name <span className="text-red-500">*</span></>
                </label>
                <Input
                  id="clinicName"
                  name="clinicName"
                  type="text"
                  value={localFormData.clinicName}
                  onChange={handleChange}
                  required
                />
                {errors.clinicName && <p className="text-red-500 text-xs mt-1">{errors.clinicName}</p>}
              </div>
              <div>
                <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  <>Clinic Address <span className="text-red-500">*</span></>
                </label>
                <Input
                  id="clinicAddress"
                  name="clinicAddress"
                  type="text"
                  value={localFormData.clinicAddress}
                  onChange={handleChange}
                  required
                />
                {errors.clinicAddress && <p className="text-red-500 text-xs mt-1">{errors.clinicAddress}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              <div>
                <label htmlFor="clinicPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  <>Clinic Phone Number <span className="text-red-500">*</span></>
                </label>
                <Input
                  id="clinicPhoneNumber"
                  name="clinicPhoneNumber"
                  type="tel"
                  value={localFormData.clinicPhoneNumber}
                  onChange={handleChange}
                  required
                />
                {errors.clinicPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.clinicPhoneNumber}</p>}
              </div>
              <div>
                <label htmlFor="attendingVetName" className="block text-sm font-medium text-gray-700 mb-1">
                  <>Attending Veterinarian's Name <span className="text-red-500">*</span></>
                </label>
                <Input
                  id="attendingVetName"
                  name="attendingVetName"
                  type="text"
                  value={localFormData.attendingVetName}
                  onChange={handleChange}
                  required
                />
                {errors.attendingVetName && <p className="text-red-500 text-xs mt-1">{errors.attendingVetName}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="treatmentDates" className="block text-sm font-medium text-gray-700 mb-1">
              <>Date(s) of Treatment <span className="text-red-500">*</span></>
            </label>
            <Input
              id="treatmentDates"
              name="treatmentDates"
              type="text" // Using text for multiple dates, could be comma-separated
              value={localFormData.treatmentDates}
              onChange={handleChange}
              placeholder="e.g., 2024-05-10, 2024-05-15, 2024-05-20"
              required
            />
            {errors.treatmentDates && <p className="text-red-500 text-xs mt-1">{errors.treatmentDates}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Please list all dates related to this specific incident (initial visit, follow-ups).
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-[#8cc63f]">Treatment Description</h3>
            <div className="mb-4">
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                <>Diagnosis <span className="text-red-500">*</span></>
              </label>
              <Textarea
                id="diagnosis"
                name="diagnosis"
                value={localFormData.diagnosis}
                onChange={handleChange}
                rows={2}
                placeholder="e.g., Canine Hip Dysplasia, Gastritis, Allergic Dermatitis"
                required
              />
              {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="treatmentProvided" className="block text-sm font-medium text-gray-700 mb-1">
                <>Treatment Provided <span className="text-red-500">*</span></>
              </label>
              <Textarea
                id="treatmentProvided"
                name="treatmentProvided"
                value={localFormData.treatmentProvided}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., X-rays, pain medication, surgical repair; Anti-vomiting medication, special diet; Allergy injections, topical cream"
                required
              />
              {errors.treatmentProvided && <p className="text-red-500 text-xs mt-1">{errors.treatmentProvided}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="prognosis" className="block text-sm font-medium text-gray-700 mb-1">
                Prognosis (Optional)
              </label>
              <Textarea
                id="prognosis"
                name="prognosis"
                value={localFormData.prognosis || ''}
                onChange={handleChange}
                rows={2}
                placeholder="e.g., Excellent, Good, Fair, Guarded"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <>Was this an emergency? <span className="text-red-500">*</span></>
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  id="isEmergencyYes"
                  name="isEmergency"
                  type="radio"
                  value="Yes"
                  checked={localFormData.isEmergency === 'Yes'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="isEmergencyYes" className="ml-2 block text-sm text-gray-900">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="isEmergencyNo"
                  name="isEmergency"
                  type="radio"
                  value="No"
                  checked={localFormData.isEmergency === 'No'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="isEmergencyNo" className="ml-2 block text-sm text-gray-900">
                  No
                </label>
              </div>
            </div>
            {errors.isEmergency && <p className="text-red-500 text-xs mt-1">{errors.isEmergency}</p>}
          </div>

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={onPrev} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
              Back
            </Button>
            <Button type="submit" className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VeterinaryClinicTreatmentStep;