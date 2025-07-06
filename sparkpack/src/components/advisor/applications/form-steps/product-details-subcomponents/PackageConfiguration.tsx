import React from 'react';
import { Input } from '@/components/ui/input';
import { ProductDetails, ProductOption } from '@/types/formData'; // Assuming ProductDetails and ProductOption are defined here

interface PackageConfigurationProps {
  localFormData: ProductDetails;
  selectedProductData: ProductOption | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PackageConfiguration: React.FC<PackageConfigurationProps> = ({
  localFormData,
  selectedProductData,
  handleChange,
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
          <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Amount <span className="text-red-500">*</span>
          </label>
          <select
            id="coverageAmount"
            name="coverageAmount"
            value={localFormData.coverageAmount}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
            required
          >
            <option value="">Select Coverage</option>
            {selectedProductData.coverageOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deductible" className="block text-sm font-medium text-gray-700 mb-1">
            Deductible <span className="text-red-500">*</span>
            <span className="text-gray-500 text-xs ml-2">(Amount you pay before insurance covers)</span>
          </label>
          <select
            id="deductible"
            name="deductible"
            value={localFormData.deductible}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
            required
          >
            <option value="">Select Deductible</option>
            {selectedProductData.deductibleOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="reimbursementRate" className="block text-sm font-medium text-gray-700 mb-1">
            Reimbursement Rate <span className="text-red-500">*</span>
            <span className="text-gray-500 text-xs ml-2">(Percentage of vet bill covered by insurance)</span>
          </label>
          <select
            id="reimbursementRate"
            name="reimbursementRate"
            value={localFormData.reimbursementRate}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
            required
          >
            <option value="">Select Rate</option>
            {selectedProductData.reimbursementOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Frequency <span className="text-red-500">*</span>
          </label>
          <select
            id="paymentFrequency"
            name="paymentFrequency"
            value={localFormData.paymentFrequency}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
            required
          >
            <option value="">Select Frequency</option>
            {selectedProductData.paymentFreqOptions?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Policy Start Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={localFormData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="coverageLength" className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Length
          </label>
          <Input
            type="text"
            id="coverageLength"
            name="coverageLength"
            value={localFormData.coverageLength}
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