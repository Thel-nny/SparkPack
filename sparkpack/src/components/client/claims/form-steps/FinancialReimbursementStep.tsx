'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FinancialReimbursementDetails {
  totalVetBillAmount: string;
  itemizedBillAttached: 'Yes' | 'No' | '';
  officialReceiptsAttached: 'Yes' | 'No' | '';
  reimbursementMethod: 'Credit/Debit Card' | 'Bank Transfer' | 'GCash' | 'Cash/Cheque' | '';
  // Credit/Debit Card fields (optional as they are conditional)
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  // Bank Transfer fields (optional as they are conditional)
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  // GCash fields (optional as they are conditional)
  gcashNumber?: string;
  gcashName?: string;
  // For 'Other' if it were reintroduced, or specific notes
  reimbursementDescription?: string; // Marked as optional as it's an "Optional" textarea
  preferredContactForUpdates: 'Email' | 'SMS' | '';
}

interface FinancialReimbursementStepProps {
  formData: FinancialReimbursementDetails;
  onUpdate: (data: Partial<FinancialReimbursementDetails>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const FinancialReimbursementStep: React.FC<FinancialReimbursementStepProps> = ({ formData, onUpdate, onPrev, onNext }) => {
  const [localFormData, setLocalFormData] = useState<FinancialReimbursementDetails>(formData);

  // --- CHANGE 1: Define errors state with correct type ---
  const [errors, setErrors] = useState<Partial<Record<keyof FinancialReimbursementDetails, string>>>({});
  // --- END CHANGE 1 ---

  // --- CHANGE 2: useEffect to sync formData from parent ---
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);
  // --- END CHANGE 2 ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean;

    // --- CHANGE 3: Safely handle 'checked' property for radios ---
    if (e.target instanceof HTMLInputElement && e.target.type === 'radio') {
      newValue = e.target.checked ? value : ''; // Set value if checked, otherwise empty string for unselected radios
    } else {
      newValue = value;
    }
    // --- END CHANGE 3 ---

    setLocalFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // --- CHANGE 4: Implement detailed validation function ---
  const validate = () => {
    let newErrors: Partial<Record<keyof FinancialReimbursementDetails, string>> = {};

    if (!localFormData.totalVetBillAmount || parseFloat(localFormData.totalVetBillAmount) <= 0) {
      newErrors.totalVetBillAmount = 'Total Amount of Vet Bill(s) for this Incident is required and must be greater than zero.';
    }
    if (!localFormData.itemizedBillAttached) {
      newErrors.itemizedBillAttached = 'Please confirm if an itemized bill is attached.';
    }
    if (!localFormData.officialReceiptsAttached) {
      newErrors.officialReceiptsAttached = 'Please confirm if official receipts are attached.';
    }
    if (!localFormData.reimbursementMethod) {
      newErrors.reimbursementMethod = 'Reimbursement Method is required.';
    }

    // Conditional validation based on reimbursement method
    if (localFormData.reimbursementMethod === 'Credit/Debit Card') {
      if (!localFormData.cardNumber) { newErrors.cardNumber = 'Card Number is required.'; }
      if (!localFormData.cardName) { newErrors.cardName = 'Name on Card is required.'; }
      if (!localFormData.expiryDate) { newErrors.expiryDate = 'Expiry Date is required.'; }
      if (!localFormData.cvv) { newErrors.cvv = 'CVV is required.'; }
    } else if (localFormData.reimbursementMethod === 'Bank Transfer') {
      if (!localFormData.bankName) { newErrors.bankName = 'Bank Name is required.'; }
      if (!localFormData.accountName) { newErrors.accountName = 'Account Name is required.'; }
      if (!localFormData.accountNumber) { newErrors.accountNumber = 'Account Number is required.'; }
    } else if (localFormData.reimbursementMethod === 'GCash') {
      if (!localFormData.gcashNumber) { newErrors.gcashNumber = 'GCash Number is required.'; }
      if (!localFormData.gcashName) { newErrors.gcashName = 'GCash Account Name is required.'; }
    }

    if (!localFormData.preferredContactForUpdates) {
      newErrors.preferredContactForUpdates = 'Preferred Contact for Reimbursement Updates is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // --- END CHANGE 4 ---

  const handleNextClick = () => {
    // --- CHANGE 5: Use validate function ---
    if (validate()) {
      onUpdate(localFormData);
      onNext();
    } else {
      alert('Please fill in all mandatory fields and correct any errors.');
    }
    // --- END CHANGE 5 ---
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Financial & Reimbursement Information</h2>
        <p className="text-gray-700 mb-6">This section is about the money!</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNextClick();
          }}
        >
          <div className="mb-6">
            <label htmlFor="totalVetBillAmount" className="block text-sm font-medium text-gray-700 mb-1">
              {/* --- FIX 6: Wrap label content in a fragment --- */}
              <>Total Amount of Vet Bill(s) for this Incident <span className="text-red-500">*</span></>
            </label>
            <Input
              id="totalVetBillAmount"
              name="totalVetBillAmount"
              type="number"
              min="0"
              step="0.01"
              value={localFormData.totalVetBillAmount}
              onChange={handleChange}
              placeholder="e.g., 5000.00"
              required
            />
            {errors.totalVetBillAmount && <p className="text-red-500 text-xs mt-1">{errors.totalVetBillAmount}</p>}
            <p className="text-sm text-gray-500 mt-1">Clearly state the grand total of all vet bills for this incident.</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {/* --- FIX 7: Wrap label content in a fragment --- */}
              <>Itemized Bill/Invoice Attached <span className="text-red-500">*</span></>
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  id="itemizedBillAttachedYes"
                  name="itemizedBillAttached"
                  type="radio"
                  value="Yes"
                  checked={localFormData.itemizedBillAttached === 'Yes'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="itemizedBillAttachedYes" className="ml-2 block text-sm text-gray-900">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="itemizedBillAttachedNo"
                  name="itemizedBillAttached"
                  type="radio"
                  value="No"
                  checked={localFormData.itemizedBillAttached === 'No'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="itemizedBillAttachedNo" className="ml-2 block text-sm text-gray-900">
                  No
                </label>
              </div>
            </div>
            {errors.itemizedBillAttached && <p className="text-red-500 text-xs mt-1">{errors.itemizedBillAttached}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {/* --- FIX 8: Wrap label content in a fragment --- */}
              <>Official Receipts Attached <span className="text-red-500">*</span></>
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  id="officialReceiptsAttachedYes"
                  name="officialReceiptsAttached"
                  type="radio"
                  value="Yes"
                  checked={localFormData.officialReceiptsAttached === 'Yes'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="officialReceiptsAttachedYes" className="ml-2 block text-sm text-gray-900">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="officialReceiptsAttachedNo"
                  name="officialReceiptsAttached"
                  type="radio"
                  value="No"
                  checked={localFormData.officialReceiptsAttached === 'No'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                  required
                />
                <label htmlFor="officialReceiptsAttachedNo" className="ml-2 block text-sm text-gray-900">
                  No
                </label>
              </div>
            </div>
            {errors.officialReceiptsAttached && <p className="text-red-500 text-xs mt-1">{errors.officialReceiptsAttached}</p>}
          </div>

          {/* Reimbursement Method Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {/* --- FIX 9: Wrap label content in a fragment --- */}
              <>Reimbursement Method <span className="text-red-500">*</span></>
            </label>
            <div className="space-y-4">
              {/* Credit/Debit Card */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodCard"
                  name="reimbursementMethod"
                  value="Credit/Debit Card"
                  checked={localFormData.reimbursementMethod === 'Credit/Debit Card'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodCard" className="ml-2 block text-sm font-medium text-gray-700">
                  Credit/Debit Card
                </Label>
              </div>
              {localFormData.reimbursementMethod === 'Credit/Debit Card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div>
                    <Label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</Label>
                    <Input type="text" id="cardNumber" name="cardNumber" value={localFormData.cardNumber || ''} onChange={handleChange} placeholder="XXXX XXXX XXXX XXXX" required />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</Label>
                    <Input type="text" id="cardName" name="cardName" value={localFormData.cardName || ''} onChange={handleChange} placeholder="Full Name" required />
                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</Label>
                    <Input type="text" id="expiryDate" name="expiryDate" value={localFormData.expiryDate || ''} onChange={handleChange} placeholder="MM/YY" required />
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</Label>
                    <Input type="text" id="cvv" name="cvv" value={localFormData.cvv || ''} onChange={handleChange} placeholder="XXX" required />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodBankTransfer"
                  name="reimbursementMethod"
                  value="Bank Transfer"
                  checked={localFormData.reimbursementMethod === 'Bank Transfer'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodBankTransfer" className="ml-2 block text-sm font-medium text-gray-700">
                  Bank Transfer (Instructions will be provided)
                </Label>
              </div>
              {localFormData.reimbursementMethod === 'Bank Transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div>
                    <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</Label>
                    <Input type="text" id="bankName" name="bankName" value={localFormData.bankName || ''} onChange={handleChange} placeholder="e.g., BDO, BPI" required />
                    {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</Label>
                    <Input type="text" id="accountNumber" name="accountNumber" value={localFormData.accountNumber || ''} onChange={handleChange} placeholder="e.g., 001234567890" required />
                    {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
                  </div>
                  <div className="col-span-full">
                    <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account Name</Label>
                    <Input type="text" id="accountName" name="accountName" value={localFormData.accountName || ''} onChange={handleChange} placeholder="Full Name of Account Holder" required />
                    {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
                  </div>
                </div>
              )}

              {/* GCash */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodGcash"
                  name="reimbursementMethod"
                  value="GCash"
                  checked={localFormData.reimbursementMethod === 'GCash'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodGcash" className="ml-2 block text-sm font-medium text-gray-700">
                  GCash
                </Label>
              </div>
              {localFormData.reimbursementMethod === 'GCash' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div>
                    <Label htmlFor="gcashNumber" className="block text-sm font-medium text-gray-700 mb-1">GCash Number</Label>
                    <Input type="text" id="gcashNumber" name="gcashNumber" value={localFormData.gcashNumber || ''} onChange={handleChange} placeholder="e.g., 0917XXXXXXX" required />
                    {errors.gcashNumber && <p className="text-red-500 text-xs mt-1">{errors.gcashNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gcashName" className="block text-sm font-medium text-gray-700 mb-1">GCash Account Name</Label>
                    <Input type="text" id="gcashName" name="gcashName" value={localFormData.gcashName || ''} onChange={handleChange} placeholder="Full Name of GCash Account Holder" required />
                    {errors.gcashName && <p className="text-red-500 text-xs mt-1">{errors.gcashName}</p>}
                  </div>
                </div>
              )}

               {/* Cash/Cheque - no additional fields for now */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentMethodCashCheque"
                  name="reimbursementMethod"
                  value="Cash/Cheque"
                  checked={localFormData.reimbursementMethod === 'Cash/Cheque'}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8cc63f] border-gray-300 focus:ring-[#8cc63f]"
                />
                <Label htmlFor="paymentMethodCashCheque" className="ml-2 block text-sm font-medium text-gray-700">
                  Cash / Cheque (For in-person payment)
                </Label>
              </div>
            </div>
            {errors.reimbursementMethod && <p className="text-red-500 text-xs mt-1">{errors.reimbursementMethod}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="reimbursementDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Reimbursement Notes (Optional)
            </label>
            <Textarea
              id="reimbursementDescription"
              name="reimbursementDescription"
              value={localFormData.reimbursementDescription || ''} // Ensure default empty string for optional
              onChange={handleChange}
              rows={4}
              placeholder="Any other details or instructions regarding the reimbursement."
            />
          </div>

          <div className="mb-6">
            <label htmlFor="preferredContactForUpdates" className="block text-sm font-medium text-gray-700 mb-2">
              {/* --- FIX 10: Wrap label content in a fragment --- */}
              <>Preferred Contact for Reimbursement Updates <span className="text-red-500">*</span></>
            </label>
            <select
              id="preferredContactForUpdates"
              name="preferredContactForUpdates"
              value={localFormData.preferredContactForUpdates}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8cc63f] focus:border-[#8cc63f] sm:text-sm rounded-md shadow-sm"
              required
            >
              <option value="">Select Contact Method</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
            </select>
            {errors.preferredContactForUpdates && <p className="text-red-500 text-xs mt-1">{errors.preferredContactForUpdates}</p>}
          </div>

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={onPrev} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
              Back
            </Button>
            <Button type="submit" className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialReimbursementStep;