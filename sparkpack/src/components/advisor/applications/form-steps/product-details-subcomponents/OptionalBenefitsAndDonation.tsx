import React from 'react';

import { AddOnDefinition, ProductDetails } from '@/types/formData'; // Assuming these types are defined here

interface OptionalBenefitsAndDonationProps {
  localFormData: ProductDetails;
  filteredAddOns: AddOnDefinition[];
  oneTimeAddOns: AddOnDefinition[];
  annualAddOns: AddOnDefinition[];
  donationPercentages: number[];
  handleAddOnToggle: (addOn: AddOnDefinition) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const OptionalBenefitsAndDonation: React.FC<OptionalBenefitsAndDonationProps> = ({
  localFormData,
  filteredAddOns,
  oneTimeAddOns,
  annualAddOns,
  donationPercentages,
  handleAddOnToggle,
  handleChange,
}) => {
  return (
    <>
      <h3 className="text-xl font-bold mb-6 text-[#8cc63f]">
        Optional Benefits (Add-ons) & Donation
      </h3>

      {filteredAddOns.length > 0 ? (
        <div className="space-y-6">
          {oneTimeAddOns.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">One-Time Add-ons</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {oneTimeAddOns.map(addOn => (
                  <div
                    key={addOn.id}
                    className={`p-4 border rounded-lg flex justify-between items-center transition-all duration-200
                      ${localFormData.selectedAddOns.some(item => item.id === addOn.id)
                        ? 'border-[#8cc63f] bg-[#e6f4d9]'
                        : 'border-gray-200 bg-white hover:shadow-sm'
                      }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{addOn.name}</p>
                      <p className="text-sm text-gray-600">{addOn.description}</p>
                      <p className="text-sm font-bold text-gray-700">₱{addOn.price.toLocaleString()} (One-time)</p>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-[#8cc63f] rounded"
                      checked={localFormData.selectedAddOns.some(item => item.id === addOn.id)}
                      onChange={() => handleAddOnToggle(addOn)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {annualAddOns.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Annual Add-ons</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {annualAddOns.map(addOn => (
                  <div
                    key={addOn.id}
                    className={`p-4 border rounded-lg flex justify-between items-center transition-all duration-200
                      ${localFormData.selectedAddOns.some(item => item.id === addOn.id)
                        ? 'border-[#8cc63f] bg-[#e6f4d9]'
                        : 'border-gray-200 bg-white hover:shadow-sm'
                      }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{addOn.name}</p>
                      <p className="text-sm text-gray-600">{addOn.description}</p>
                      <p className="text-sm font-bold text-gray-700">₱{addOn.price.toLocaleString()} (Annual)</p>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-[#8cc63f] rounded"
                      checked={localFormData.selectedAddOns.some(item => item.id === addOn.id)}
                      onChange={() => handleAddOnToggle(addOn)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No optional add-ons available for the selected product.</p>
      )}

      <div className="mt-8">
        <label htmlFor="donationPercentage" className="block text-lg font-bold text-[#342d47] mb-2">
          Make a Donation to Pet Charities
        </label>
        <p className="text-gray-700 mb-4">
          Support local pet shelters and rescue organizations by adding a small percentage to your annual premium. Every peso helps!
        </p>
        <select
          id="donationPercentage"
          name="donationPercentage"
          value={localFormData.donationPercentage}
          onChange={handleChange}
          className="mt-1 block w-full md:w-1/2 lg:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
        >
          {donationPercentages.map(percentage => (
            <option key={percentage} value={percentage}>{percentage}%</option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-2">
          Your selected donation percentage will be added to your annual premium.
        </p>
      </div>
    </>
  );
};

export default OptionalBenefitsAndDonation;