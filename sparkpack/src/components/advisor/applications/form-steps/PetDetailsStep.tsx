"use client";

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; // Assuming you have a Label component
import { PetDetails } from '@/types/applicationFormData'; // Updated import path

interface PetDetailsStepProps {
  formData: PetDetails;
  onUpdate: (data: Partial<PetDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const PetDetailsStep = forwardRef<any, PetDetailsStepProps>(
  ({ formData, onUpdate, onPrev, onNext }, ref) => {
    const [currentSubStep, setCurrentSubStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const totalSubSteps = 3;

    const commonBreeds = ['Shih Tzus', 'Golden Retriever', 'Other', 'Mixed Breed'];
    const vaccinationOptions = ['Up-to-date', 'Not up-to-date', 'Unknown']; // Corrected from 'Not vaccinated', 'Partially vaccinated' to match formData.ts
    const lifestyleOptions = ['Indoor', 'Outdoor', 'Both']; // Corrected from 'Mainly indoor', 'Mainly outdoor', 'Working animal', 'Show animal', 'Service animal', 'Other' to match formData.ts

    // Validation function for individual fields
    const validateField = (name: keyof PetDetails, value: string | boolean): string => {
      let error = '';
      switch (name) {
        case 'petName':
          if (!value) error = 'Pet Name is required.';
          break;
        case 'dobOrAdoptionDate':
          // Optional in formData, but if filled, could add date format validation
          break;
        case 'estimatedAge':
          if (!value) error = 'Estimated Age is required.';
          break;
        case 'gender':
          if (!value) error = 'Gender is required.';
          break;
        case 'species':
          if (!value) error = 'Species is required.';
          break;
        case 'otherSpecies':
          if (formData.species === 'Other' && !value) error = 'Please specify other species.';
          break;
        case 'breed':
          if (!value) error = 'Breed is required.';
          break;
        case 'otherBreed':
          if ((formData.breed === 'Other' || formData.breed === 'Mixed Breed') && !value) error = 'Please specify breed details.';
          break;
        case 'microchipNumber':
          // Optional in formData
          break;
        case 'colorMarkings':
          if (!value) error = 'Color/markings are required.';
          break;
        case 'weight':
          if (!value) error = 'Weight is required.';
          break;
        case 'spayedNeutered':
          if (!value) error = 'Spayed/Neutered status is required.';
          break;
        case 'vaccinationStatus':
          if (!value) error = 'Vaccination Status is required.';
          break;
        case 'lifestyle':
          if (!value) error = 'Lifestyle is required.';
          break;
        case 'vetName':
          if (!value) error = 'Veterinarian\'s Name is required.';
          break;
        case 'vetClinicName':
          if (!value) error = 'Veterinary Clinic Name is required.';
          break;
        case 'clinicPhoneNumber':
          if (!value) error = 'Clinic Phone Number is required.';
          break;
        case 'clinicAddress':
          if (!value) error = 'Clinic Address is required.';
          break;
        case 'lastVetVisitDate':
          // Optional in formData
          break;
        case 'chronicIllness':
          if (!value) error = 'This question is required.';
          break;
        case 'chronicIllnessExplanation':
          if (formData.chronicIllness === 'Yes' && !value) error = 'Explanation for chronic illness is required.';
          break;
        case 'surgeryHistory':
          if (!value) error = 'This question is required.';
          break;
        case 'surgeryHistoryExplanation':
          if (formData.surgeryHistory === 'Yes' && !value) error = 'Explanation for surgery history is required.';
          break;
        case 'recurringConditions':
          if (!value) error = 'This question is required.';
          break;
        case 'recurringConditionsExplanation':
          if (formData.recurringConditions === 'Yes' && !value) error = 'Explanation for recurring conditions is required.';
          break;
        case 'onMedication':
          if (!value) error = 'This question is required.';
          break;
        case 'onMedicationExplanation':
          if (formData.onMedication === 'Yes' && !value) error = 'Explanation for medication is required.';
          break;
        default:
          break;
      }
      return error;
    };

    // Comprehensive validation for the current sub-step
    const validateSubStep = (): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;
      let fieldsToValidate: Array<keyof PetDetails> = [];

      if (currentSubStep === 1) {
        fieldsToValidate = [
          'petName', 'estimatedAge', 'gender', 'species', 'breed', 'colorMarkings', 'weight'
        ];
        if (formData.species === 'Other') fieldsToValidate.push('otherSpecies');
        if (formData.breed === 'Other' || formData.breed === 'Mixed Breed') fieldsToValidate.push('otherBreed');
      } else if (currentSubStep === 2) {
        fieldsToValidate = [
          'spayedNeutered', 'vaccinationStatus', 'lifestyle', 'vetName', 'vetClinicName',
          'clinicPhoneNumber', 'clinicAddress'
        ];
      } else if (currentSubStep === 3) {
        fieldsToValidate = [
          'chronicIllness', 'surgeryHistory', 'recurringConditions', 'onMedication'
        ];
        if (formData.chronicIllness === 'Yes') fieldsToValidate.push('chronicIllnessExplanation');
        if (formData.surgeryHistory === 'Yes') fieldsToValidate.push('surgeryHistoryExplanation');
        if (formData.recurringConditions === 'Yes') fieldsToValidate.push('recurringConditionsExplanation');
        if (formData.onMedication === 'Yes') fieldsToValidate.push('onMedicationExplanation');
      }

      fieldsToValidate.forEach((field) => {
        const error = validateField(field, formData[field] as string | boolean);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    };

    // Expose the validate function to the parent component via ref
    useImperativeHandle(ref, () => ({
      validate: validateSubStep,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      let newValue: string | boolean;

      if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'radio') {
        newValue = value; // Radio buttons use value directly
      } else {
        newValue = value;
      }

      onUpdate({
        [name as keyof PetDetails]: newValue,
      });

      // Validate field on change and update errors state
      const error = validateField(name as keyof PetDetails, newValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const handleInternalNext = () => {
      if (validateSubStep()) { // Validate current sub-step before proceeding
        if (currentSubStep < totalSubSteps) {
          setCurrentSubStep((prevSubStep) => prevSubStep + 1);
        } else {
          onNext(); // Move to next main step
        }
      }
    };

    const handleInternalPrev = () => {
      // No validation needed when going back
      if (currentSubStep > 1) {
        setCurrentSubStep((prevSubStep) => prevSubStep - 1);
      } else {
        onPrev(); // Move to previous main step
      }
    };

    const renderYesNoRadio = (name: keyof PetDetails, label: string) => (
      <div className="flex flex-col">
        <Label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></Label>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center">
            <input
              id={`${name}Yes`}
              name={name as string}
              type="radio"
              value="Yes"
              checked={formData[name] === 'Yes'}
              onChange={handleChange}
              className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
            />
            <Label htmlFor={`${name}Yes`} className="ml-2 block text-sm text-gray-900">Yes</Label>
          </div>
          <div className="flex items-center">
            <input
              id={`${name}No`}
              name={name as string}
              type="radio"
              value="No"
              checked={formData[name] === 'No'}
              onChange={handleChange}
              className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
            />
            <Label htmlFor={`${name}No`} className="ml-2 block text-sm text-gray-900">No</Label>
          </div>
        </div>
        {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
      </div>
    );

    const renderExplanationTextarea = (name: keyof PetDetails, label: string) => (
      (formData[name.replace('Explanation', '') as keyof PetDetails] === 'Yes' || name.includes('Explanation')) && ( // Ensure it shows if explanation is needed
        <div>
          <Label htmlFor={name as string} className="block text-sm font-medium text-gray-700 mb-1">
            {label} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id={name as string}
            name={name as string}
            value={formData[name] as string || ''}
            onChange={handleChange}
            placeholder={`Please provide details for ${label.toLowerCase()}`}
            rows={3}
            className={`shadow-sm mt-1 block w-full border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm ${errors[name] ? 'border-red-500' : ''}`}
          />
          {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
        </div>
      )
    );

    return (
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Pet Details - Page {currentSubStep} of {totalSubSteps}</h2>

          {/* Sub-step 1: Basic Pet Information */}
          {currentSubStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-6">
                <div>
                  <Label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name of pet to be insured <span className="text-red-500">*</span>
                  </Label>
                  <Input id="petName" name="petName" type="text" value={formData.petName} onChange={handleChange} className={`shadow-sm ${errors.petName ? 'border-red-500' : ''}`} />
                  {errors.petName && <p className="mt-1 text-sm text-red-500">{errors.petName}</p>}
                </div>
                <div>
                  <Label htmlFor="dobOrAdoptionDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of birth or adoption date (Optional)
                  </Label>
                  <Input id="dobOrAdoptionDate" name="dobOrAdoptionDate" type="date" value={formData.dobOrAdoptionDate || ''} onChange={handleChange} className="shadow-sm" />
                </div>
                <div>
                  <Label htmlFor="estimatedAge" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Age <span className="text-red-500">*</span>
                  </Label>
                  <Input id="estimatedAge" name="estimatedAge" type="text" value={formData.estimatedAge || ''} onChange={handleChange} placeholder="e.g., 2 years, 6 months" className={`shadow-sm ${errors.estimatedAge ? 'border-red-500' : ''}`} />
                  {errors.estimatedAge && <p className="mt-1 text-sm text-red-500">{errors.estimatedAge}</p>}
                </div>
                <div className="flex flex-col justify-start">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center">
                      <input id="petGenderMale" name="gender" type="radio" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                      <Label htmlFor="petGenderMale" className="ml-2 block text-sm text-gray-900">Male</Label>
                    </div>
                    <div className="flex items-center">
                      <input id="petGenderFemale" name="gender" type="radio" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                      <Label htmlFor="petGenderFemale" className="ml-2 block text-sm text-gray-900">Female</Label>
                    </div>
                  </div>
                  {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div>
                  <Label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                    Species <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.species ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
                  >
                    <option value="">Select Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.species && <p className="mt-1 text-sm text-red-500">{errors.species}</p>}
                  {formData.species === 'Other' && (
                    <div className="mt-2">
                      <Input
                        id="otherSpecies"
                        name="otherSpecies"
                        type="text"
                        value={formData.otherSpecies || ''}
                        onChange={handleChange}
                        placeholder="Please specify other species"
                        className={`shadow-sm ${errors.otherSpecies ? 'border-red-500' : ''}`}
                      />
                      {errors.otherSpecies && <p className="mt-1 text-sm text-red-500">{errors.otherSpecies}</p>}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                    Breed <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.breed ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
                  >
                    <option value="">Select Breed</option>
                    {commonBreeds.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                  {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed}</p>}
                  {(formData.breed === 'Other' || formData.breed === 'Mixed Breed') && (
                    <div className="mt-2">
                      <Input
                        id="otherBreed"
                        name="otherBreed"
                        type="text"
                        value={formData.otherBreed || ''}
                        onChange={handleChange}
                        placeholder={`Please specify ${formData.breed === 'Mixed Breed' ? 'mixed breed' : 'other breed'}`}
                        className={`shadow-sm ${errors.otherBreed ? 'border-red-500' : ''}`}
                      />
                      {errors.otherBreed && <p className="mt-1 text-sm text-red-500">{errors.otherBreed}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <div>
                  <Label htmlFor="microchipNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Microchip number (Optional)
                  </Label>
                  <Input id="microchipNumber" name="microchipNumber" type="text" value={formData.microchipNumber || ''} onChange={handleChange} className="shadow-sm" />
                </div>
                <div>
                  <Label htmlFor="colorMarkings" className="block text-sm font-medium text-gray-700 mb-1">
                    Color/markings <span className="text-red-500">*</span>
                  </Label>
                  <Input id="colorMarkings" name="colorMarkings" type="text" value={formData.colorMarkings || ''} onChange={handleChange} placeholder="e.g., Brown, White patches" className={`shadow-sm ${errors.colorMarkings ? 'border-red-500' : ''}`} />
                  {errors.colorMarkings && <p className="mt-1 text-sm text-red-500">{errors.colorMarkings}</p>}
                </div>
                <div>
                  <Label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (in kg or lbs) <span className="text-red-500">*</span>
                  </Label>
                  <Input id="weight" name="weight" type="text" value={formData.weight || ''} onChange={handleChange} placeholder="e.g., 5 kg, 12 lbs" className={`shadow-sm ${errors.weight ? 'border-red-500' : ''}`} />
                  {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
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
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Spayed/Neutered Status: <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center">
                      <input id="spayedNeuteredYes" name="spayedNeutered" type="radio" value="Yes" checked={formData.spayedNeutered === 'Yes'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                      <Label htmlFor="spayedNeuteredYes" className="ml-2 block text-sm text-gray-900">Yes</Label>
                    </div>
                    <div className="flex items-center">
                      <input id="spayedNeuteredNo" name="spayedNeutered" type="radio" value="No" checked={formData.spayedNeutered === 'No'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                      <Label htmlFor="spayedNeuteredNo" className="ml-2 block text-sm text-gray-900">No</Label>
                    </div>
                  </div>
                  {errors.spayedNeutered && <p className="mt-1 text-sm text-red-500">{errors.spayedNeutered}</p>}
                </div>
                <div>
                  <Label htmlFor="vaccinationStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccination Status: <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="vaccinationStatus"
                    name="vaccinationStatus"
                    value={formData.vaccinationStatus}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.vaccinationStatus ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
                  >
                    <option value="">Select Status</option>
                    {vaccinationOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.vaccinationStatus && <p className="mt-1 text-sm text-red-500">{errors.vaccinationStatus}</p>}
                </div>
                <div>
                  <Label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 mb-1">
                    Lifestyle: <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="lifestyle"
                    name="lifestyle"
                    value={formData.lifestyle}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.lifestyle ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
                  >
                    <option value="">Select Lifestyle</option>
                    {lifestyleOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.lifestyle && <p className="mt-1 text-sm text-red-500">{errors.lifestyle}</p>}
                </div>
              </div>

              {/* Header: Veterinarian Information */}
              <h3 className="text-xl font-bold mb-4 mt-8 text-[#8cc63f]">Veterinarian Information</h3>

              {/* Ninth Row: Veterinarian's Name, Veterinary Clinic Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div>
                  <Label htmlFor="vetName" className="block text-sm font-medium text-gray-700 mb-1">
                    Veterinarian&apos;s Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="vetName" name="vetName" type="text" value={formData.vetName || ''} onChange={handleChange} className={`shadow-sm ${errors.vetName ? 'border-red-500' : ''}`} />
                  {errors.vetName && <p className="mt-1 text-sm text-red-500">{errors.vetName}</p>}
                </div>
                <div>
                  <Label htmlFor="vetClinicName" className="block text-sm font-medium text-gray-700 mb-1">
                    Veterinary Clinic Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="vetClinicName" name="vetClinicName" type="text" value={formData.vetClinicName || ''} onChange={handleChange} className={`shadow-sm ${errors.vetClinicName ? 'border-red-500' : ''}`} />
                  {errors.vetClinicName && <p className="mt-1 text-sm text-red-500">{errors.vetClinicName}</p>}
                </div>
              </div>

              {/* Tenth Row: Clinic Phone Number, Clinic Address, Last Vet Visit Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <div>
                  <Label htmlFor="clinicPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input id="clinicPhoneNumber" name="clinicPhoneNumber" type="tel" value={formData.clinicPhoneNumber || ''} onChange={handleChange} placeholder="e.g., +63281234567" className={`shadow-sm ${errors.clinicPhoneNumber ? 'border-red-500' : ''}`} />
                  {errors.clinicPhoneNumber && <p className="mt-1 text-sm text-red-500">{errors.clinicPhoneNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Address <span className="text-red-500">*</span>
                  </Label>
                  <Input id="clinicAddress" name="clinicAddress" type="text" value={formData.clinicAddress || ''} onChange={handleChange} placeholder="Enter clinic address" className={`shadow-sm ${errors.clinicAddress ? 'border-red-500' : ''}`} />
                  {errors.clinicAddress && <p className="mt-1 text-sm text-red-500">{errors.clinicAddress}</p>}
                </div>
                <div>
                  <Label htmlFor="lastVetVisitDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Vet Visit Date (Optional)
                  </Label>
                  <Input id="lastVetVisitDate" name="lastVetVisitDate" type="date" value={formData.lastVetVisitDate || ''} onChange={handleChange} className="shadow-sm" />
                </div>
              </div>
            </>
          )}

          {/* Sub-step 3: Existing Medical Conditions/History */}
          {currentSubStep === 3 && (
            <>
              {/* Header: Existing Medical Conditions/History */}
              <h3 className="text-xl font-bold mb-6 text-[#8cc63f]">Existing Medical Conditions/History</h3>

              {/* Yes/No Questions with Conditional Explanations */}
              <div className={`grid grid-cols-1 md:grid-cols-${
                  (formData.chronicIllness === 'Yes' ||
                  formData.surgeryHistory === 'Yes' ||
                  formData.recurringConditions === 'Yes' ||
                  formData.onMedication === 'Yes') ? '2' : '1'
                } gap-x-6 gap-y-4 mb-6 items-start`}>
                <div className="flex flex-col space-y-4">
                  {renderYesNoRadio('chronicIllness', 'Has your pet ever been diagnosed with or shown signs of any chronic illness (e.g., diabetes, epilepsy, heart disease)?')}
                  {renderYesNoRadio('surgeryHistory', 'Has your pet ever had surgery (excluding spay/neuter)?')}
                  {renderYesNoRadio('recurringConditions', 'Has your pet ever had any recurring conditions (e.g., allergies, ear infections)?')}
                  {renderYesNoRadio('onMedication', 'Is your pet currently on any medication?')}
                </div>

                {(formData.chronicIllness === 'Yes' ||
                  formData.surgeryHistory === 'Yes' ||
                  formData.recurringConditions === 'Yes' ||
                  formData.onMedication === 'Yes') && (
                  <div className="flex flex-col space-y-4">
                    <p className="text-sm font-medium text-gray-700">Please provide details for &apos;Yes&apos; answers:</p>
                    {renderExplanationTextarea('chronicIllnessExplanation', 'Chronic Illness Explanation')}
                    {renderExplanationTextarea('surgeryHistoryExplanation', 'Surgery History Explanation')}
                    {renderExplanationTextarea('recurringConditionsExplanation', 'Recurring Conditions Explanation')}
                    {renderExplanationTextarea('onMedicationExplanation', 'Medication Explanation')}
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
  }
);

PetDetailsStep.displayName = 'PetDetailsStep'; // Add display name for forwardRef

export default PetDetailsStep;