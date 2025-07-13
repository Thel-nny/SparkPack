"use client";

import React, { forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
// Updated import path to use applicationFormData.ts
import { ApplicationFormData } from '@/types/applicationFormData'; 

interface SummaryDetailsStepProps {
  formData: ApplicationFormData;
  onPrev: () => void;
  onNext: () => void; // This will trigger the final submission
}

const SummaryDetailsStep = forwardRef<any, SummaryDetailsStepProps>(
  ({ formData, onPrev, onNext }, ref) => {

    // This step is primarily for display, so validation might be minimal or always true.
    // However, exposing a validate function makes the parent component's logic consistent.
    const validateStep = (): boolean => {
      // You could add checks here if there are any specific conditions that need to be met
      // before allowing progression from the summary step (e.g., all previous steps are valid).
      // For now, assuming data is valid if we reached this step.
      return true; 
    };

    // Expose the validate function to the parent component via ref
    useImperativeHandle(ref, () => ({
      validate: validateStep,
    }));

    return (
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Application Summary</h2>
          <p className="text-gray-700 mb-6">Please review all the details carefully before submitting your application.</p>

          {/* Client Details Summary */}
          <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Client Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              <p><span className="font-medium">Name:</span> {formData.client.title} {formData.client.firstName} {formData.client.middleName} {formData.client.lastName}</p>
              <p><span className="font-medium">Date of Birth:</span> {formData.client.dob}</p>
              <p><span className="font-medium">Place of Birth:</span> {formData.client.pob || 'N/A'}</p>
              <p><span className="font-medium">Gender:</span> {formData.client.gender}</p>
              <p><span className="font-medium">Phone Number:</span> {formData.client.phoneNumber || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {formData.client.email}</p>
              <p className="col-span-full"><span className="font-medium">Address:</span> {formData.client.streetAddress}, {formData.client.city}, {formData.client.province}, {formData.client.postalCode}, {formData.client.country}</p>
              <p className="col-span-full"><span className="font-medium">Declaration Accuracy:</span> {formData.client.declarationAccuracy ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Pet Details Summary */}
          <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Pet Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              <p><span className="font-medium">Pet Name:</span> {formData.pet.petName}</p>
              <p><span className="font-medium">DOB/Adoption Date:</span> {formData.pet.dobOrAdoptionDate || 'N/A'}</p>
              <p><span className="font-medium">Estimated Age:</span> {formData.pet.estimatedAge || 'N/A'}</p>
              <p><span className="font-medium">Gender:</span> {formData.pet.gender}</p>
              <p><span className="font-medium">Species:</span> {formData.pet.species} {formData.pet.otherSpecies ? `(${formData.pet.otherSpecies})` : ''}</p>
              <p><span className="font-medium">Breed:</span> {formData.pet.breed} {formData.pet.otherBreed ? `(${formData.pet.otherBreed})` : ''}</p>
              <p><span className="font-medium">Microchip Number:</span> {formData.pet.microchipNumber || 'N/A'}</p>
              <p><span className="font-medium">Color/Markings:</span> {formData.pet.colorMarkings || 'N/A'}</p>
              <p><span className="font-medium">Spayed/Neutered:</span> {formData.pet.spayedNeutered}</p>
              <p><span className="font-medium">Vaccination Status:</span> {formData.pet.vaccinationStatus}</p>
              <p><span className="font-medium">Lifestyle:</span> {formData.pet.lifestyle}</p>
              <p className="col-span-full"><span className="font-medium">Chronic Illness:</span> {formData.pet.chronicIllness} {formData.pet.chronicIllnessExplanation ? `(${formData.pet.chronicIllnessExplanation})` : ''}</p>
              <p className="col-span-full"><span className="font-medium">Surgery History:</span> {formData.pet.surgeryHistory} {formData.pet.surgeryHistoryExplanation ? `(${formData.pet.surgeryHistoryExplanation})` : ''}</p>
              <p className="col-span-full"><span className="font-medium">Recurring Conditions:</span> {formData.pet.recurringConditions} {formData.pet.recurringConditionsExplanation ? `(${formData.pet.recurringConditionsExplanation})` : ''}</p>
              <p className="col-span-full"><span className="font-medium">On Medication:</span> {formData.pet.onMedication} {formData.pet.onMedicationExplanation ? `(${formData.pet.onMedicationExplanation})` : ''}</p>
              <p><span className="font-medium">Veterinarian:</span> {formData.pet.vetName || 'N/A'} ({formData.pet.vetClinicName || 'N/A'})</p>
              <p><span className="font-medium">Clinic Phone:</span> {formData.pet.clinicPhoneNumber || 'N/A'}</p>
              <p className="col-span-full"><span className="font-medium">Clinic Address:</span> {formData.pet.clinicAddress || 'N/A'}</p>
              <p><span className="font-medium">Last Vet Visit:</span> {formData.pet.lastVetVisitDate || 'N/A'}</p>
            </div>
          </div>

          {/* Product Details Summary */}
          <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              <p><span className="font-medium">Product Name:</span> {formData.product.productName}</p>
              <p><span className="font-medium">Coverage Amount:</span> {formData.product.coverageAmount}</p>
              <p><span className="font-medium">Deductible:</span> {formData.product.deductible}</p>
              <p><span className="font-medium">Reimbursement Rate:</span> {formData.product.reimbursementRate}</p>
              <p><span className="font-medium">Payment Frequency:</span> {formData.product.paymentFrequency}</p>
              <p><span className="font-medium">Start Date:</span> {formData.product.startDate}</p>
              <p><span className="font-medium">Coverage Length:</span> {formData.product.coverageLength}</p>

              <div className="col-span-full">
                <span className="font-medium">Selected Add-ons:</span>
                {formData.product.selectedAddOns.length > 0 ? (
                  <ul className="list-disc list-inside ml-4">
                    {formData.product.selectedAddOns.map(addon => (
                      <li key={addon.id}>{addon.name} (₱{addon.price.toLocaleString()}{addon.type === 'annual' ? ' Annual' : ' One-time'})</li>
                    ))}
                  </ul>
                ) : (
                  ' None'
                )}
              </div>

              <p><span className="font-medium">Donation Percentage:</span> {formData.product.donationPercentage}%</p>
            </div>
          </div>

          {/* Payment Details Summary - UPDATED */}
          <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              <p><span className="font-medium">Payment Method:</span> {formData.payment.paymentMethod || 'N/A'}</p>

              {/* Credit/Debit Card Details */}
              {formData.payment.paymentMethod === 'Credit/Debit Card' && (
                <>
                  <p><span className="font-medium">Card Number:</span> {formData.payment.cardNumber ? `**** **** **** ${formData.payment.cardNumber.slice(-4)}` : 'N/A'}</p>
                  <p><span className="font-medium">Name on Card:</span> {formData.payment.cardName || 'N/A'}</p>
                  <p><span className="font-medium">Expiry Date:</span> {formData.payment.expiryDate || 'N/A'}</p>
                  <p><span className="font-medium">CVV:</span> {formData.payment.cvv ? '***' : 'N/A'}</p> {/* Mask CVV for security */}
                </>
              )}

              {/* Bank Transfer Details */}
              {formData.payment.paymentMethod === 'Bank Transfer' && (
                <>
                  <p><span className="font-medium">Bank Name:</span> {formData.payment.bankName || 'N/A'}</p>
                  <p><span className="font-medium">Account Number:</span> {formData.payment.accountNumber || 'N/A'}</p>
                  <p className="col-span-full"><span className="font-medium">Account Name:</span> {formData.payment.accountName || 'N/A'}</p>
                </>
              )}

              {/* GCash Details */}
              {formData.payment.paymentMethod === 'GCash' && (
                <>
                  <p><span className="font-medium">GCash Number:</span> {formData.payment.gcashNumber || 'N/A'}</p>
                  <p><span className="font-medium">GCash Account Name:</span> {formData.payment.gcashName || 'N/A'}</p>
                </>
              )}

            </div>
          </div>

        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            onClick={onPrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Previous: Payment Details
          </Button>

          <Button
            onClick={onNext} // This will trigger the final submission logic in NewApplicationForm
            className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded"
          >
            Next: Sign & Submit
          </Button>
        </div>
      </div>
    );
  }
);

SummaryDetailsStep.displayName = 'SummaryDetailsStep';

export default SummaryDetailsStep;