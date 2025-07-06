"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { PaymentDetails, ProductDetails } from '@/types/formData'; // Import ProductDetails as we need it to calculate premium

import PremiumSummary from './payment-details-subcomponents/PremiumSummary';

import { calculatePremium } from './ProductDetailsStep';


interface PaymentDetailsStepProps {
  formData: PaymentDetails; // This component handles PaymentDetails specific data
  productDetails: ProductDetails; // We need the *full* ProductDetails to calculate premium
  onUpdate: (data: Partial<PaymentDetails>) => void;
  onPrev: () => void; // Moves back to ProductDetailsStep
  onNext: () => void; // Moves to next step (e.g., Confirmation)
}

const PaymentDetailsStep: React.FC<PaymentDetailsStepProps> = ({
  formData,
  productDetails, // Receive productDetails from parent
  onUpdate,
  onPrev,
  onNext,
}) => {
  const [localFormData, setLocalFormData] = useState<PaymentDetails>(formData);
  const [premiumCalculation, setPremiumCalculation] = useState({
    baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0
  });

  // Recalculate premium whenever productDetails change
  const memoizedCalculatePremium = useCallback(() => {
    // Ensure all product details are available for calculation
    if (productDetails.productName && productDetails.coverageAmount && productDetails.deductible &&
        productDetails.reimbursementRate && productDetails.paymentFrequency) {
      const calculated = calculatePremium(
        productDetails.productName,
        productDetails.coverageAmount,
        productDetails.deductible,
        productDetails.reimbursementRate,
        productDetails.paymentFrequency,
        productDetails.selectedAddOns,
        productDetails.donationPercentage
      );
      setPremiumCalculation(calculated);
    } else {
      setPremiumCalculation({ baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0 });
    }
  }, [productDetails]); // Dependency on productDetails

  useEffect(() => {
    memoizedCalculatePremium();
  }, [memoizedCalculatePremium]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(localFormData);
      onNext();
    }
  };

  const validateForm = (): boolean => {
    if (!localFormData.paymentMethod) {
      alert('Please select a payment method.');
      return false;
    }

    if (localFormData.paymentMethod === 'Credit/Debit Card') {
      if (!localFormData.cardNumber || localFormData.cardNumber.length < 16) {
        alert('Please enter a valid 16-digit card number.');
        return false;
      }
      if (!localFormData.cardName) {
        alert('Please enter the name on the card.');
        return false;
      }
      if (!localFormData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(localFormData.expiryDate)) {
        alert('Please enter a valid expiry date (MM/YY).');
        return false;
      }
      if (!localFormData.cvv || localFormData.cvv.length < 3 || localFormData.cvv.length > 4) {
        alert('Please enter a valid 3 or 4-digit CVV.');
        return false;
      }
    } else if (localFormData.paymentMethod === 'Bank Transfer') {
      if (!localFormData.bankName) {
        alert('Please enter the bank name for bank transfer.');
        return false;
      }
      if (!localFormData.accountNumber) {
        alert('Please enter the account number for bank transfer.');
        return false;
      }
      if (!localFormData.accountName) {
        alert('Please enter the account name for bank transfer.');
        return false;
      }
    } else if (localFormData.paymentMethod === 'GCash') {
      if (!localFormData.gcashNumber || localFormData.gcashNumber.length < 11 || !/^\d+$/.test(localFormData.gcashNumber)) {
        alert('Please enter a valid 11-digit GCash number.');
        return false;
      }
      if (!localFormData.gcashName) {
        alert('Please enter the GCash account name.');
        return false;
      }
    }

    return true;
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Payment Details</h2>

        <p className="text-gray-700 mb-6">
          Review your estimated premium and choose your preferred payment method.
        </p>

        {/* Premium Summary is now here */}
        <div className="mb-8">
          <PremiumSummary
            premiumCalculation={premiumCalculation}
            selectedPaymentFrequency={productDetails.paymentFrequency} // Use payment frequency from productDetails
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-bold text-[#342d47] mb-4">Choose Payment Method</h3>

          <div className="space-y-4">
            {/* Credit/Debit Card */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodCard"
                name="paymentMethod"
                value="Credit/Debit Card"
                checked={localFormData.paymentMethod === 'Credit/Debit Card'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodCard" className="ml-2 block text-sm font-medium text-gray-700">
                Credit/Debit Card
              </Label>
            </div>
            {localFormData.paymentMethod === 'Credit/Debit Card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <Label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</Label>
                  <Input type="text" id="cardNumber" name="cardNumber" value={localFormData.cardNumber || ''} onChange={handleChange} placeholder="XXXX XXXX XXXX XXXX" required />
                </div>
                <div>
                  <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</Label>
                  <Input type="text" id="cardName" name="cardName" value={localFormData.cardName || ''} onChange={handleChange} placeholder="Full Name" required />
                </div>
                <div>
                  <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</Label>
                  <Input type="text" id="expiryDate" name="expiryDate" value={localFormData.expiryDate || ''} onChange={handleChange} placeholder="MM/YY" required />
                </div>
                <div>
                  <Label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</Label>
                  <Input type="text" id="cvv" name="cvv" value={localFormData.cvv || ''} onChange={handleChange} placeholder="XXX" required />
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodBankTransfer"
                name="paymentMethod"
                value="Bank Transfer"
                checked={localFormData.paymentMethod === 'Bank Transfer'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodBankTransfer" className="ml-2 block text-sm font-medium text-gray-700">
                Bank Transfer (Instructions will be provided)
              </Label>
            </div>
            {localFormData.paymentMethod === 'Bank Transfer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</Label>
                  <Input type="text" id="bankName" name="bankName" value={localFormData.bankName || ''} onChange={handleChange} placeholder="e.g., BDO, BPI" required />
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</Label>
                  <Input type="text" id="accountNumber" name="accountNumber" value={localFormData.accountNumber || ''} onChange={handleChange} placeholder="e.g., 001234567890" required />
                </div>
                <div className="col-span-full"> {/* Make this span full width */}
                  <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account Name</Label>
                  <Input type="text" id="accountName" name="accountName" value={localFormData.accountName || ''} onChange={handleChange} placeholder="Full Name of Account Holder" required />
                </div>
              </div>
            )}

            {/* GCash */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodGcash"
                name="paymentMethod"
                value="GCash"
                checked={localFormData.paymentMethod === 'GCash'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodGcash" className="ml-2 block text-sm font-medium text-gray-700">
                GCash
              </Label>
            </div>
            {localFormData.paymentMethod === 'GCash' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <Label htmlFor="gcashNumber" className="block text-sm font-medium text-gray-700 mb-1">GCash Number</Label>
                  <Input type="text" id="gcashNumber" name="gcashNumber" value={localFormData.gcashNumber || ''} onChange={handleChange} placeholder="e.g., 0917XXXXXXX" required />
                </div>
                <div>
                  <Label htmlFor="gcashName" className="block text-sm font-medium text-gray-700 mb-1">GCash Account Name</Label>
                  <Input type="text" id="gcashName" name="gcashName" value={localFormData.gcashName || ''} onChange={handleChange} placeholder="Full Name of GCash Account Holder" required />
                </div>
              </div>
            )}

             {/* Cash/Cheque - no additional fields for now */}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentMethodCashCheque"
                name="paymentMethod"
                value="Cash/Cheque"
                checked={localFormData.paymentMethod === 'Cash/Cheque'}
                onChange={handleChange}
                className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
              />
              <Label htmlFor="paymentMethodCashCheque" className="ml-2 block text-sm font-medium text-gray-700">
                Cash / Cheque (For in-person payment)
              </Label>
            </div>

          </div>
        </form>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          onClick={onPrev} // Go back to Product Details step
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Previous: Product Details
        </Button>

        <Button
          type="submit" // This button will trigger form submission
          onClick={handleSubmit} // Call handleSubmit when this button is clicked
          className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
        >
          Next: Review & Confirm
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetailsStep;