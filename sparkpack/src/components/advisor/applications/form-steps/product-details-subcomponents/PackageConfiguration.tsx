import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming Label component exists
import { ProductDetails, ProductOption } from '@/types/applicationFormData'; // Updated import path

interface PackageConfigurationProps {
  formData: ProductDetails; // Changed from localFormData
  selectedProductData: ProductOption | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: Record<string, string>; // Added errors prop
}

const PackageConfiguration: React.FC<PackageConfigurationProps> = ({
  formData, // Changed from localFormData
  selectedProductData,
  handleChange,
  errors, // Destructure errors
}) => {
  if (!selectedProductData) {
    return (
      <p className="text-red-500">Please go back to &quot;Select Product&quot; to choose a base package first.</p>
    );
  }

  return (
    <>
      <h3 className="text-xl font-bold mb-6 text-[#8cc63f]">
        Configure Your {selectedProductData.name} Package
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div>
          <Label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Amount <span className="text-red-500">*</span>
          </Label>
          <select
            id="coverageAmount"
            name="coverageAmount"
            value={formData.coverageAmount}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.coverageAmount ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
          >
            <option value="">Select Coverage</option>
            {selectedProductData.coverageOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.coverageAmount && <p className="mt-1 text-sm text-red-500">{errors.coverageAmount}</p>}
        </div>
        <div>
          <Label htmlFor="deductible" className="block text-sm font-medium text-gray-700 mb-1">
            Deductible <span className="text-red-500">*</span>
            <span className="text-gray-500 text-xs ml-2">(Amount you pay before insurance covers)</span>
          </Label>
          <select
            id="deductible"
            name="deductible"
            value={formData.deductible}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.deductible ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
          >
            <option value="">Select Deductible</option>
            {selectedProductData.deductibleOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.deductible && <p className="mt-1 text-sm text-red-500">{errors.deductible}</p>}
        </div>
        <div>
          <Label htmlFor="reimbursementRate" className="block text-sm font-medium text-gray-700 mb-1">
            Reimbursement Rate <span className="text-red-500">*</span>
            <span className="text-gray-500 text-xs ml-2">(Percentage of vet bill covered by insurance)</span>
          </Label>
          <select
            id="reimbursementRate"
            name="reimbursementRate"
            value={formData.reimbursementRate}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.reimbursementRate ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
          >
            <option value="">Select Rate</option>
            {selectedProductData.reimbursementOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.reimbursementRate && <p className="mt-1 text-sm text-red-500">{errors.reimbursementRate}</p>}
        </div>
        <div>
          <Label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Frequency <span className="text-red-500">*</span>
          </Label>
          <select
            id="paymentFrequency"
            name="paymentFrequency"
            value={formData.paymentFrequency}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.paymentFrequency ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm`}
          >
            <option value="">Select Frequency</option>
            {selectedProductData.paymentFreqOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.paymentFrequency && <p className="mt-1 text-sm text-red-500">{errors.paymentFrequency}</p>}
        </div>
        <div>
          <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Policy Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`mt-1 block w-full ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
        </div>
        <div>
          <Label htmlFor="coverageLength" className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Length
          </Label>
          <Input
            type="text"
            id="coverageLength"
            name="coverageLength"
            value={formData.coverageLength}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
            readOnly // Assuming this is fixed to 1 Year for now
          />
        </div>
      </div>
    </>
  );
};

export default PackageConfiguration;