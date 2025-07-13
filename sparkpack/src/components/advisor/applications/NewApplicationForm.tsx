"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { createApplication, updateApplication } from '@/lib/api/applications';
import MessageModal from '@/components/ui/MessageModal';
import { useApplicationFormData } from './hooks/useApplicationFormData';
import { useModal } from './hooks/useModal';
import ApplicationFormStepper from './ApplicationFormStepper';
import { useSession } from "next-auth/react";

const NewApplicationForm: React.FC = () => {
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
          updateFormData('client', {
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
    if (!formData.client.title) errors.push('Client Title is required.');
    if (!formData.client.firstName) errors.push('Client First Name is required.');
    if (!formData.client.lastName) errors.push('Client Last Name is required.');
    if (!formData.client.email || !/\S+@\S+\.\S+/.test(formData.client.email)) errors.push('Valid Client Email is required.');
    if (!formData.client.phoneNumber) errors.push('Client Phone Number is required.');
    if (!formData.client.dob) errors.push('Client Date of Birth is required.');
    if (!formData.client.pob) errors.push('Client Place of Birth is required.');
    if (!formData.client.gender) errors.push('Client Gender is required.');
    if (!formData.client.streetAddress) errors.push('Client Street Address is required.');
    if (!formData.client.declarationAccuracy) errors.push('Declaration Accuracy must be confirmed.');

    // Pet Details validation
    if (!formData.pet.petName) errors.push('Pet Name is required.');
    if (!formData.pet.weight) errors.push('Pet Weight is required.');
    if (!formData.pet.estimatedAge) errors.push('Pet Estimated Age is required.');
    if (!formData.pet.gender) errors.push('Pet Gender is required.');
    if (!formData.pet.species) errors.push('Pet Species is required.');
    if (formData.pet.species === 'Other' && !formData.pet.otherSpecies) errors.push('Please specify other species.');
    if (!formData.pet.breed) errors.push('Pet Breed is required.');
    if ((formData.pet.breed === 'Other' || formData.pet.breed === 'Mixed Breed') && !formData.pet.otherBreed) errors.push('Please specify other breed details.');
    if (!formData.pet.colorMarkings) errors.push('Pet Color/Markings are required.');
    if (!formData.pet.spayedNeutered) errors.push('Pet Spayed/Neutered status is required.');
    if (!formData.pet.vaccinationStatus) errors.push('Pet Vaccination Status is required.');
    if (!formData.pet.lifestyle) errors.push('Pet Lifestyle is required.');
    if (formData.pet.chronicIllness === 'Yes' && !formData.pet.chronicIllnessExplanation) errors.push('Explanation for Pet Chronic Illness is required.');
    if (formData.pet.surgeryHistory === 'Yes' && !formData.pet.surgeryHistoryExplanation) errors.push('Explanation for Pet Surgery History is required.');
    if (formData.pet.recurringConditions === 'Yes' && !formData.pet.recurringConditionsExplanation) errors.push('Explanation for Pet Recurring Conditions is required.');
    if (formData.pet.onMedication === 'Yes' && !formData.pet.onMedicationExplanation) errors.push('Explanation for Pet On Medication is required.');
    if (!formData.pet.vetName) errors.push('Veterinarian\'s Name is required.');
    if (!formData.pet.vetClinicName) errors.push('Veterinary Clinic Name is required.');
    if (!formData.pet.clinicPhoneNumber) errors.push('Clinic Phone Number is required.');
    if (!formData.pet.clinicAddress) errors.push('Clinic Address is required.');

    // Product Details validation
    if (!formData.product.productName) errors.push('Product Name is required.');
    if (!formData.product.planType) errors.push('Plan Type is required.');
    if (!formData.product.coverageAmount) errors.push('Coverage Amount is required.');
    if (!formData.product.deductible) errors.push('Deductible is required.');
    if (!formData.product.reimbursementRate) errors.push('Reimbursement Rate is required.');
    if (!formData.product.paymentFrequency) errors.push('Payment Frequency is required.');
    if (!formData.product.startDate) errors.push('Product Start Date is required.');
    if (!formData.product.coverageLength) errors.push('Coverage Length is required.');

    // Payment Details validation
    if (!formData.payment.paymentMethod) errors.push('Payment Method is required.');
    if (formData.payment.paymentMethod === 'Credit/Debit Card') {
      if (!formData.payment.cardNumber) errors.push('Card Number is required for Credit/Debit Card.');
      if (!formData.payment.cardName) errors.push('Card Name is required for Credit/Debit Card.');
      if (!formData.payment.expiryDate) errors.push('Expiry Date is required for Credit/Debit Card.');
      if (!formData.payment.cvv) errors.push('CVV is required for Credit/Debit Card.');
    } else if (formData.payment.paymentMethod === 'Bank Transfer') {
      if (!formData.payment.bankName) errors.push('Bank Name is required for Bank Transfer.');
      if (!formData.payment.accountNumber) errors.push('Account Number is required for Bank Transfer.');
      if (!formData.payment.accountName) errors.push('Account Name is required for Bank Transfer.');
    } else if (formData.payment.paymentMethod === 'GCash') {
      if (!formData.payment.gcashNumber) errors.push('GCash Number is required for GCash.');
      if (!formData.payment.gcashName) errors.push('GCash Name is required for GCash.');
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
        ...formData.product,
        deductible: formData.product.deductible.replace(/[^0-9.-]+/g, ''),
      };

      const applicationData = {
        client: formData.client,
        pet: formData.pet,
        product: sanitizedProduct,
        payment: formData.payment,
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
        formData={formData}
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
