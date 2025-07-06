'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PetDetails } from '@/types/formData';

interface PetDetailsStepProps {
  formData: PetDetails;
  onUpdate: (data: Partial<PetDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const PetDetailsStep: React.FC<PetDetailsStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  const [localFormData, setLocalFormData] = useState<PetDetails>(formData);
  const [errors, setErrors] = useState<Partial<Record<keyof PetDetails, string>>>({});

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean;

    // --- CRITICAL CHANGE HERE TO FIX GENDER SELECTION ---
    if (e.target instanceof HTMLInputElement) { // Type guard: check if it's an HTMLInputElement
      if (e.target.type === 'radio') {
        // For radio buttons, we want the 'value' attribute (e.g., "Male", "Female")
        // This is the actual string you want to store in your state.
        newValue = value;
      } else if (e.target.type === 'checkbox') {
        // For checkboxes, you correctly want the boolean 'checked' status.
        newValue = e.target.checked;
      } else {
        // For other input types (text, date), just use the value.
        newValue = value;
      }
    } else {
      // For select or textarea elements, just use the value.
      newValue = value;
    }
    // --- END CRITICAL CHANGE ---

    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const commonBreeds = ['Shih Tzus', 'Golden Retriever', 'Other', 'Mixed Breed'];

  const validate = () => {
    const newErrors: Partial<Record<keyof PetDetails, string>> = {};

    if (!localFormData.petName) newErrors.petName = 'Pet name is required.';
    if (!localFormData.estimatedAge) newErrors.estimatedAge = 'Estimated Age is required.';
    // The `!localFormData.gender` check correctly handles `''` (empty string)
    // if `gender` is typed as `'' | 'Male' | 'Female'` in formData.ts.
    if (!localFormData.gender) newErrors.gender = 'Gender is required.';
    if (!localFormData.species) {
      newErrors.species = 'Species is required.';
    } else if (localFormData.species === 'Other' && !localFormData.otherSpecies) {
      newErrors.otherSpecies = 'Please specify other species.';
    }
    if (!localFormData.breed) {
      newErrors.breed = 'Breed is required.';
    } else if ((localFormData.breed === 'Other' || localFormData.breed === 'Mixed Breed') && !localFormData.otherBreed) {
      newErrors.otherBreed = `Please specify ${localFormData.breed === 'Mixed Breed' ? 'mixed breed' : 'other breed'}.`;
    }
    if (!localFormData.colorMarkings) newErrors.colorMarkings = 'Color/markings are required.';
    if (!localFormData.weight) newErrors.weight = 'Weight is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onUpdate(localFormData);
      onNext();
    } else {
      alert('Please fill in all mandatory fields and correct any errors.');
    }
  };

  const handlePrev = () => {
    onUpdate(localFormData);
    onPrev();
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Pet Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
              Name of pet to be insured <span className="text-red-500">*</span>
            </label>
            <Input id="petName" name="petName" type="text" value={localFormData.petName} onChange={handleChange} required className="shadow-sm" />
            {errors.petName && <p className="text-red-500 text-xs mt-1">{errors.petName}</p>}
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
            {errors.estimatedAge && <p className="text-red-500 text-xs mt-1">{errors.estimatedAge}</p>}
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
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
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
            {errors.species && <p className="text-red-500 text-xs mt-1">{errors.species}</p>}
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
                {errors.otherSpecies && <p className="text-red-500 text-xs mt-1">{errors.otherSpecies}</p>}
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
            {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
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
                {errors.otherBreed && <p className="text-red-500 text-xs mt-1">{errors.otherBreed}</p>}
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
            {errors.colorMarkings && <p className="text-red-500 text-xs mt-1">{errors.colorMarkings}</p>}
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (in kg or lbs) <span className="text-red-500">*</span>
            </label>
            <Input id="weight" name="weight" type="text" value={localFormData.weight || ''} onChange={handleChange} placeholder="e.g., 5 kg, 12 lbs" required className="shadow-sm" />
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePrev}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Previous: Client Details
        </Button>

        <Button
          onClick={handleNext}
          className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
        >
          Next: Product Details
        </Button>
      </div>
    </div>
  );
};

export default PetDetailsStep;