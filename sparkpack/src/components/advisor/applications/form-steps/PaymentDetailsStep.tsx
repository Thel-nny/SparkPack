"use client";

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentDetails, ProductDetails } from '@/types/applicationFormData';
import PremiumSummary from './payment-details-subcomponents/PremiumSummary';
import { calculatePremium } from './ProductDetailsStep'; // Ensure this import is correct

interface PaymentDetailsStepProps {
  formData: PaymentDetails;
  productDetails: ProductDetails; // This now correctly includes petAge, petBreed, hasPreExistingConditions
  onUpdate: (data: Partial<PaymentDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const PaymentDetailsStep = forwardRef<any, PaymentDetailsStepProps>(
  ({ formData, productDetails, onUpdate, onPrev, onNext }, ref) => {
    const [premiumCalculation, setPremiumCalculation] = useState({
      baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const memoizedCalculatePremium = useCallback(() => {
      // Ensure all necessary product details are available and correctly typed for calculation.
      if (
        productDetails.productName &&
        productDetails.coverageAmount &&
        productDetails.deductible &&
        productDetails.reimbursementRate &&
        productDetails.paymentFrequency &&
        productDetails.selectedAddOns && // Check if selectedAddOns exists
        productDetails.donationPercentage !== undefined && // Check if donationPercentage exists
        productDetails.petAge !== undefined && // Check if petAge exists
        productDetails.petBreed && // Check if petBreed exists
        productDetails.hasPreExistingConditions !== undefined // Check if hasPreExistingConditions exists
      ) {
        const calculated = calculatePremium(
          productDetails.productName,
          productDetails.coverageAmount, // Pass as string
          productDetails.deductible,     // Pass as string
          productDetails.reimbursementRate, // Pass as string
          productDetails.paymentFrequency,
          productDetails.selectedAddOns,
          productDetails.donationPercentage,
          productDetails.petAge, // Pass as number
          productDetails.petBreed,
          productDetails.hasPreExistingConditions // Pass the boolean
        );
        setPremiumCalculation(calculated);
      } else {
        // Set to default or handle error state if crucial productDetails are missing
        setPremiumCalculation({ baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0 });
      }
    }, [productDetails]); // Dependency array includes productDetails to re-calculate when it changes

    useEffect(() => {
      memoizedCalculatePremium();
    }, [memoizedCalculatePremium]);

    const validateField = (name: keyof PaymentDetails, value: string): string => {
      let error = '';
      switch (name) {
        case 'paymentMethod':
          if (!value) error = 'Payment method is required.';
          break;
        case 'cardNumber':
          if (formData.paymentMethod === 'Credit/Debit Card' && (!value || !/^\d{16}$/.test(value.replace(/\s/g, '')))) {
            error = 'Please enter a valid 16-digit card number.';
          }
          break;
        case 'cardName':
          if (formData.paymentMethod === 'Credit/Debit Card' && !value) {
            error = 'Name on card is required.';
          }
          break;
        case 'expiryDate':
          // Validates MM/YY format and ensures it's a future date
          if (formData.paymentMethod === 'Credit/Debit Card' && (!value || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value))) {
            error = 'Please enter a valid expiry date (MM/YY).';
          } else if (formData.paymentMethod === 'Credit/Debit Card') {
            const [month, year] = value.split('/').map(Number);
            const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
            const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
              error = 'Expiry date cannot be in the past.';
            }
          }
          break;
        case 'cvv':
          if (formData.paymentMethod === 'Credit/Debit Card' && (!value || !/^\d{3,4}$/.test(value))) {
            error = 'Please enter a valid 3 or 4-digit CVV.';
          }
          break;
        case 'bankName':
          if (formData.paymentMethod === 'Bank Transfer' && !value) {
            error = 'Bank name is required.';
          }
          break;
        case 'accountNumber':
          if (formData.paymentMethod === 'Bank Transfer' && (!value || !/^\d+$/.test(value))) { // Basic numeric validation for account number
            error = 'Account number is required and should contain only digits.';
          }
          break;
        case 'accountName':
          if (formData.paymentMethod === 'Bank Transfer' && !value) {
            error = 'Account name is required.';
          }
          break;
        case 'gcashNumber':
          if (formData.paymentMethod === 'GCash' && (!value || !/^09\d{9}$/.test(value))) {
            error = 'Please enter a valid 11-digit GCash number (e.g., 09xxxxxxxxx).';
          }
          break;
        case 'gcashName':
          if (formData.paymentMethod === 'GCash' && !value) {
            error = 'GCash account name is required.';
          }
          break;
        default:
          break;
      }
      return error;
    };

    const validateStep = (): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      const methodError = validateField('paymentMethod', formData.paymentMethod);
      if (methodError) {
        newErrors.paymentMethod = methodError;
        isValid = false;
      }

      // Validate fields specific to the selected payment method
      if (formData.paymentMethod === 'Credit/Debit Card') {
        const fields: Array<keyof PaymentDetails> = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
        fields.forEach(field => {
          const error = validateField(field, formData[field] as string);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
      } else if (formData.paymentMethod === 'Bank Transfer') {
        const fields: Array<keyof PaymentDetails> = ['bankName', 'accountNumber', 'accountName'];
        fields.forEach(field => {
          const error = validateField(field, formData[field] as string);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
      } else if (formData.paymentMethod === 'GCash') {
        const fields: Array<keyof PaymentDetails> = ['gcashNumber', 'gcashName'];
        fields.forEach(field => {
          const error = validateField(field, formData[field] as string);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
      }
      // No specific fields to validate for "Cash/Cheque"

      setErrors(newErrors);
      return isValid;
    };

    useImperativeHandle(ref, () => ({
      validate: validateStep,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      onUpdate({
        [name as keyof PaymentDetails]: value,
      });

      // Clear related errors when payment method changes
      if (name === 'paymentMethod') {
        setErrors({}); // Clear all errors when changing method
        // You might want to reset payment-method specific fields here too
        onUpdate({
          cardNumber: '', cardName: '', expiryDate: '', cvv: '',
          bankName: '', accountNumber: '', accountName: '',
          gcashNumber: '', gcashName: ''
        });
      } else {
        // Validate individual field on change
        const error = validateField(name as keyof PaymentDetails, value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
      }
    };

    const handleNextClick = () => {
      if (validateStep()) {
        onNext();
      }
    };

    return (
      <div className="flex flex-col h-full justify-between p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg bg-white">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#8cc63f] border-b-2 pb-2 border-[#8cc63f]">Payment Details</h2>

          <p className="text-gray-700 mb-6 text-base">
            Review your estimated premium and choose your preferred payment method.
          </p>

          <div className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200">
            <PremiumSummary
              premiumCalculation={premiumCalculation}
              selectedPaymentFrequency={productDetails.paymentFrequency}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#342d47] mb-4">Choose Payment Method <span className="text-red-500">*</span></h3>
            {errors.paymentMethod && <p className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>}

            <div className="space-y-4">
              {/* Credit/Debit Card Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodCard"
                  name="paymentMethod"
                  value="Credit/Debit Card"
                  checked={formData.paymentMethod === 'Credit/Debit Card'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f] rounded-full cursor-pointer"
                />
                <Label htmlFor="paymentMethodCard" className="ml-2 block text-base font-medium text-gray-700 cursor-pointer">
                  Credit/Debit Card
                </Label>
              </div>
              {formData.paymentMethod === 'Credit/Debit Card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50 transition-all duration-300 ease-in-out">
                  <div>
                    <Label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</Label>
                    <Input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber || ''} onChange={handleChange} placeholder="XXXX XXXX XXXX XXXX" className={`rounded-md ${errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</Label>
                    <Input type="text" id="cardName" name="cardName" value={formData.cardName || ''} onChange={handleChange} placeholder="Full Name" className={`rounded-md ${errors.cardName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.cardName && <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</Label>
                    <Input type="text" id="expiryDate" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} placeholder="MM/YY" className={`rounded-md ${errors.expiryDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</Label>
                    <Input type="text" id="cvv" name="cvv" value={formData.cvv || ''} onChange={handleChange} placeholder="XXX" className={`rounded-md ${errors.cvv ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                  </div>
                </div>
              )}

              {/* Bank Transfer Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodBankTransfer"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={formData.paymentMethod === 'Bank Transfer'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f] rounded-full cursor-pointer"
                />
                <Label htmlFor="paymentMethodBankTransfer" className="ml-2 block text-base font-medium text-gray-700 cursor-pointer">
                  Bank Transfer (Instructions will be provided)
                </Label>
              </div>
              {formData.paymentMethod === 'Bank Transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50 transition-all duration-300 ease-in-out">
                  <div>
                    <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</Label>
                    <Input type="text" id="bankName" name="bankName" value={formData.bankName || ''} onChange={handleChange} placeholder="e.g., BDO, BPI" className={`rounded-md ${errors.bankName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.bankName && <p className="mt-1 text-sm text-red-500">{errors.bankName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</Label>
                    <Input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} placeholder="e.g., 001234567890" className={`rounded-md ${errors.accountNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.accountNumber && <p className="mt-1 text-sm text-red-500">{errors.accountNumber}</p>}
                  </div>
                  <div className="col-span-full">
                    <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account Name</Label>
                    <Input type="text" id="accountName" name="accountName" value={formData.accountName || ''} onChange={handleChange} placeholder="Full Name of Account Holder" className={`rounded-md ${errors.accountName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.accountName && <p className="mt-1 text-sm text-red-500">{errors.accountName}</p>}
                  </div>
                </div>
              )}

              {/* GCash Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodGcash"
                  name="paymentMethod"
                  value="GCash"
                  checked={formData.paymentMethod === 'GCash'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f] rounded-full cursor-pointer"
                />
                <Label htmlFor="paymentMethodGcash" className="ml-2 block text-base font-medium text-gray-700 cursor-pointer">
                  GCash
                </Label>
              </div>
              {formData.paymentMethod === 'GCash' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50 transition-all duration-300 ease-in-out">
                  <div>
                    <Label htmlFor="gcashNumber" className="block text-sm font-medium text-gray-700 mb-1">GCash Number</Label>
                    <Input type="text" id="gcashNumber" name="gcashNumber" value={formData.gcashNumber || ''} onChange={handleChange} placeholder="e.g., 0917XXXXXXX" className={`rounded-md ${errors.gcashNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.gcashNumber && <p className="mt-1 text-sm text-red-500">{errors.gcashNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gcashName" className="block text-sm font-medium text-gray-700 mb-1">GCash Account Name</Label>
                    <Input type="text" id="gcashName" name="gcashName" value={formData.gcashName || ''} onChange={handleChange} placeholder="Full Name of GCash Account Holder" className={`rounded-md ${errors.gcashName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`} />
                    {errors.gcashName && <p className="mt-1 text-sm text-red-500">{errors.gcashName}</p>}
                  </div>
                </div>
              )}

              {/* Cash/Cheque Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodCashCheque"
                  name="paymentMethod"
                  value="Cash/Cheque"
                  checked={formData.paymentMethod === 'Cash/Cheque'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f] rounded-full cursor-pointer"
                />
                <Label htmlFor="paymentMethodCashCheque" className="ml-2 block text-base font-medium text-gray-700 cursor-pointer">
                  Cash / Cheque (For in-person payment)
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
          <Button
            onClick={onPrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md shadow-sm transition-colors duration-200 ease-in-out"
          >
            Previous: Product Details
          </Button>

          <Button
            type="button"
            onClick={handleNextClick}
            className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded-md shadow-sm transition-colors duration-200 ease-in-out"
          >
            Next: Review & Confirm
          </Button>
        </div>
      </div>
    );
  }
);

PaymentDetailsStep.displayName = 'PaymentDetailsStep';

export default PaymentDetailsStep;