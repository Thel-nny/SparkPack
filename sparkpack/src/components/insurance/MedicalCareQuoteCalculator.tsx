"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { medicalCareQuoteConfig, commonBreeds } from '@/data/quoteConfig'; // Import config

interface MedicalCareQuoteCalculatorProps {
  initialTierId: 'basic-care-essential' | 'basic-care-plus' | 'basic-care-premium';
}

const MedicalCareQuoteCalculator: React.FC<MedicalCareQuoteCalculatorProps> = ({ initialTierId }) => {
  const [selectedTierId, setSelectedTierId] = useState(initialTierId);
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [petAge, setPetAge] = useState(1); // in years
  const [petBreed, setPetBreed] = useState('Aspin');
  const [paymentOption, setPaymentOption] = useState<'monthly' | 'annual'>('monthly');
  const [estimatedMonthlyPremium, setEstimatedMonthlyPremium] = useState(0);

  // Derive current tier details for display
  const currentDeductible = medicalCareQuoteConfig.deductibleMapping[selectedTierId];
  const currentReimbursement = medicalCareQuoteConfig.reimbursementMapping[selectedTierId];
  const currentAnnualLimit = {
      'basic-care-essential': '₱15,000',
      'basic-care-plus': '₱25,000',
      'basic-care-premium': '₱35,000'
  }[selectedTierId];
 // Recalculate if these change

  const calculatePremium = useCallback(() => {
    let premium = medicalCareQuoteConfig.basePremiums[selectedTierId];

    // Apply pet type multiplier
    premium *= medicalCareQuoteConfig.petTypeMultipliers[petType];

    // Apply age multiplier
    // Clamp age to max available multiplier if pet is older than config covers explicitly
    const effectiveAge = Math.min(petAge, Math.max(...Object.keys(medicalCareQuoteConfig.ageMultipliers).map(Number)));
    premium *= medicalCareQuoteConfig.ageMultipliers[effectiveAge] || 1;

    // Apply breed multiplier
    premium *= medicalCareQuoteConfig.breedMultipliers[petBreed] || 1;

    setEstimatedMonthlyPremium(Math.max(0, Math.round(premium)));
  }, [selectedTierId, petType, petAge, petBreed]);

    useEffect(() => {
    calculatePremium();
  }, [calculatePremium]);

  const getAnnualPremium = () => {
    return estimatedMonthlyPremium * 12;
  };

  const tierOptions = [
    { id: 'basic-care-essential', name: 'Tier 1: Basic Care Essential' },
    { id: 'basic-care-plus', name: 'Tier 2: Basic Care Plus' },
    { id: 'basic-care-premium', name: 'Tier 3: Basic Care Premium' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-[#342d47] mb-6 text-center">
        Get Your Medical Care Plan Estimate
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="tierSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Choose Your Tier
          </label>
          <select
            id="tierSelect"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md"
            value={selectedTierId}
            onChange={(e) => setSelectedTierId(e.target.value as typeof initialTierId)}
          >
            {tierOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="petType" className="block text-sm font-medium text-gray-700 mb-1">
            Pet Type
          </label>
          <select
            id="petType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md"
            value={petType}
            onChange={(e) => setPetType(e.target.value as 'dog' | 'cat')}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>

        <div>
          <label htmlFor="petAge" className="block text-sm font-medium text-gray-700 mb-1">
            Pet Age (Years)
          </label>
          <input
            type="number"
            id="petAge"
            min="0"
            max="12" // Based on your current age multiplier config
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f] p-2"
            value={petAge}
            onChange={(e) => setPetAge(parseInt(e.target.value) || 0)} // Ensure it's a number
          />
        </div>

        <div>
          <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700 mb-1">
            Pet Breed
          </label>
          <select
            id="petBreed"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md"
            value={petBreed}
            onChange={(e) => setPetBreed(e.target.value)}
          >
            {commonBreeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Display selected Tier's details */}
      <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Selected Tier Details:</h4>
        <p className="text-sm text-gray-600">
            <span className="font-medium">Per-Incident Deductible:</span> {currentDeductible}
        </p>
        <p className="text-sm text-gray-600">
            <span className="font-medium">Reimbursement Rate:</span> {currentReimbursement}
        </p>
        <p className="text-sm text-gray-600">
            <span className="font-medium">Annual Coverage Limit:</span> {currentAnnualLimit}
        </p>
      </div>

      {/* Payment Option Toggle */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
            paymentOption === 'monthly'
              ? 'bg-[#8cc63f] text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setPaymentOption('monthly')}
        >
          Pay Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
            paymentOption === 'annual'
              ? 'bg-[#8cc63f] text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setPaymentOption('annual')}
        >
          Pay Annually
        </button>
      </div>

      <div className="text-center bg-[#f5f8f3] p-4 rounded-md">
        <p className="text-xl font-semibold text-[#342d47]">
          Estimated {paymentOption === 'monthly' ? 'Monthly' : 'Annual'} Premium:{" "}
          <span className="text-[#8cc63f]">
            PHP {paymentOption === 'monthly' ? estimatedMonthlyPremium.toLocaleString() : getAnnualPremium().toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          *This is an estimate for Iloilo only. Final premium may vary based on full application details and current promotions.
        </p>
      </div>

      <div className="text-center mt-6">
        <button className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg">
          Proceed to Full Application
        </button>
      </div>
    </div>
  );
};

export default MedicalCareQuoteCalculator;