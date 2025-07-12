"use client";

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Updated import paths to use applicationFormData.ts
import { PaymentDetails, ProductDetails } from '@/types/applicationFormData'; 

import PremiumSummary from './payment-details-subcomponents/PremiumSummary';

// Ensure calculatePremium is imported from ProductDetailsStep, as it's defined there
import { calculatePremium } from './ProductDetailsStep';


interface PaymentDetailsStepProps {
  formData: PaymentDetails; // This component handles PaymentDetails specific data
  productDetails: ProductDetails; // We need the *full* ProductDetails to calculate premium
  onUpdate: (data: Partial<PaymentDetails>) => void;
  onPrev: () => void; // Moves back to ProductDetailsStep
  onNext: () => void; // Moves to next step (e.g., Confirmation)
}

const PaymentDetailsStep = forwardRef<any, PaymentDetailsStepProps>(
  ({ formData, productDetails, onUpdate, onPrev, onNext }, ref) => {
    const [premiumCalculation, setPremiumCalculation] = useState({
      baseAnnual: 0, annualTotal: 0, monthlyTotal: 0, oneTimeTotal: 0, donationAmount: 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({}); // State for inline errors

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

    // Validation function for individual fields
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
          if (formData.paymentMethod === 'Credit/Debit Card' && (!value || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value))) {
            error = 'Please enter a valid expiry date (MM/YY).';
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
          if (formData.paymentMethod === 'Bank Transfer' && !value) {
            error = 'Account number is required.';
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

    // Comprehensive validation for the entire step
    const validateStep = (): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      // Validate paymentMethod first
      const methodError = validateField('paymentMethod', formData.paymentMethod);
      if (methodError) {
        newErrors.paymentMethod = methodError;
        isValid = false;
      }

      // Validate fields based on selected payment method
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

      setErrors(newErrors);
      return isValid;
    };

    // Expose the validate function to the parent component via ref
    useImperativeHandle(ref, () => ({
      validate: validateStep,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      onUpdate({
        [name as keyof PaymentDetails]: value,
      });

      // Validate field on change and update errors state
      const error = validateField(name as keyof PaymentDetails, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const handleNextClick = () => {
      if (validateStep()) {
        onNext();
      }
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

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#342d47] mb-4">Choose Payment Method <span className="text-red-500">*</span></h3>
            {errors.paymentMethod && <p className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>}

            <div className="space-y-4">
              {/* Credit/Debit Card */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodCard"
                  name="paymentMethod"
                  value="Credit/Debit Card"
                  checked={formData.paymentMethod === 'Credit/Debit Card'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodCard" className="ml-2 block text-sm font-medium text-gray-700">
                  Credit/Debit Card
                </Label>
              </div>
              {formData.paymentMethod === 'Credit/Debit Card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div>
                    <Label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</Label>
                    <Input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber || ''} onChange={handleChange} placeholder="XXXX XXXX XXXX XXXX" className={`${errors.cardNumber ? 'border-red-500' : ''}`} />
                    {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</Label>
                    <Input type="text" id="cardName" name="cardName" value={formData.cardName || ''} onChange={handleChange} placeholder="Full Name" className={`${errors.cardName ? 'border-red-500' : ''}`} />
                    {errors.cardName && <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</Label>
                    <Input type="text" id="expiryDate" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} placeholder="MM/YY" className={`${errors.expiryDate ? 'border-red-500' : ''}`} />
                    {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</Label>
                    <Input type="text" id="cvv" name="cvv" value={formData.cvv || ''} onChange={handleChange} placeholder="XXX" className={`${errors.cvv ? 'border-red-500' : ''}`} />
                    {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
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
                  checked={formData.paymentMethod === 'Bank Transfer'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodBankTransfer" className="ml-2 block text-sm font-medium text-gray-700">
                  Bank Transfer (Instructions will be provided)
                </Label>
              </div>
              {formData.paymentMethod === 'Bank Transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div>
                    <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</Label>
                    <Input type="text" id="bankName" name="bankName" value={formData.bankName || ''} onChange={handleChange} placeholder="e.g., BDO, BPI" className={`${errors.bankName ? 'border-red-500' : ''}`} />
                    {errors.bankName && <p className="mt-1 text-sm text-red-500">{errors.bankName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</Label>
                    <Input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} placeholder="e.g., 001234567890" className={`${errors.accountNumber ? 'border-red-500' : ''}`} />
                    {errors.accountNumber && <p className="mt-1 text-sm text-red-500">{errors.accountNumber}</p>}
                  </div>
                  <div className="col-span-full"> {/* Make this span full width */}
                    <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account Name</Label>
                    <Input type="text" id="accountName" name="accountName" value={formData.accountName || ''} onChange={handleChange} placeholder="Full Name of Account Holder" className={`${errors.accountName ? 'border-red-500' : ''}`} />
                    {errors.accountName && <p className="mt-1 text-sm text-red-500">{errors.accountName}</p>}
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
                  checked={formData.paymentMethod === 'GCash'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodGcash" className="ml-2 block text-sm font-medium text-gray-700">
                  GCash
                </Label>
              </div>
              {formData.paymentMethod === 'GCash' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div>
                    <Label htmlFor="gcashNumber" className="block text-sm font-medium text-gray-700 mb-1">GCash Number</Label>
                    <Input type="text" id="gcashNumber" name="gcashNumber" value={formData.gcashNumber || ''} onChange={handleChange} placeholder="e.g., 0917XXXXXXX" className={`${errors.gcashNumber ? 'border-red-500' : ''}`} />
                    {errors.gcashNumber && <p className="mt-1 text-sm text-red-500">{errors.gcashNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gcashName" className="block text-sm font-medium text-gray-700 mb-1">GCash Account Name</Label>
                    <Input type="text" id="gcashName" name="gcashName" value={formData.gcashName || ''} onChange={handleChange} placeholder="Full Name of GCash Account Holder" className={`${errors.gcashName ? 'border-red-500' : ''}`} />
                    {errors.gcashName && <p className="mt-1 text-sm text-red-500">{errors.gcashName}</p>}
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
                  checked={formData.paymentMethod === 'Cash/Cheque'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodCashCheque" className="ml-2 block text-sm font-medium text-gray-700">
                  Cash / Cheque (For in-person payment)
                </Label>
              </div>

            </div>
          </div>
        </div> {/* This closing div tag was missing */}

        <div className="flex justify-between mt-8">
          <Button
            onClick={onPrev} // Go back to Product Details step
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Previous: Product Details
          </Button>

          <Button
            type="button" // Changed to button to prevent default form submission
            onClick={handleNextClick} // Call handleNextClick for validation and progression
            className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
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