"use client";

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import { createApplication, updateApplication } from '@/lib/api/applications';
import MessageModal from '@/components/ui/MessageModal';
import { useApplicationFormData } from './hooks/useApplicationFormData';
import { useModal } from './hooks/useModal';
import ApplicationFormStepper from './ApplicationFormStepper';
import { useSession } from "next-auth/react";
import { ApplicationFormData } from '@/types/applicationFormData';

const NewApplicationForm: FC = () => {
  const { formData, updateFormData } = useApplicationFormData();
  const {
    showModal,
    modalMessage,
    modalType,
    modalTitle,
    openModal,
    closeModal,
  } = useModal();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  React.useEffect(() => {
    if (!session?.user?.id) return;

    const userId = session.user.id;

    async function fetchClientDetails() {
      try {
        const response = await fetch(`/api/clientDetails/${userId}`);
        const result = await response.json();
        if (result.success && result.data) {
          const clientData = result.data;
          updateFormData('clientDetails', {
            firstName: clientData.firstName || '',
            lastName: clientData.lastName || '',
            dob: clientData.dob ? new Date(clientData.dob).toISOString().split('T')[0] : '',
            gender: clientData.gender || '',
            phoneNumber: clientData.phoneNumber || '',
            email: clientData.email || '',
            streetAddress: clientData.streetAddress || '',
            country: clientData.country || 'Philippines',
            city: clientData.city || 'Iloilo City',
            province: clientData.province || 'Iloilo',
            postalCode: clientData.postalCode || '5000',
            declarationAccuracy: clientData.declarationAccuracy || false,
            title: clientData.title || '',
            allowPhoneCollection: clientData.allowPhoneCollection || false,
            pob: clientData.pob || '',
            middleName: clientData.middleName || '',
          });
        }
      } catch (error) {
        console.error("Failed to fetch client details:", error);
      }
    }

    fetchClientDetails();
  }, [session, updateFormData]);

  const validateAllFormData = (): boolean => {
    const errors: string[] = [];

    // Client Details validation
    if (!formData.clientDetails.title) errors.push('Client Title is required.');
    if (!formData.clientDetails.firstName) errors.push('Client First Name is required.');
    if (!formData.clientDetails.lastName) errors.push('Client Last Name is required.');
    if (!formData.clientDetails.email || !/\S+@\S+\.\S+/.test(formData.clientDetails.email)) errors.push('Valid Client Email is required.');
    if (!formData.clientDetails.phoneNumber) errors.push('Client Phone Number is required.');
    if (!formData.clientDetails.dob) errors.push('Client Date of Birth is required.');
    if (!formData.clientDetails.pob) errors.push('Client Place of Birth is required.');
    if (!formData.clientDetails.gender) errors.push('Client Gender is required.');
    if (!formData.clientDetails.streetAddress) errors.push('Client Street Address is required.');
    if (!formData.clientDetails.declarationAccuracy) errors.push('Declaration Accuracy must be confirmed.');

    // Pet Details validation
    if (!formData.petDetails.petName) errors.push('Pet Name is required.');
    if (!formData.petDetails.dobOrAdoptionDate) errors.push('Pet Date of Birth or Adoption Date is required.');
    if (!formData.petDetails.weight) errors.push('Pet Weight is required.');
    if (!formData.petDetails.estimatedAge) errors.push('Pet Estimated Age is required.');
    if (!formData.petDetails.gender) errors.push('Pet Gender is required.');
    if (!formData.petDetails.species) errors.push('Pet Species is required.');
    if (formData.petDetails.species === 'Other' && !formData.petDetails.otherSpecies) errors.push('Please specify other species.');
    if (!formData.petDetails.breed) errors.push('Pet Breed is required.');
    if ((formData.petDetails.breed === 'Other' || formData.petDetails.breed === 'Mixed Breed') && !formData.petDetails.otherBreed) errors.push('Please specify other breed details.');
    if (!formData.petDetails.colorMarkings) errors.push('Pet Color/Markings are required.');
    if (!formData.petDetails.spayedNeutered) errors.push('Pet Spayed/Neutered status is required.');
    if (!formData.petDetails.vaccinationStatus) errors.push('Pet Vaccination Status is required.');
    if (!formData.petDetails.lifestyle) errors.push('Pet Lifestyle is required.');
    if (formData.petDetails.chronicIllness === 'Yes' && !formData.petDetails.chronicIllnessExplanation) errors.push('Explanation for Pet Chronic Illness is required.');
    if (formData.petDetails.surgeryHistory === 'Yes' && !formData.petDetails.surgeryHistoryExplanation) errors.push('Explanation for Pet Surgery History is required.');
    if (formData.petDetails.recurringConditions === 'Yes' && !formData.petDetails.recurringConditionsExplanation) errors.push('Explanation for Pet Recurring Conditions is required.');
    if (formData.petDetails.onMedication === 'Yes' && !formData.petDetails.onMedicationExplanation) errors.push('Explanation for Pet On Medication is required.');
    if (!formData.petDetails.vetName) errors.push('Veterinarian\'s Name is required.');
    if (!formData.petDetails.vetClinicName) errors.push('Veterinary Clinic Name is required.');
    if (!formData.petDetails.clinicPhoneNumber) errors.push('Clinic Phone Number is required.');
    if (!formData.petDetails.clinicAddress) errors.push('Clinic Address is required.');

    // Product Details validation
    if (!formData.productDetails.productName) errors.push('Product Name is required.');
    if (!formData.productDetails.planType) errors.push('Plan Type is required.');
    if (!formData.productDetails.coverageAmount) errors.push('Coverage Amount is required.');
    if (!formData.productDetails.deductible) errors.push('Deductible is required.');
    if (!formData.productDetails.reimbursementRate) errors.push('Reimbursement Rate is required.');
    if (!formData.productDetails.paymentFrequency) errors.push('Payment Frequency is required.');
    if (!formData.productDetails.startDate) errors.push('Product Start Date is required.');
    if (!formData.productDetails.coverageLength) errors.push('Coverage Length is required.');

    // Payment Details validation
    if (!formData.paymentDetails.paymentMethod) errors.push('Payment Method is required.');
    if (formData.paymentDetails.paymentMethod === 'Credit/Debit Card') {
      if (!formData.paymentDetails.cardNumber) errors.push('Card Number is required for Credit/Debit Card.');
      if (!formData.paymentDetails.cardName) errors.push('Card Name is required for Credit/Debit Card.');
      if (!formData.paymentDetails.expiryDate) errors.push('Expiry Date is required for Credit/Debit Card.');
      if (!formData.paymentDetails.cvv) errors.push('CVV is required for Credit/Debit Card.');
    } else if (formData.paymentDetails.paymentMethod === 'Bank Transfer') {
      if (!formData.paymentDetails.bankName) errors.push('Bank Name is required for Bank Transfer.');
      if (!formData.paymentDetails.accountNumber) errors.push('Account Number is required for Bank Transfer.');
      if (!formData.paymentDetails.accountName) errors.push('Account Name is required for Bank Transfer.');
    } else if (formData.paymentDetails.paymentMethod === 'GCash') {
      if (!formData.paymentDetails.gcashNumber) errors.push('GCash Number is required for GCash.');
      if (!formData.paymentDetails.gcashName) errors.push('GCash Name is required for GCash.');
    }

    if (errors.length > 0) {
      openModal('Submission Failed: Missing Information', `Please complete all required fields:\n- ${errors.join('\n- ')}`, 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('Final Form Submission Attempt:', formData);

    if (!validateAllFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedProduct = {
        ...formData.productDetails,
        deductible: formData.productDetails.deductible.replace(/[^0-9.-]+/g, ''),
      };

      const applicationData = {
        client: formData.clientDetails,
        pet: formData.petDetails,
        product: sanitizedProduct,
        payment: formData.paymentDetails,
      };

      const response = await createApplication(applicationData);

      if (response.data && response.data.id) {
        const statusUpdate = { updateData: { status: 'SUBMITTED' } };
        await updateApplication(response.data.id, statusUpdate);
      } else {
        throw new Error('Application ID not returned from creation.');
      }

      openModal('Application Submitted!', 'Your application has been submitted successfully.', 'success');
    } catch (error) {
      console.error('Error submitting application:', error);
      openModal('Submission Failed', `Submission failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (modalType === 'success') {
      router.push('/advisor/dashboard');
    }
    closeModal();
  };

  return (
    <>
      <ApplicationFormStepper
        formData={formData as ApplicationFormData}
        onUpdate={updateFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        openModal={openModal}
      />
      {showModal && (
        <MessageModal
          message={modalMessage}
          type={modalType}
          onClose={handleModalClose}
          title={modalTitle}
        />
      )}
    </>
  );
};

export default NewApplicationForm;
