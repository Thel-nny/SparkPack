'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientDetails } from '@/types/formData';

interface ClientDetailsStepProps {
  formData: ClientDetails;
  onUpdate: (data: Partial<ClientDetails>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ClientDetailsStep: React.FC<ClientDetailsStepProps> = ({ formData, onUpdate, onNext, onPrev }) => {
  const [localFormData, setLocalFormData] = useState<ClientDetails>(formData);

  // --- CHANGE MADE HERE ---
  // Define errors state to hold string messages for each field
  const [errors, setErrors] = useState<Partial<Record<keyof ClientDetails, string>>>({});
  // --- END CHANGE ---

  // Effect to sync formData from parent if it changes
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCheckboxChange = (id: keyof ClientDetails, checked: boolean) => {
    setLocalFormData((prevData) => ({
      ...prevData,
      [id]: checked,
    }));
  };

  const validate = () => {
    // --- CHANGE MADE HERE ---
    // Define newErrors with the correct type
    const newErrors: Partial<Record<keyof ClientDetails, string>> = {};
    // --- END CHANGE ---

    // Mandatory fields
    if (!localFormData.firstName) newErrors.firstName = 'First Name is required.';
    if (!localFormData.lastName) newErrors.lastName = 'Last Name is required.';
    if (!localFormData.dob) newErrors.dob = 'Date of Birth is required.';
    if (!localFormData.pob) newErrors.pob = 'Place of Birth is required.';
    if (!localFormData.gender) newErrors.gender = 'Gender is required.';
    if (!localFormData.email) newErrors.email = 'Email Address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) newErrors.email = 'Invalid email format.';
    if (!localFormData.streetAddress) newErrors.streetAddress = 'Street Address is required.';
    if (!localFormData.declarationAccuracy) newErrors.declarationAccuracy = 'You must confirm the declaration.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validate()) {
      onUpdate(localFormData);
      onNext();
    } else {
      alert('Please correct the highlighted errors before proceeding.');
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Header: Personal Information */}
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Personal Information</h2>

        {/* First Row: First Name, Middle Name, Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input id="firstName" name="firstName" type="text" value={localFormData.firstName} onChange={handleChange} required className="shadow-sm" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name (Optional)
            </label>
            <Input id="middleName" name="middleName" type="text" value={localFormData.middleName || ''} onChange={handleChange} className="shadow-sm" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input id="lastName" name="lastName" type="text" value={localFormData.lastName} onChange={handleChange} required className="shadow-sm" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Second Row: Date of Birth, Place of Birth, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <Input id="dob" name="dob" type="date" value={localFormData.dob} onChange={handleChange} required className="shadow-sm" />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
          <div>
            <label htmlFor="pob" className="block text-sm font-medium text-gray-700 mb-1">
              Place of Birth <span className="text-red-500">*</span>
            </label>
            <Input id="pob" name="pob" type="text" value={localFormData.pob || ''} onChange={handleChange} placeholder="Enter place of birth" required className="shadow-sm" />
            {errors.pob && <p className="text-red-500 text-xs mt-1">{errors.pob}</p>}
          </div>
          <div className="flex flex-col justify-start">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-6 mt-2">
              <div className="flex items-center">
                <input id="genderMale" name="gender" type="radio" value="Male" checked={localFormData.gender === 'Male'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                <label htmlFor="genderMale" className="ml-2 block text-sm text-gray-900">Male</label>
              </div>
              <div className="flex items-center">
                <input id="genderFemale" name="gender" type="radio" value="Female" checked={localFormData.gender === 'Female'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                <label htmlFor="genderFemale" className="ml-2 block text-sm text-gray-900">Female</label>
              </div>
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
        </div>

        {/* Third Row: Email Address, Phone Number (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input id="email" name="email" type="email" value={localFormData.email} onChange={handleChange} placeholder="Enter email address" required className="shadow-sm" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" value={localFormData.phoneNumber || ''} onChange={handleChange} placeholder="e.g., +639123456789" className="shadow-sm" />
          </div>
        </div>

        {/* Fourth Row: Residential Address Section - Street Address and then Country/City/Province/Postal Code on one row */}
        <div className="grid grid-cols-1 gap-y-4 mb-6">
          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input id="streetAddress" name="streetAddress" type="text" value={localFormData.streetAddress} onChange={handleChange} placeholder="Enter street address" required className="shadow-sm" />
            {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <Input id="country" name="country" type="text" value={localFormData.country} disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Input id="city" name="city" type="text" value={localFormData.city} disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <Input id="province" name="province" type="text" value={localFormData.province} disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <Input id="postalCode" name="postalCode" type="text" value={localFormData.postalCode} disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
          </div>
        </div>

        {/* Sixth Row: Confirmation and Button */}
        <div className="mb-6">
          <div className="flex items-start">
            <Checkbox
              id="declarationAccuracy"
              checked={localFormData.declarationAccuracy}
              onCheckedChange={(checked) => handleCheckboxChange('declarationAccuracy', checked as boolean)}
            />
            <label htmlFor="declarationAccuracy" className="ml-2 block text-sm text-gray-900">
              I confirm that all information provided is true and accurate to my best knowledge.{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.declarationAccuracy && <p className="text-red-500 text-xs mt-1 ml-6">{errors.declarationAccuracy}</p>}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Back
        </Button>
        <Button onClick={handleNextClick} className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded">
          Next: Pet Details
        </Button>
      </div>
    </div>
  );
};

export default ClientDetailsStep;