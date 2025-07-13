import { useState } from 'react';
import { ApplicationFormData, SelectedAddOn } from '@/types/applicationFormData';

export function useApplicationFormData() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    client: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      phoneNumber: '',
      email: '',
      streetAddress: '',
      country: 'Philippines',
      city: 'Iloilo City',
      province: 'Iloilo',
      postalCode: '5000',
      declarationAccuracy: false,
      title: '',
      allowPhoneCollection: false,
      pob: '',
      middleName: '',
    },
    pet: {
      petName: '',
      dobOrAdoptionDate: '',
      weight: '',
      gender: '',
      species: '',
      breed: '',
      spayedNeutered: '',
      vaccinationStatus: '',
      lifestyle: '',
      chronicIllness: '',
      surgeryHistory: '',
      recurringConditions: '',
      onMedication: '',
      estimatedAge: '',
      otherSpecies: '',
      otherBreed: '',
      microchipNumber: '',
      colorMarkings: '',
      chronicIllnessExplanation: '',
      surgeryHistoryExplanation: '',
      recurringConditionsExplanation: '',
      onMedicationExplanation: '',
      vetName: '',
      vetClinicName: '',
      clinicPhoneNumber: '',
      clinicAddress: '',
      lastVetVisitDate: '',
    },
    product: {
      productName: '',
      planType: '',
      coverageAmount: '',
      deductible: '',
      reimbursementRate: '',
      paymentFrequency: '',
      startDate: new Date().toISOString().split('T')[0],
      coverageLength: '1 Year',
      selectedAddOns: [] as SelectedAddOn[],
      donationPercentage: 0,
    },
    payment: {
      paymentMethod: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      gcashNumber: '',
      gcashName: '',
    },
  });

  const updateFormData = <T extends keyof ApplicationFormData>(field: T, data: Partial<ApplicationFormData[T]>) => {
    setFormData((prevData: ApplicationFormData) => ({
      ...prevData,
      [field]: { ...prevData[field], ...data },
    }));
  };

  return { formData, updateFormData };
}
