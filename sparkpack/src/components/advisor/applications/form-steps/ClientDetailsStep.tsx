"use client";

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming you have a Label component
import { ClientDetails } from '@/types/applicationFormData'; // Updated import path

interface ClientDetailsStepProps {
  formData: ClientDetails;
  onUpdate: (data: Partial<ClientDetails>) => void;
  onNext: () => void;
}

// Use forwardRef to expose the validate function to the parent (NewApplicationForm)
const ClientDetailsStep = forwardRef<any, ClientDetailsStepProps>(
  ({ formData, onUpdate, onNext }, ref) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validation function for individual fields
    const validateField = (name: keyof ClientDetails, value: string | boolean): string => {
      let error = '';
      switch (name) {
        case 'title':
          if (!value) error = 'Title is required.';
          break;
        case 'firstName':
          if (!value) error = 'First Name is required.';
          break;
        case 'lastName':
          if (!value) error = 'Last Name is required.';
          break;
        case 'dob':
          if (!value) error = 'Date of Birth is required.';
          break;
        case 'pob':
          if (!value) error = 'Place of Birth is required.';
          break;
        case 'gender':
          if (!value) error = 'Gender is required.';
          break;
        case 'email':
          if (!value) {
            error = 'Email Address is required.';
          } else if (!/\S+@\S+\.\S+/.test(value as string)) {
            error = 'Invalid email format.';
          }
          break;
        case 'streetAddress':
          if (!value) error = 'Street Address is required.';
          break;
        case 'declarationAccuracy':
          if (!value) error = 'You must confirm the declaration.';
          break;
        // phoneNumber, country, city, province, postalCode are handled as optional or disabled
        default:
          break;
      }
      return error;
    };

    // Comprehensive validation for the entire step
    const validateStep = (): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      // Fields that are required for this step
      const requiredFields: Array<keyof ClientDetails> = [
        'title', 'firstName', 'lastName', 'dob', 'pob', 'gender', 'email',
        'streetAddress', 'declarationAccuracy'
      ];

      requiredFields.forEach((field) => {
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
      validate: validateStep,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      let newValue: string | boolean;

      // Safely access 'checked' property only if the input type is checkbox
      if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
      } else {
        newValue = value;
      }

      onUpdate({
        [name as keyof ClientDetails]: newValue,
      });

      // Validate field on change and update errors state
      const error = validateField(name as keyof ClientDetails, newValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const handleNextClick = () => {
      if (validateStep()) { // Validate before proceeding
        onNext();
      }
    };

    return (
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Header: Personal Information */}
          <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Personal Information</h2>

          {/* First Row: Title, First Name, Middle Name, Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </Label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2 focus:border-[#8cc63f] focus:ring-[#8cc63f] sm:text-sm`}
              >
                <option value="">Select Title</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
              </select>
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={`shadow-sm ${errors.firstName ? 'border-red-500' : ''}`} />
              {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
            </div>
            {/* Middle Name */}
            <div>
              <Label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name (Optional)
              </Label>
              <Input id="middleName" name="middleName" type="text" value={formData.middleName || ''} onChange={handleChange} className="shadow-sm" />
            </div>
            {/* Last Name */}
            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={`shadow-sm ${errors.lastName ? 'border-red-500' : ''}`} />
              {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Second Row: Date of Birth, Place of Birth, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} className={`shadow-sm ${errors.dob ? 'border-red-500' : ''}`} />
              {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
            </div>
            {/* Place of Birth */}
            <div>
              <Label htmlFor="pob" className="block text-sm font-medium text-gray-700 mb-1">
                Place of Birth <span className="text-red-500">*</span>
              </Label>
              <Input id="pob" name="pob" type="text" value={formData.pob || ''} onChange={handleChange} placeholder="Enter place of birth" className={`shadow-sm ${errors.pob ? 'border-red-500' : ''}`} />
              {errors.pob && <p className="mt-1 text-sm text-red-500">{errors.pob}</p>}
            </div>
            {/* Gender */}
            <div className="flex flex-col justify-start">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-6 mt-2">
                <div className="flex items-center">
                  <input id="genderMale" name="gender" type="radio" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                  <Label htmlFor="genderMale" className="ml-2 block text-sm text-gray-900">Male</Label>
                </div>
                <div className="flex items-center">
                  <input id="genderFemale" name="gender" type="radio" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300" />
                  <Label htmlFor="genderFemale" className="ml-2 block text-sm text-gray-900">Female</Label>
                </div>
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
            </div>
          </div>

          {/* Third Row: Email Address, Phone Number, Allow Phone Collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            {/* Email Address */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" className={`shadow-sm ${errors.email ? 'border-red-500' : ''}`} />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="e.g., +639123456789" className="shadow-sm" />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="allowPhoneCollection"
                  name="allowPhoneCollection"
                  checked={formData.allowPhoneCollection}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300 rounded"
                />
                <Label htmlFor="allowPhoneCollection" className="ml-2 block text-sm text-gray-900">Allow phone collection</Label>
              </div>
            </div>
          </div>

          {/* Fourth Row: Residential Address Section - Street Address and then Country/City/Province/Postal Code on one row */}
          <div className="grid grid-cols-1 gap-y-4 mb-6"> {/* Main grid for address sections */}
            <div> {/* Street Address takes full width */}
              <Label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input id="streetAddress" name="streetAddress" type="text" value={formData.streetAddress} onChange={handleChange} placeholder="Enter street address" className={`shadow-sm ${errors.streetAddress ? 'border-red-500' : ''}`} />
              {errors.streetAddress && <p className="mt-1 text-sm text-red-500">{errors.streetAddress}</p>}
            </div>

            {/* Fifth row: Country, City, Province, Postal Code - all in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4"> {/* Responsive grid */}
                <div>
                  <Label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</Label>
                  <Input id="country" name="country" type="text" value="Philippines" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
                </div>
                <div>
                  <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</Label>
                  <Input id="city" name="city" type="text" value="Iloilo City" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
                </div>
                <div>
                  <Label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province</Label>
                  <Input id="province" name="province" type="text" value="Iloilo" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</Label>
                  <Input id="postalCode" name="postalCode" type="text" value="5000" disabled className="bg-gray-100 cursor-not-allowed shadow-sm" />
                </div>
            </div>
          </div>

          {/* Sixth Row: Confirmation and Button */}
          <div className="mb-6">
            <div className="flex items-start">
              <input id="declarationAccuracy" name="declarationAccuracy" type="checkbox" checked={formData.declarationAccuracy} onChange={handleChange} className={`h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300 rounded mt-1 ${errors.declarationAccuracy ? 'border-red-500' : ''}`} />
              <Label htmlFor="declarationAccuracy" className="ml-2 block text-sm text-gray-900">
                I confirm that all information provided is true and accurate to my best knowledge.{' '}
                <span className="text-red-500">*</span>
              </Label>
            </div>
            {errors.declarationAccuracy && <p className="mt-1 text-sm text-red-500">{errors.declarationAccuracy}</p>}
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
  }
);

ClientDetailsStep.displayName = 'ClientDetailsStep'; // Add display name for forwardRef

export default ClientDetailsStep;