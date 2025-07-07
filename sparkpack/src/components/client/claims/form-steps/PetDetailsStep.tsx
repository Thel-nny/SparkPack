"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PetDetails } from '@/types/formData';

interface PetDetailsStepProps {
  formData: PetDetails;
  onUpdate: (data: Partial<PetDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const PetDetailsStep: React.FC<PetDetailsStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  const [localFormData, setLocalFormData] = useState<PetDetails>(formData);
  const [currentSubStep, setCurrentSubStep] = useState(1);

  const totalSubSteps = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const commonBreeds = ['Shih Tzus', 'Golden Retriever', 'Other', 'Mixed Breed'];
  const vaccinationOptions = ['Up-to-date', 'Not vaccinated', 'Partially vaccinated'];
  const lifestyleOptions = ['Mainly indoor', 'Mainly outdoor', 'Working animal', 'Show animal', 'Service animal', 'Other'];

  const renderYesNoRadio = (name: string, label: string) => (
    <div className="flex items-center space-x-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            id={`${name}Yes`}
            name={name}
            type="radio"
            value="Yes"
            checked={localFormData[name as keyof PetDetails] === 'Yes'}
            onChange={handleChange}
            className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
            required
          />
          <label htmlFor={`${name}Yes`} className="ml-2 block text-sm text-gray-900">Yes</label>
        </div>
        <div className="flex items-center">
          <input
            id={`${name}No`}
            name={name}
            type="radio"
            value="No"
            checked={localFormData[name as keyof PetDetails] === 'No'}
            onChange={handleChange}
            className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
            required
          />
          <label htmlFor={`${name}No`} className="ml-2 block text-sm text-gray-900">No</label>
        </div>
      </div>
    </div>
  );

  const renderExplanationTextarea = (name: string, label: string) => (
    localFormData[name as keyof PetDetails] === 'Yes' && (
      <div>
        <label htmlFor={`${name}Explanation`} className="block text-sm font-medium text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
        <Textarea
          id={`${name}Explanation`}
          name={`${name}Explanation`}
          value={localFormData[`${name}Explanation` as keyof PetDetails] || ''}
          onChange={handleChange}
          placeholder={`Please provide details for ${label.toLowerCase()}`}
          rows={3}
          className="shadow-sm mt-1 block w-full border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm"
          required
        />
      </div>
    )
  );

  const handleInternalNext = () => {
    let isValid = true;
    let message = '';

    if (currentSubStep === 1) {
      if (
        !localFormData.petName ||
        !localFormData.estimatedAge ||
        !localFormData.gender ||
        !localFormData.species ||
        (localFormData.species === 'Other' && !localFormData.otherSpecies) ||
        !localFormData.breed ||
        (localFormData.breed === 'Other' && !localFormData.otherBreed) ||
        !localFormData.colorMarkings ||
        !localFormData.weight
      ) {
        isValid = false;
        message = 'Please fill in all mandatory fields for Pet Details including weight.';
      }
    } else if (currentSubStep === 2) {
      if (
        !localFormData.spayedNeutered ||
        !localFormData.vaccinationStatus ||
        !localFormData.lifestyle ||
        !localFormData.vetName ||
        !localFormData.vetClinicName ||
        !localFormData.clinicPhoneNumber ||
        !localFormData.clinicAddress
      ) {
        isValid = false;
        message = 'Please fill in all mandatory fields for Health & Lifestyle and Veterinarian Information.';
      }
    } else if (currentSubStep === 3) {
      if (
        !localFormData.chronicIllness ||
        !localFormData.surgeryHistory ||
        !localFormData.recurringConditions ||
        !localFormData.onMedication
      ) {
        isValid = false;
        message = 'Please answer all questions about Existing Medical Conditions/History.';
      }

      if (localFormData.chronicIllness === 'Yes' && !localFormData.chronicIllnessExplanation) {
        isValid = false;
        message = 'Please explain your pet\'s chronic illness history.';
      }
      if (localFormData.surgeryHistory === 'Yes' && !localFormData.surgeryHistoryExplanation) {
        isValid = false;
        message = 'Please explain your pet\'s surgery history.';
      }
      if (localFormData.recurringConditions === 'Yes' && !localFormData.recurringConditionsExplanation) {
        isValid = false;
        message = 'Please explain your pet\'s recurring conditions.';
      }
      if (localFormData.onMedication === 'Yes' && !localFormData.onMedicationExplanation) {
        isValid = false;
        message = 'Please explain the medication your pet is currently on.';
      }
    }

    if (!isValid) {
      alert(message);
      return;
    }

    if (currentSubStep < totalSubSteps) {
      setCurrentSubStep((prevSubStep) => prevSubStep + 1);
    } else {
      onUpdate(localFormData);
      onNext();
    }
  };

  const handleInternalPrev = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep((prevSubStep) => prevSubStep - 1);
    } else {
      onUpdate(localFormData);
      onPrev();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Pet Details - Page {currentSubStep} of {totalSubSteps}</h2>

        {/* Sub-step 1: Basic Pet Information */}
        {currentSubStep === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name of pet to be insured <span className="text-red-500">*</span>
                </label>
                <Input id="petName" name="petName" type="text" value={localFormData.petName} onChange={handleChange} required className="shadow-sm" />
              </div>
              <div>
                <label htmlFor="dobOrAdoptionDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of birth or adoption date
                </label>
                <Input id="dobOrAdoptionDate" name="dobOrAdoptionDate" type="date" value={localFormData.dobOrAdoptionDate || ''} onChange={handleChange} className="shadow-sm" />
              </div>
              <div>
                <label htmlFor="estimatedAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Age <span className="text-red-500">*</span>
                </label>
                <Input id="estimatedAge" name="estimatedAge" type="text" value={localFormData.estimatedAge} onChange={handleChange} placeholder="e.g., 2 years, 6 months" required className="shadow-sm" />
              </div>
              <div className="flex flex-col justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-6 mt-2">
                  <div className="flex items-center">
                    <input id="petGenderMale" name="gender" type="radio" value="Male" checked={localFormData.gender === 'Male'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" required />
                    <label htmlFor="petGenderMale" className="ml-2 block text-sm text-gray-900">Male</label>
                  </div>
                  <div className="flex items-center">
                    <input id="petGenderFemale" name="gender" type="radio" value="Female" checked={localFormData.gender === 'Female'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" required />
                    <label htmlFor="petGenderFemale" className="ml-2 block text-sm text-gray-900">Female</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                  Species <span className="text-red-500">*</span>
                </label>
                <select
                  id="species"
                  name="species"
                  value={localFormData.species}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
                  required
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
                {localFormData.species === 'Other' && (
                  <div className="mt-2">
                    <Input
                      id="otherSpecies"
                      name="otherSpecies"
                      type="text"
                      value={localFormData.otherSpecies || ''}
                      onChange={handleChange}
                      placeholder="Please specify other species"
                      required
                      className="shadow-sm"
                    />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                  Breed <span className="text-red-500">*</span>
                </label>
                <select
                  id="breed"
                  name="breed"
                  value={localFormData.breed}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
                  required
                >
                  <option value="">Select Breed</option>
                  {commonBreeds.map((breed) => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
                {(localFormData.breed === 'Other' || localFormData.breed === 'Mixed Breed') && (
                  <div className="mt-2">
                    <Input
                      id="otherBreed"
                      name="otherBreed"
                      type="text"
                      value={localFormData.otherBreed || ''}
                      onChange={handleChange}
                      placeholder={`Please specify ${localFormData.breed === 'Mixed Breed' ? 'mixed breed' : 'other breed'}`}
                      required
                      className="shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="microchipNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Microchip number (Optional)
                </label>
                <Input id="microchipNumber" name="microchipNumber" type="text" value={localFormData.microchipNumber || ''} onChange={handleChange} className="shadow-sm" />
              </div>
              <div>
                <label htmlFor="colorMarkings" className="block text-sm font-medium text-gray-700 mb-1">
                  Color/markings <span className="text-red-500">*</span>
                </label>
                <Input id="colorMarkings" name="colorMarkings" type="text" value={localFormData.colorMarkings} onChange={handleChange} placeholder="e.g., Brown, White patches" required className="shadow-sm" />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (in kg or lbs) <span className="text-red-500">*</span>
                </label>
                <Input id="weight" name="weight" type="text" value={localFormData.weight || ''} onChange={handleChange} placeholder="e.g., 5 kg, 12 lbs" required className="shadow-sm" />
              </div>
            </div>
          </>
        )}

        {/* Sub-step 2: Health & Lifestyle AND Veterinarian Information */}
        {currentSubStep === 2 && (
          <>
            {/* Header: Health & Lifestyle */}
            <h3 className="text-xl font-bold mb-4 text-[#8cc63f]">Health & Lifestyle</h3>

            {/* Fourth Row: Spayed/Neutered Status, Vaccination Status, Lifestyle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
              <div className="flex flex-col justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spayed/Neutered Status: <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-6 mt-2">
                  <div className="flex items-center">
                    <input id="spayedNeuteredYes" name="spayedNeutered" type="radio" value="Yes" checked={localFormData.spayedNeutered === 'Yes'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" required />
                    <label htmlFor="spayedNeuteredYes" className="ml-2 block text-sm text-gray-900">Yes</label>
                  </div>
                  <div className="flex items-center">
                    <input id="spayedNeuteredNo" name="spayedNeutered" type="radio" value="No" checked={localFormData.spayedNeutered === 'No'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" required />
                    <label htmlFor="spayedNeuteredNo" className="ml-2 block text-sm text-gray-900">No</label>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="vaccinationStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Vaccination Status: <span className="text-red-500">*</span>
                </label>
                <select
                  id="vaccinationStatus"
                  name="vaccinationStatus"
                  value={localFormData.vaccinationStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
                  required
                >
                  <option value="">Select Status</option>
                  {vaccinationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 mb-1">
                  Lifestyle: <span className="text-red-500">*</span>
                </label>
                <select
                  id="lifestyle"
                  name="lifestyle"
                  value={localFormData.lifestyle}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
                  required
                >
                  <option value="">Select Lifestyle</option>
                  {lifestyleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Header: Veterinarian Information */}
            <h3 className="text-xl font-bold mb-4 mt-8 text-[#8cc63f]">Veterinarian Information</h3>

            {/* Ninth Row: Veterinarian's Name, Veterinary Clinic Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="vetName" className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinarian&apos;s Name <span className="text-red-500">*</span>
                </label>
                <Input id="vetName" name="vetName" type="text" value={localFormData.vetName} onChange={handleChange} required className="shadow-sm" />
              </div>
              <div>
                <label htmlFor="vetClinicName" className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinary Clinic Name <span className="text-red-500">*</span>
                </label>
                <Input id="vetClinicName" name="vetClinicName" type="text" value={localFormData.vetClinicName} onChange={handleChange} required className="shadow-sm" />
              </div>
            </div>

            {/* Tenth Row: Clinic Phone Number, Clinic Address, Last Vet Visit Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="clinicPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Phone Number <span className="text-red-500">*</span>
                </label>
                <Input id="clinicPhoneNumber" name="clinicPhoneNumber" type="tel" value={localFormData.clinicPhoneNumber} onChange={handleChange} placeholder="e.g., +63281234567" required className="shadow-sm" />
              </div>
              <div>
                <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Address <span className="text-red-500">*</span>
                </label>
                <Input id="clinicAddress" name="clinicAddress" type="text" value={localFormData.clinicAddress} onChange={handleChange} placeholder="Enter clinic address" required className="shadow-sm" />
              </div>
              <div>
                <label htmlFor="lastVetVisitDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Vet Visit Date
                </label>
                <Input id="lastVetVisitDate" name="lastVetVisitDate" type="date" value={localFormData.lastVetVisitDate || ''} onChange={handleChange} className="shadow-sm" />
              </div>
            </div>
          </>
        )}

        {/* Sub-step 3: Existing Medical Conditions/History */}
        {currentSubStep === 3 && (
          <>
            {/* Header: Existing Medical Conditions/History */}
            <h3 className="text-xl font-bold mb-6 text-[#8cc63f]">Existing Medical Conditions/History</h3>

            {/* 5th to 8th Rows: Yes/No Questions with Conditional Explanations */}
            <div className={`grid grid-cols-1 md:grid-cols-${
                localFormData.chronicIllness === 'Yes' ||
                localFormData.surgeryHistory === 'Yes' ||
                localFormData.recurringConditions === 'Yes' ||
                localFormData.onMedication === 'Yes' ? '2' : '1'
              } gap-x-6 gap-y-4 mb-6 items-start`}>
              <div className="flex flex-col space-y-4">
                {renderYesNoRadio('chronicIllness', 'Has your pet ever been diagnosed with or shown signs of any chronic illness (e.g., diabetes, epilepsy, heart disease)?')}
                {renderYesNoRadio('surgeryHistory', 'Has your pet ever had surgery (excluding spay/neuter)?')}
                {renderYesNoRadio('recurringConditions', 'Has your pet ever had any recurring conditions (e.g., allergies, ear infections)?')}
                {renderYesNoRadio('onMedication', 'Is your pet currently on any medication?')}
              </div>

              {(localFormData.chronicIllness === 'Yes' ||
                localFormData.surgeryHistory === 'Yes' ||
                localFormData.recurringConditions === 'Yes' ||
                localFormData.onMedication === 'Yes') && (
                <div className="flex flex-col space-y-4">
                  <p className="text-sm font-medium text-gray-700">Please provide details for &apos;Yes&apos; answers:</p>
                  {renderExplanationTextarea('chronicIllness', 'Chronic Illness Explanation')}
                  {renderExplanationTextarea('surgeryHistory', 'Surgery History Explanation')}
                  {renderExplanationTextarea('recurringConditions', 'Recurring Conditions Explanation')}
                  {renderExplanationTextarea('onMedication', 'Medication Explanation')}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Internal Pagination Buttons */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={handleInternalPrev}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          {currentSubStep === 1 ? 'Previous: Client Details' : 'Previous Page'}
        </Button>

        <Button
          onClick={handleInternalNext}
          className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
        >
          {currentSubStep === totalSubSteps ? 'Next: Product Details' : 'Next Page'}
        </Button>
      </div>
    </div>
  );
};

export default PetDetailsStep;