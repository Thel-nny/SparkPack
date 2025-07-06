'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { IncidentDetails } from '@/types/formData'; // Correctly imported type

interface IncidentDetailsStepProps {
  formData: IncidentDetails;
  onUpdate: (data: Partial<IncidentDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const IncidentDetailsStep: React.FC<IncidentDetailsStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  const [localFormData, setLocalFormData] = useState<IncidentDetails>(formData);
  const [errors, setErrors] = useState<Partial<Record<keyof IncidentDetails, string>>>({});

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean | undefined;

    // --- CRITICAL FIX FOR RADIO BUTTONS AND TYPE SAFETY ---
    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === 'radio') {
        // For radio buttons, we want the 'value' (e.g., "Yes", "No")
        newValue = value;
      } else if (e.target.type === 'checkbox') {
        // For checkboxes, we want the boolean 'checked' status
        newValue = e.target.checked;
      } else {
        // For other input types (text, date), handle empty string vs undefined
        newValue = value === '' ? '' : value;
      }
    } else {
      // For select or textarea elements
      newValue = value === '' ? '' : value;
    }
    // --- END CRITICAL FIX ---

    setLocalFormData((prev) => {
      const updatedData: IncidentDetails = {
        ...prev,
        [name]: newValue as any, // 'as any' is used here to temporarily bypass TypeScript if it complains,
                                 // but with the corrected 'newValue' logic, this should align.
      };

      // Handle conditional clearing/setting of related fields based on new value
      if (name === 'incidentType') {
        const currentIncidentType = newValue as IncidentDetails['incidentType'];
        if (currentIncidentType === 'Accident') {
          updatedData.symptomsDescription = undefined;
          updatedData.symptomsFirstAppearance = undefined;
          updatedData.symptomsDuration = undefined;
        } else if (currentIncidentType === 'Illness') {
          updatedData.accidentDescription = undefined;
          updatedData.accidentLocation = undefined;
          updatedData.accidentWitnesses = undefined;
        } else {
          // Clear all conditional fields if type is neither Accident nor Illness (e.g., if set to '')
          updatedData.symptomsDescription = undefined;
          updatedData.symptomsFirstAppearance = undefined;
          updatedData.symptomsDuration = undefined;
          updatedData.accidentDescription = undefined;
          updatedData.accidentLocation = undefined;
          updatedData.accidentWitnesses = undefined;
        }
      }

      if (name === 'previousRelatedConditions') {
        const currentPrevCondition = newValue as IncidentDetails['previousRelatedConditions'];
        if (currentPrevCondition === 'No') {
          updatedData.previousConditionDetails = undefined;
        }
      }

      return updatedData;
    });
  };

  const validate = () => {
    let newErrors: Partial<Record<keyof IncidentDetails, string>> = {};

    if (!localFormData.incidentOrSymptomDate) {
      newErrors.incidentOrSymptomDate = 'Date of Incident/First Symptom is required.';
    }
    if (!localFormData.vetVisitDate) {
      newErrors.vetVisitDate = 'Date of Veterinary Visit is required.';
    }

    if (!localFormData.incidentType) {
      newErrors.incidentType = 'Nature of Incident (Accident or Illness) is required.';
    }

    if (localFormData.incidentType === 'Accident') {
      if (!localFormData.accidentDescription) {
        newErrors.accidentDescription = 'Detailed description of how the accident happened is required.';
      }
      if (!localFormData.accidentLocation) {
        newErrors.accidentLocation = 'Location of accident is required.';
      }
    } else if (localFormData.incidentType === 'Illness') {
      if (!localFormData.symptomsDescription) {
        newErrors.symptomsDescription = 'Description of symptoms is required.';
      }
      if (!localFormData.symptomsFirstAppearance) {
        newErrors.symptomsFirstAppearance = 'When symptoms first appeared is required.';
      }
      if (!localFormData.symptomsDuration) {
        newErrors.symptomsDuration = 'How long symptoms have been present is required.';
      }
    }

    if (!localFormData.affectedBodyPart) {
      newErrors.affectedBodyPart = 'Affected Body Part/System is required.';
    }

    if (!localFormData.previousRelatedConditions) {
      newErrors.previousRelatedConditions = 'Please indicate if your pet has had previous related conditions.';
    }
    if (localFormData.previousRelatedConditions === 'Yes' && !localFormData.previousConditionDetails) {
      newErrors.previousConditionDetails = 'Please provide details for previous related conditions.';
    }

    if (!localFormData.reasonForClaim) {
      newErrors.reasonForClaim = 'Reason for Claim is required.';
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
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Incident Details</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNextClick();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label htmlFor="incidentOrSymptomDate" className="block text-sm font-medium text-gray-700 mb-1">
                <>Date of Incident/First Symptom <span className="text-red-500">*</span></>
              </label>
              <Input
                id="incidentOrSymptomDate"
                name="incidentOrSymptomDate"
                type="date"
                value={localFormData.incidentOrSymptomDate}
                onChange={handleChange}
                required
              />
              {errors.incidentOrSymptomDate && <p className="text-red-500 text-xs mt-1">{errors.incidentOrSymptomDate}</p>}
            </div>
            <div>
              <label htmlFor="vetVisitDate" className="block text-sm font-medium text-gray-700 mb-1">
                <>Date of Veterinary Visit <span className="text-red-500">*</span></>
              </label>
              <Input
                id="vetVisitDate"
                name="vetVisitDate"
                type="date"
                value={localFormData.vetVisitDate}
                onChange={handleChange}
                required
              />
              {errors.vetVisitDate && <p className="text-red-500 text-xs mt-1">{errors.vetVisitDate}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-2">
              <>Nature of Incident <span className="text-red-500">*</span></>
            </label>
            <select
              id="incidentType"
              name="incidentType"
              value={localFormData.incidentType}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
              required
            >
              <option value="">Select Type</option>
              <option value="Accident">Accident</option>
              <option value="Illness">Illness</option>
            </select>
            {errors.incidentType && <p className="text-red-500 text-xs mt-1">{errors.incidentType}</p>}
          </div>

          {localFormData.incidentType === 'Accident' && (
            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-[#8cc63f]">Accident Details</h3>
              <div className="mb-4">
                <label htmlFor="accidentDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  <>Detailed description of how the accident happened <span className="text-red-500">*</span></>
                </label>
                <Textarea
                  id="accidentDescription"
                  name="accidentDescription"
                  value={localFormData.accidentDescription || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Fell from stairs, Hit by bicycle, Ingested foreign object"
                  required={localFormData.incidentType === 'Accident'}
                />
                {errors.accidentDescription && <p className="text-red-500 text-xs mt-1">{errors.accidentDescription}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="accidentLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  <>Location of accident <span className="text-red-500">*</span></>
                </label>
                <Input
                  id="accidentLocation"
                  name="accidentLocation"
                  type="text"
                  value={localFormData.accidentLocation || ''}
                  onChange={handleChange}
                  required={localFormData.incidentType === 'Accident'}
                />
                {errors.accidentLocation && <p className="text-red-500 text-xs mt-1">{errors.accidentLocation}</p>}
              </div>
              <div>
                <label htmlFor="accidentWitnesses" className="block text-sm font-medium text-gray-700 mb-1">
                  Any witnesses? (Optional)
                </label>
                <Input
                  id="accidentWitnesses"
                  name="accidentWitnesses"
                  type="text"
                  value={localFormData.accidentWitnesses || ''}
                  onChange={handleChange}
                  placeholder="e.g., Name and contact if applicable"
                />
              </div>
            </div>
          )}

          {localFormData.incidentType === 'Illness' && (
            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-[#8cc63f]">Illness Details</h3>
              <div className="mb-4">
                <label htmlFor="symptomsDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  <>Description of symptoms <span className="text-red-500">*</span></>
                </label>
                <Textarea
                  id="symptomsDescription"
                  name="symptomsDescription"
                  value={localFormData.symptomsDescription || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Vomiting and diarrhea, Limping, Excessive scratching"
                  required={localFormData.incidentType === 'Illness'}
                />
                {errors.symptomsDescription && <p className="text-red-500 text-xs mt-1">{errors.symptomsDescription}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                  <label htmlFor="symptomsFirstAppearance" className="block text-sm font-medium text-gray-700 mb-1">
                    <>When did symptoms first appear? <span className="text-red-500">*</span></>
                  </label>
                  <Input
                    id="symptomsFirstAppearance"
                    name="symptomsFirstAppearance"
                    type="date"
                    value={localFormData.symptomsFirstAppearance || ''}
                    onChange={handleChange}
                    required={localFormData.incidentType === 'Illness'}
                  />
                  {errors.symptomsFirstAppearance && <p className="text-red-500 text-xs mt-1">{errors.symptomsFirstAppearance}</p>}
                </div>
                <div>
                  <label htmlFor="symptomsDuration" className="block text-sm font-medium text-gray-700 mb-1">
                    <>How long have symptoms been present? <span className="text-red-500">*</span></>
                  </label>
                  <Input
                    id="symptomsDuration"
                    name="symptomsDuration"
                    type="text"
                    value={localFormData.symptomsDuration || ''}
                    onChange={handleChange}
                    placeholder="e.g., 3 days, 1 week"
                    required={localFormData.incidentType === 'Illness'}
                  />
                  {errors.symptomsDuration && <p className="text-red-500 text-xs mt-1">{errors.symptomsDuration}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="affectedBodyPart" className="block text-sm font-medium text-gray-700 mb-1">
              <>Affected Body Part/System <span className="text-red-500">*</span></>
            </label>
            <Input
              id="affectedBodyPart"
              name="affectedBodyPart"
              type="text"
              value={localFormData.affectedBodyPart || ''}
              onChange={handleChange}
              placeholder="e.g., Right hind leg, Digestive system, Skin/ears"
              required
            />
            {errors.affectedBodyPart && <p className="text-red-500 text-xs mt-1">{errors.affectedBodyPart}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <>
                Previous Related Conditions: Has your pet ever shown these symptoms or been treated for a similar condition
                before? <span className="text-red-500">*</span>
              </>
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  id="previousRelatedConditionsYes"
                  name="previousRelatedConditions"
                  type="radio"
                  value="Yes"
                  checked={localFormData.previousRelatedConditions === 'Yes'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="previousRelatedConditionsYes" className="ml-2 block text-sm text-gray-900">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="previousRelatedConditionsNo"
                  name="previousRelatedConditions"
                  type="radio"
                  value="No"
                  checked={localFormData.previousRelatedConditions === 'No'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="previousRelatedConditionsNo" className="ml-2 block text-sm text-gray-900">
                  No
                </label>
              </div>
            </div>
            {errors.previousRelatedConditions && <p className="text-red-500 text-xs mt-1">{errors.previousRelatedConditions}</p>}
            {localFormData.previousRelatedConditions === 'Yes' && (
              <div className="mt-4">
                <label htmlFor="previousConditionDetails" className="block text-sm font-medium text-gray-700 mb-1">
                  <>
                    Please provide approximate dates and vet names for previous related conditions.
                    <span className="text-red-500">*</span>
                  </>
                </label>
                <Textarea
                  id="previousConditionDetails"
                  name="previousConditionDetails"
                  value={localFormData.previousConditionDetails || ''}
                  onChange={handleChange}
                  rows={3}
                  required={localFormData.previousRelatedConditions === 'Yes'}
                />
                {errors.previousConditionDetails && <p className="text-red-500 text-xs mt-1">{errors.previousConditionDetails}</p>}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="reasonForClaim" className="block text-sm font-medium text-gray-700 mb-1">
              <>Reason for Claim <span className="text-red-500">*</span></>
            </label>
            <Textarea
              id="reasonForClaim"
              name="reasonForClaim"
              value={localFormData.reasonForClaim || ''}
              onChange={handleChange}
              rows={3}
              placeholder="e.g., Diagnosis and treatment for fractured leg, Medication for skin allergy, Emergency surgery for foreign body ingestion"
              required
            />
            {errors.reasonForClaim && <p className="text-red-500 text-xs mt-1">{errors.reasonForClaim}</p>}
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

export default IncidentDetailsStep;