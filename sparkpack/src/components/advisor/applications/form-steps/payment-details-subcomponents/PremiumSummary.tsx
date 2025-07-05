import React from 'react';

interface PremiumSummaryProps {
  premiumCalculation: {
    baseAnnual: number;
    annualTotal: number;
    monthlyTotal: number;
    oneTimeTotal: number;
    donationAmount: number;
  };
  selectedPaymentFrequency: string;
}

const PremiumSummary: React.FC<PremiumSummaryProps> = ({ premiumCalculation, selectedPaymentFrequency }) => {
  if (premiumCalculation.annualTotal === 0 && premiumCalculation.oneTimeTotal === 0) {
    return (
      <div className="text-center p-6 bg-yellow-50 rounded-lg text-yellow-800 border border-yellow-200">
        <p className="font-semibold">Please select and configure a product to see the premium summary.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-[#8cc63f] mb-4">Your Estimated Premium Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="col-span-full">
          <p className="text-lg font-semibold mb-2">Policy Costs:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Base Annual Premium: <span className="font-bold">₱{premiumCalculation.baseAnnual.toLocaleString()}</span></li>
            {premiumCalculation.annualTotal - premiumCalculation.baseAnnual - premiumCalculation.donationAmount > 0 && (
              <li>Annual Add-ons Cost: <span className="font-bold">₱{(premiumCalculation.annualTotal - premiumCalculation.baseAnnual - premiumCalculation.donationAmount).toLocaleString()}</span></li>
            )}
            {premiumCalculation.donationAmount > 0 && (
              <li>Donation to Charity: <span className="font-bold">₱{premiumCalculation.donationAmount.toLocaleString()}</span></li>
            )}
          </ul>
        </div>

        {premiumCalculation.oneTimeTotal > 0 && (
          <div className="col-span-full mt-4">
            <p className="text-lg font-semibold mb-2">One-Time Costs:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>One-Time Add-ons: <span className="font-bold">₱{premiumCalculation.oneTimeTotal.toLocaleString()}</span></li>
            </ul>
          </div>
        )}

        <div className="col-span-full mt-6 p-4 bg-[#e6f4d9] border border-[#8cc63f] rounded-md text-center">
          <p className="text-2xl font-bold text-[#342d47]">
            Total Annual Premium:{' '}
            <span className="text-[#8cc63f]">₱{premiumCalculation.annualTotal.toLocaleString()}</span>
          </p>
          {selectedPaymentFrequency === 'Monthly' && (
            <p className="text-xl font-bold text-[#342d47] mt-2">
              Monthly Premium:{' '}
              <span className="text-[#8cc63f]">₱{premiumCalculation.monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-base text-gray-600"> (includes 5% surcharge)</span>
            </p>
          )}
        </div>

        <div className="col-span-full mt-4 text-sm text-gray-500 italic">
          <p>This is an estimated premium. Your final premium may vary based on a full review of your application and pet's medical history. One-time costs are billed separately at the start of your policy.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumSummary;