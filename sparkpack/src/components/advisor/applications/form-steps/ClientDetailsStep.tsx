"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientDetails } from '@/types/formData';

interface ClientDetailsStepProps {
  formData: ClientDetails;
  onUpdate: (data: Partial<ClientDetails>) => void;
  onNext: () => void;
}

const ClientDetailsStep: React.FC<ClientDetailsStepProps> = ({ formData, onUpdate, onNext }) => {
  const [localFormData, setLocalFormData] = useState<ClientDetails>(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNextClick = () => {
    // Simplified validation based on new required fields
    if (
      !localFormData.firstName ||
      !localFormData.lastName ||
      !localFormData.dob ||
      !localFormData.pob ||
      !localFormData.gender ||
      !localFormData.email ||
      !localFormData.streetAddress ||
      !localFormData.declarationAccuracy
    ) {
      alert('Please fill in all mandatory fields and confirm the declaration.');
      return;
    }

    onUpdate({ ...localFormData, allowPhoneCollection: true }); 
    onNext();
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
          </div>
        </div>

        {/* Second Row: Date of Birth, Place of Birth, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <Input id="dob" name="dob" type="date" value={localFormData.dob} onChange={handleChange} required className="shadow-sm" />
          </div>
          <div>
            <label htmlFor="pob" className="block text-sm font-medium text-gray-700 mb-1">
              Place of Birth <span className="text-red-500">*</span>
            </label>
            <Input id="pob" name="pob" type="text" value={localFormData.pob} onChange={handleChange} placeholder="Enter place of birth" required className="shadow-sm" />
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
          </div>
        </div>

        {/* Third Row: Email Address, Phone Number (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input id="email" name="email" type="email" value={localFormData.email} onChange={handleChange} placeholder="Enter email address" required className="shadow-sm" />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" value={localFormData.phoneNumber || ''} onChange={handleChange} placeholder="e.g., +639123456789" className="shadow-sm" />
          </div>
        </div>

        {/* Fourth Row: Residential Address Section - Street Address and then Country/City/Province/Postal Code on one row */}
        <div className="grid grid-cols-1 gap-y-4 mb-6"> {/* Main grid for address sections */}
          <div> {/* Street Address takes full width */}
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input id="streetAddress" name="streetAddress" type="text" value={localFormData.streetAddress} onChange={handleChange} placeholder="Enter street address" required className="shadow-sm" />
          </div>

          {/* Fifth row: Country, City, Province, Postal Code - all in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4"> {/* Responsive grid */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <Input id="country" name="country" type="text" value="Philippines" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Input id="city" name="city" type="text" value="Iloilo City" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <Input id="province" name="province" type="text" value="Iloilo" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <Input id="postalCode" name="postalCode" type="text" value="5000" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
              </div>
          </div>
        </div>

        {/* Sixth Row: Confirmation and Button */}
        <div className="mb-6">
          <div className="flex items-start">
            <input id="declarationAccuracy" name="declarationAccuracy" type="checkbox" checked={localFormData.declarationAccuracy} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300 rounded mt-1" required />
            <label htmlFor="declarationAccuracy" className="ml-2 block text-sm text-gray-900">
              I confirm that all information provided is true and accurate to my best knowledge.{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-4">
        <Button onClick={handleNextClick} className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded">
          Next: Pet Details
        </Button>
      </div>
    </div>
  );
};

export default ClientDetailsStep;